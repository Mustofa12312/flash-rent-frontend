import * as functions from 'firebase-functions/v2';
import { db } from '../config/firebase';
import { PaymentService } from '../services/paymentService';
import { AccessManager } from '../services/accessManager';
import * as crypto from 'crypto';

export const createOrder = functions.https.onCall(async (request) => {
  try {
    const data = request.data;
    const { productId, packageId, customer } = data;

    if (!productId || !packageId || !customer || !customer.name || !customer.email || !customer.whatsapp) {
      throw new functions.https.HttpsError('invalid-argument', 'Missing required fields: productId, packageId, customer(name, email, whatsapp)');
    }

    // 1. Fetch Product and Package from DB to ensure prices are secure
    // In our simplified mock schema, we might store packages in a 'packages' collection or embedded
    // Assuming a sub-collection: products/{productId}/packages/{packageId}
    const productRef = db.collection('products').doc(productId);
    const productSnap = await productRef.get();
    
    if (!productSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Product not found');
    }
    const productData = productSnap.data()!;

    // For simplicity in this v1.0, let's assume we fetch the package details
    // If the DB is not fully populated yet, we'll gracefully fallback or throw error.
    const packageRef = productRef.collection('packages').doc(packageId);
    const packageSnap = await packageRef.get();
    
    if (!packageSnap.exists) {
      // In a real production, throw error. For our transition, allow fallback if testing
      throw new functions.https.HttpsError('not-found', 'Package not found');
    }
    const packageData = packageSnap.data()!;
    
    // Generate unique 3-digit code for manual static QRIS verification
    const uniqueCode = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
    const amount = packageData.price + uniqueCode;

    // 2. Create Order in DB
    const orderId = `FR-${new Date().toISOString().slice(2,10).replace(/-/g,'')}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    
    // 3. Generate QRIS via Payment Gateway
    const paymentResponse = await PaymentService.createQrisPayment(orderId, amount);

    // 4. Save Order
    const orderRef = db.collection('orders').doc(orderId);
    await orderRef.set({
      id: orderId,
      userId: request.auth?.uid || 'GUEST',
      customerName: customer.name,
      customerEmail: customer.email,
      customerWhatsapp: customer.whatsapp,
      productId: productId,
      packageId: packageId,
      productName: productData.name,
      productCategory: productData.category,
      packageName: packageData.name,
      packageDurationType: packageData.durationType,
      packageDurationValue: packageData.durationValue,
      packageDurationUnit: packageData.durationUnit,
      amount: amount,
      status: 'PENDING',
      paymentId: paymentResponse.transactionId,
      expiresAt: paymentResponse.expiresAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // 5. Save Payment Record
    const paymentRef = db.collection('payments').doc(paymentResponse.transactionId);
    await paymentRef.set({
      id: paymentResponse.transactionId,
      orderId: orderId,
      provider: 'MIDTRANS',
      paymentMethod: 'QRIS',
      amount: amount,
      status: 'PENDING',
      qrisUrl: paymentResponse.qrisUrl,
      providerTransactionId: paymentResponse.transactionId,
      expiresAt: paymentResponse.expiresAt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // 6. Return response to client
    return {
      orderId,
      amount,
      qrisUrl: paymentResponse.qrisUrl,
      expiresAt: paymentResponse.expiresAt
    };

  } catch (error: any) {
    console.error('[createOrder] Error:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', error.message || 'Internal Server Error');
  }
});

/**
 * Endpoint khusus Admin untuk memverifikasi pembayaran (Manual QRIS).
 */
export const verifyOrderPayment = functions.https.onCall(async (request) => {
  try {
    const { orderId, action } = request.data;
    const uid = request.auth?.uid;

    if (!uid) {
      throw new functions.https.HttpsError('unauthenticated', 'Anda harus login.');
    }

    // 1. Verifikasi apakah user yang memanggil ini adalah ADMIN
    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();
    
    if (!userSnap.exists || userSnap.data()?.role !== 'ADMIN') {
      throw new functions.https.HttpsError('permission-denied', 'Hanya admin yang dapat melakukan aksi ini.');
    }

    if (!orderId || !action || !['APPROVE', 'REJECT'].includes(action)) {
      throw new functions.https.HttpsError('invalid-argument', 'Parameter tidak valid (butuh orderId dan action = APPROVE/REJECT).');
    }

    const orderRef = db.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Pesanan tidak ditemukan.');
    }

    const orderData = orderSnap.data()!;

    if (orderData.status !== 'VERIFYING') {
      throw new functions.https.HttpsError('failed-precondition', `Pesanan ini tidak dalam status VERIFYING (Saat ini: ${orderData.status}).`);
    }

    if (action === 'REJECT') {
      // Tolak pembayaran
      await orderRef.update({
        status: 'FAILED',
        updatedAt: new Date().toISOString()
      });
      return { success: true, message: 'Pesanan telah ditolak.' };
    }

    if (action === 'APPROVE') {
      // 2. Jika disetujui, update status ke PAID
      await orderRef.update({
        status: 'PAID',
        updatedAt: new Date().toISOString()
      });

      if (orderData.paymentId) {
        await db.collection('payments').doc(orderData.paymentId).update({
          status: 'PAID',
          updatedAt: new Date().toISOString()
        });
      }

      // 3. Generate Kredensial via AccessManager
      const accessData = await AccessManager.assignAccessData(
        orderData.productId, 
        orderId, 
        orderData.productCategory
      );

      // 4. Buat dokumen Rentals
      const rentalId = `RNT-${new Date().toISOString().slice(2,10).replace(/-/g,'')}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
      
      // Calculate Expiry if not UNLIMITED
      let expiresAt: string | null = null;
      if (orderData.packageDurationType !== 'UNLIMITED') {
        const now = new Date();
        const value = orderData.packageDurationValue || 30;
        
        if (orderData.packageDurationUnit === 'Hari') now.setDate(now.getDate() + value);
        else if (orderData.packageDurationUnit === 'Bulan') now.setMonth(now.getMonth() + value);
        else if (orderData.packageDurationUnit === 'Tahun') now.setFullYear(now.getFullYear() + value);
        
        expiresAt = now.toISOString();
      }

      const rentalRef = db.collection('rentals').doc(rentalId);
      await rentalRef.set({
        id: rentalId,
        orderId: orderId,
        userId: orderData.userId,
        productId: orderData.productId,
        productName: orderData.productName,
        packageId: orderData.packageId,
        package: orderData.packageName,
        durationUnit: orderData.packageDurationUnit,
        durationValue: orderData.packageDurationValue,
        status: 'ACTIVE',
        accessData: accessData,
        createdAt: new Date().toISOString(),
        expiresAt: expiresAt
      });

      return { success: true, message: 'Pesanan berhasil disetujui dan lisensi dibuat.' };
    }

    return { success: false, message: 'Unhandled action' };
  } catch (error: any) {
    console.error('[verifyOrderPayment] Error:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError('internal', error.message || 'Internal Server Error');
  }
});

