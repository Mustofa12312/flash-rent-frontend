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
   * Men-generate kredensial / barang digital ke pelanggan (Versi Frontend)
   */
  async assignAccessData(_productId: string, orderId: string, category: string): Promise<AccessData> {
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

    return accessData;
  }
};
