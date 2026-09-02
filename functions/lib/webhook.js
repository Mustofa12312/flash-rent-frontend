"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentWebhook = void 0;
const functions = __importStar(require("firebase-functions/v2"));
const firestore_1 = require("firebase-admin/firestore");
const rentalEngine_1 = require("./rentalEngine");
const accessManager_1 = require("./accessManager");
const notification_1 = require("./notification");
const db = (0, firestore_1.getFirestore)();
exports.paymentWebhook = functions.https.onRequest(async (request, response) => {
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
        const accessData = await accessManager_1.AccessManager.assignAccessData(order?.productId || 'UNKNOWN', orderId, category);
        // 4. Update status Order menjadi PAID
        await orderRef.update({
            status: 'PAID',
            updatedAt: new Date().toISOString()
        });
        // 5. Memicu RentalEngine untuk membuat objek Rental aktif
        const rentalPayload = {
            orderId: orderId,
            userId: order?.userId || 'GUEST',
            productId: order?.productId,
            packageId: order?.packageId,
            durationType: order?.packageDurationType || 'LIMITED',
            durationValue: order?.packageDurationValue || 30,
            durationUnit: order?.packageDurationUnit || 'DAYS',
            accessData: accessData
        };
        await rentalEngine_1.RentalEngine.createRental(rentalPayload);
        // 6. Kirim Notifikasi via Email & WhatsApp
        const customerData = {
            name: order?.customerName || 'Customer',
            phone: order?.customerWhatsapp || '0000',
            email: order?.customerEmail || 'no-reply@example.com'
        };
        const productName = order?.productName || 'Produk Flash Rent';
        // Jangan 'await' jika ingin response webhook lebih cepat (Fire & Forget)
        // Tapi di cloud function disarankan di-await agar tidak mati prosesnya.
        await notification_1.NotificationManager.notifySuccess(customerData, productName, accessData);
        response.status(200).send('Success: Order PAID, Rental Created, and Notification Sent');
    }
    catch (error) {
        console.error('Webhook Error:', error);
        response.status(500).send('Internal Server Error');
    }
});
//# sourceMappingURL=webhook.js.map