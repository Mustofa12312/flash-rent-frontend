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
exports.RentalEngine = void 0;
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
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