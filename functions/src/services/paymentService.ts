export const PaymentService = {
  /**
   * QRIS Pribadi Statis.
   * Karena menggunakan QRIS statis, kita tidak memanggil Payment Gateway.
   */
  async createQrisPayment(orderId: string, amount: number): Promise<{ qrisUrl: string, transactionId: string, expiresAt: string }> {
    console.log(`[PaymentService] Using Static QRIS for order ${orderId} with amount ${amount}`);
    
    const transactionId = `trx_${Date.now()}`;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Expire in 15 mins

    return {
      // URL ke gambar QRIS statis milik admin (bisa disimpan di Firebase Storage/Hosting)
      qrisUrl: `/images/qris-pribadi.png`,
      transactionId,
      expiresAt: expiresAt.toISOString()
    };
  }
};
