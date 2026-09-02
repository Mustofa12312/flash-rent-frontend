import { 
  sendSignInLinkToEmail, 
  isSignInWithEmailLink, 
  signInWithEmailLink, 
  signOut, 
  onAuthStateChanged, 
  type User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import type { User } from '../../types';

export const AuthService = {
  /**
   * Mengirimkan magic link ke email customer untuk login/register
   */
  async sendLoginLink(email: string, redirectUrl: string) {
    const actionCodeSettings = {
      url: redirectUrl,
      handleCodeInApp: true,
    };
    
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // Simpan email di local storage untuk proses verify nanti
    window.localStorage.setItem('emailForSignIn', email);
  },

  /**
   * Memverifikasi login dari magic link
   */
  async verifyLoginLink(url: string) {
    if (isSignInWithEmailLink(auth, url)) {
      let email = window.localStorage.getItem('emailForSignIn');
      
      if (!email) {
        // Jika tidak ada di localStorage (mungkin dibuka di tab/browser lain)
        // maka pada implementasi aslinya kita bisa prompt user untuk input email lagi.
        throw new Error('Email tidak ditemukan untuk verifikasi.');
      }

      const result = await signInWithEmailLink(auth, email, url);
      window.localStorage.removeItem('emailForSignIn');
      
      // Sinkronisasi data ke Firestore 'users' collection
      await this.syncUserToFirestore(result.user);
      
      return result.user;
    }
    throw new Error('Link tidak valid atau sudah kadaluarsa.');
  },

  /**
   * Sync data user Firebase Auth ke tabel `users` di Firestore
   */
  async syncUserToFirestore(firebaseUser: FirebaseUser) {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        role: 'CUSTOMER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(userRef, newUser);
    }
  },

  /**
   * Listen status autentikasi
   */
  listenAuth(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  /**
   * Logout
   */
  async logout() {
    return signOut(auth);
  }
};
