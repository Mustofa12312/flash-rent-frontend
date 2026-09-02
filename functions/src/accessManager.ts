

export interface AccessData {
  type: 'ACCOUNT' | 'LICENSE' | 'INVITE_LINK';
  username?: string;
  password?: string;
  licenseKey?: string;
  url?: string;
  instructions: string;
}

export const AccessManager = {
  /**
   * Mengambil dan mengalokasikan (assign) kredensial / barang digital ke pelanggan.
   * Di dunia nyata, ini akan mengambil stok dari tabel 'inventory' dengan transaction.
   */
  async assignAccessData(productId: string, orderId: string, category: string): Promise<AccessData> {
    // 1. (Simulasi) Cek tabel inventory untuk stok yang 'AVAILABLE'
    // const inventoryRef = db.collection('inventory').where('productId', '==', productId).where('status', '==', 'AVAILABLE').limit(1);
    
    // 2. Mocking alokasi stok berdasarkan kategori
    let accessData: AccessData;

    if (category?.toUpperCase() === 'SOFTWARE' || category?.toUpperCase() === 'DESIGN') {
      // Produk seperti Windows, Antivirus, atau Software Design biasanya berbasis License Key
      accessData = {
        type: 'LICENSE',
        licenseKey: `FLSH-${orderId.substring(orderId.length - 4)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        instructions: 'Masukkan License Key ini di aplikasi resmi untuk aktivasi premium.'
      };
    } else {
      // Produk hiburan (Netflix, Spotify) biasanya berupa akun (Username + Password)
      accessData = {
        type: 'ACCOUNT',
        username: `user_${orderId.substring(orderId.length - 4)}@flashrent.com`,
        password: `Pwd-${Math.random().toString(36).substring(2, 8)}!`,
        instructions: 'Gunakan kredensial ini untuk login ke platform. Dilarang mengganti password akun.'
      };
    }

    // 3. (Simulasi) Update status inventory menjadi 'IN_USE' dan terikat dengan orderId
    // await db.collection('inventory').doc(docId).update({ status: 'IN_USE', orderId });

    return accessData;
  }
};
