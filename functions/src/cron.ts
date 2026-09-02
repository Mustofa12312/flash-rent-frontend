import * as functions from 'firebase-functions/v2';

import { getFirestore } from 'firebase-admin/firestore';

const db = getFirestore();

/**
 * Cron job berjalan setiap tengah malam (00:00) zona waktu UTC
 * Tugas: Mencari rental dengan status 'ACTIVE' yang sudah melewati tanggal kadaluarsa (expiresAt < NOW)
 */
export const checkExpiredRentals = functions.scheduler.onSchedule('every day 00:00', async (event) => {
  const now = new Date().toISOString();
  
  try {
    // Query rentals: ACTIVE and expiresAt < NOW
    // Note: requires composite index on Firestore for status & expiresAt
    const rentalsRef = db.collection('rentals');
    const expiredQuery = rentalsRef
      .where('status', '==', 'ACTIVE')
      .where('expiresAt', '<', now)
      // Abaikan unlimited yang memiliki expiresAt = null
      // Query dengan '<' secara otomatis akan mengabaikan nilai null pada Firestore
      
    const snapshot = await expiredQuery.get();

    if (snapshot.empty) {
      console.log('No expired rentals found today.');
      return;
    }

    console.log(`Found ${snapshot.size} expired rentals. Processing...`);

    // Batch update to change status to EXPIRED
    const batch = db.batch();
    
    snapshot.docs.forEach((doc: any) => {
      const docRef = rentalsRef.doc(doc.id);
      batch.update(docRef, { 
        status: 'EXPIRED',
        updatedAt: now
      });
      // Di sistem yang lebih kompleks, kita juga bisa mencabut akses (revoking password/license)
      // dengan memanggil API provider produk.
    });

    await batch.commit();
    console.log(`Successfully updated ${snapshot.size} rentals to EXPIRED.`);
  } catch (error) {
    console.error('Error executing checkExpiredRentals:', error);
  }
});
