"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalEngine = void 0;
const firestore_1 = require("firebase-admin/firestore");
const db = (0, firestore_1.getFirestore)();
exports.RentalEngine = {
    /**
     * Menghitung tanggal kadaluarsa berdasarkan jenis paket
     */
    calculateExpiryDate(durationType, durationValue, durationUnit) {
        if (durationType === 'UNLIMITED' || !durationValue || !durationUnit) {
            return null;
        }
        const date = new Date();
        switch (durationUnit) {
            case 'DAYS':
                date.setDate(date.getDate() + durationValue);
                break;
            case 'MONTHS':
                date.setMonth(date.getMonth() + durationValue);
                break;
            case 'YEARS':
                date.setFullYear(date.getFullYear() + durationValue);
                break;
            default:
                // Fallback default 30 hari
                date.setDate(date.getDate() + 30);
        }
        return date;
    },
    /**
     * Membuat record Rental baru saat pembayaran sukses (Webhook PAID)
     */
    async createRental(data) {
        const expiresAt = this.calculateExpiryDate(data.durationType, data.durationValue, data.durationUnit);
        const rentalData = {
            orderId: data.orderId,
            userId: data.userId,
            productId: data.productId,
            packageId: data.packageId,
            status: 'ACTIVE',
            expiresAt: expiresAt ? expiresAt.toISOString() : null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            accessData: data.accessData // Kredensial rahasia / license key
        };
        const docRef = await db.collection('rentals').add(rentalData);
        return { id: docRef.id, ...rentalData };
    },
    /**
     * Memperpanjang durasi rental yang sudah ada
     */
    async processRenewal(rentalId, extensionDays) {
        const rentalRef = db.collection('rentals').doc(rentalId);
        return db.runTransaction(async (transaction) => {
            const doc = await transaction.get(rentalRef);
            if (!doc.exists) {
                throw new Error('Rental tidak ditemukan');
            }
            const rental = doc.data();
            if (!rental)
                throw new Error('Data kosong');
            if (rental.expiresAt === null) {
                throw new Error('Rental ini UNLIMITED, tidak perlu diperpanjang.');
            }
            const currentExpiry = new Date(rental.expiresAt);
            const newExpiry = new Date(currentExpiry.getTime());
            newExpiry.setDate(newExpiry.getDate() + extensionDays);
            transaction.update(rentalRef, {
                expiresAt: newExpiry.toISOString(),
                status: 'ACTIVE', // Aktifkan kembali jika sebelumnya expired
                updatedAt: new Date().toISOString()
            });
            return {
                ...rental,
                expiresAt: newExpiry.toISOString(),
                status: 'ACTIVE'
            };
        });
    }
};
//# sourceMappingURL=rentalEngine.js.map