import * as functions from 'firebase-functions/v2';
import { db } from '../config/firebase';
import { PaymentService } from '../services/paymentService';
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
    const amount = packageData.price;

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
