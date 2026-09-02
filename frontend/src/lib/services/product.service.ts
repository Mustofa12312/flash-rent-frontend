import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import type { Product, Package } from '../../types';

const PRODUCTS_COLLECTION = 'products';
const PACKAGES_COLLECTION = 'packages';

export const ProductService = {
  /**
   * Mengambil semua produk yang berstatus ACTIVE
   */
  async getActiveProducts(): Promise<Product[]> {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('status', '==', 'ACTIVE')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  },

  /**
   * Mengambil detail produk berdasarkan ID
   */
  async getProduct(id: string): Promise<Product | null> {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  },

  /**
   * Mengambil paket-paket yang tersedia untuk suatu produk
   */
  async getProductPackages(productId: string): Promise<Package[]> {
    const q = query(
      collection(db, PACKAGES_COLLECTION),
      where('productId', '==', productId),
      where('status', '==', 'ACTIVE')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Package));
  },
  
  /**
   * Mengambil spesifik paket berdasarkan ID
   */
  async getPackage(packageId: string): Promise<Package | null> {
    const docRef = doc(db, PACKAGES_COLLECTION, packageId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Package;
    }
    return null;
  }
};
