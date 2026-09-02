import * as admin from 'firebase-admin';

process.env.GCLOUD_PROJECT = 'demo-flash-rent';
admin.initializeApp({ projectId: 'demo-flash-rent' });

import { getFirestore } from 'firebase-admin/firestore';
const db = getFirestore();

// Mock Firestore prototype directly
(db as any).collection = () => ({
  doc: () => ({
    get: async () => ({
      exists: true,
      data: () => ({
        status: 'PENDING',
        customerName: 'Budi Santoso',
        customerWhatsapp: '081234567890',
        customerEmail: 'budi@example.com',
        productId: 'prod-win11',
        productName: 'Windows 11 Pro',
        productCategory: 'SOFTWARE',
        packageId: 'pkg-win-lifetime',
        packageDurationType: 'UNLIMITED',
      })
    }),
    update: async () => true
  }),
  add: async () => ({ id: 'rental-123' })
});

const mockRequest: any = {
  body: {
    orderId: 'FR-20260902-1234',
    status: 'PAID',
    secretKey: 'MY_SECRET_KEY'
  }
};

const mockResponse: any = {
  status: (code: number) => ({
    send: (msg: string) => {
      console.log(`\n[WEBHOOK RESPONSE] Status: ${code}, Message: ${msg}\n`);
    }
  })
};

// Gunakan dynamic import agar initializeApp dieksekusi lebih dulu
async function runTest() {
  const { paymentWebhook } = await import('./webhook');

  console.log('--- MEMULAI SIMULASI WEBHOOK ---');
  console.log(`Menerima payload pembayaran dari Gateway untuk Order: ${mockRequest.body.orderId}`);
  
  await paymentWebhook(mockRequest, mockResponse);
  
  console.log('--- SIMULASI SELESAI ---');
}

runTest().catch(console.error);
