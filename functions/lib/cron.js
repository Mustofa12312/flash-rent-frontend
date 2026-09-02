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
exports.checkExpiredRentals = void 0;
const functions = __importStar(require("firebase-functions/v2"));
const firestore_1 = require("firebase-admin/firestore");
const db = (0, firestore_1.getFirestore)();
/**
 * Cron job berjalan setiap tengah malam (00:00) zona waktu UTC
 * Tugas: Mencari rental dengan status 'ACTIVE' yang sudah melewati tanggal kadaluarsa (expiresAt < NOW)
 */
exports.checkExpiredRentals = functions.scheduler.onSchedule('every day 00:00', async (event) => {
    const now = new Date().toISOString();
    try {
        // Query rentals: ACTIVE and expiresAt < NOW
        // Note: requires composite index on Firestore for status & expiresAt
        const rentalsRef = db.collection('rentals');
        const expiredQuery = rentalsRef
            .where('status', '==', 'ACTIVE')
            .where('expiresAt', '<', now);
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
        snapshot.docs.forEach((doc) => {
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
    }
    catch (error) {
        console.error('Error executing checkExpiredRentals:', error);
    }
});
//# sourceMappingURL=cron.js.map