import * as functions from 'firebase-functions/v2';
import { getFirestore } from 'firebase-admin/firestore';
import { RentalEngine, RentalCreateData } from './rentalEngine';
import { AccessManager } from './accessManager';
import { NotificationManager } from './notification';

const db = getFirestore();

export const paymentWebhook = functions.https.onRequest(async (request, response) => {
  try {
    // 1. Verifikasi Signature & Payload (Disesuaikan dengan provider, misal: Midtrans/Xendit)
    const { orderId, status, secretKey } = request.body;

    // Dummy validation
    if (secretKey !== 'MY_SECRET_KEY') {
      response.status(403).send('Unauthorized');
      return;
    }

    if (status !== 'PAID') {
      response.status(200).send('Ignored: Status not PAID');
      return;
    }

    // 2. Ambil data Order dari Firestore
    const orderRef = db.collection('orders').doc(orderId);
    const orderSnap = await orderRef.get();
    
    if (!orderSnap.exists) {
      response.status(404).send('Order not found');
      return;
    }
    
    const order = orderSnap.data();
    if (order?.status === 'PAID') {
      response.status(200).send('Already processed');
      return;
    }

    // 3. Ambil data Product dan Package untuk detail akses
    // Integrasi dengan Access Manager
    const category = order?.productCategory || 'SOFTWARE';
    const accessData = await AccessManager.assignAccessData(order?.productId || 'UNKNOWN', orderId, category);

    // 4. Update status Order menjadi PAID
    await orderRef.update({
      status: 'PAID',
      updatedAt: new Date().toISOString()
    });

    // 5. Memicu RentalEngine untuk membuat objek Rental aktif
    const rentalPayload: RentalCreateData = {
      orderId: orderId,
      userId: order?.userId || 'GUEST',
      productId: order?.productId,
      packageId: order?.packageId,
      durationType: order?.packageDurationType || 'LIMITED',
      durationValue: order?.packageDurationValue || 30,
      durationUnit: order?.packageDurationUnit || 'DAYS',
      accessData: accessData
    };

    await RentalEngine.createRental(rentalPayload);

    // 6. Kirim Notifikasi via Email & WhatsApp
    const customerData = {
      name: order?.customerName || 'Customer',
      phone: order?.customerWhatsapp || '0000',
      email: order?.customerEmail || 'no-reply@example.com'
    };
    const productName = order?.productName || 'Produk Flash Rent';
    
    // Jangan 'await' jika ingin response webhook lebih cepat (Fire & Forget)
    // Tapi di cloud function disarankan di-await agar tidak mati prosesnya.
    await NotificationManager.notifySuccess(customerData, productName, accessData);

    response.status(200).send('Success: Order PAID, Rental Created, and Notification Sent');
  } catch (error) {
    console.error('Webhook Error:', error);
    response.status(500).send('Internal Server Error');
  }
});
