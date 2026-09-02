import * as admin from 'firebase-admin';

// Inisialisasi Firebase Admin App sebelum meng-import module lain yang menggunakan db
admin.initializeApp();

// Export fungsi-fungsi Cloud
export { paymentWebhook } from './webhook';
export { checkExpiredRentals } from './cron';
