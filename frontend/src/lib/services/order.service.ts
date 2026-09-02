import { addDoc, collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import type { Order, Payment, Product, Package } from '../../types';

const ORDERS_COLLECTION = 'orders';
const PAYMENTS_COLLECTION = 'payments';

export interface CheckoutPayload {
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  product: Product;
  pkg: Package;
}

export const OrderService = {
  /**
   * Membuat order baru saat customer checkout
   * Note: Pada implementasi sebenarnya, memanggil API/Cloud Function lebih aman.
   */
  async createCheckout(payload: CheckoutPayload): Promise<Order> {
    const orderData: Partial<Order> = {
      orderNumber: `FR-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerWhatsapp: payload.customerWhatsapp,
      productId: payload.product.id,
      packageId: payload.pkg.id,
      productName: payload.product.name,
      packageName: payload.pkg.name,
      amount: payload.pkg.price,
      status: 'PENDING_PAYMENT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData);
    
    // Simulate trigger to Cloud Function which would create the Payment Document & QRIS
    return { id: docRef.id, ...orderData } as Order;
  },

  /**
   * Mendengarkan (listen) perubahan status payment secara realtime (untuk UI QRIS)
   */
  listenToPayment(orderId: string, onUpdate: (payment: Payment | null) => void) {
    const q = query(collection(db, PAYMENTS_COLLECTION), where('orderId', '==', orderId));
    
    return onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const paymentDoc = snapshot.docs[0];
        onUpdate({ id: paymentDoc.id, ...paymentDoc.data() } as Payment);
      } else {
        onUpdate(null);
      }
    });
  },

  /**
   * Mengambil detail Order beserta statusnya
   */
  async getOrder(orderId: string): Promise<Order | null> {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Order;
    }
    return null;
  }
};
