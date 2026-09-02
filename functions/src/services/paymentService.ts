export const PaymentService = {
  /**
   * Mock integration with Payment Gateway (e.g., Midtrans / Xendit).
   * In a real application, this would make an API call to the provider.
   */
  async createQrisPayment(orderId: string, amount: number): Promise<{ qrisUrl: string, transactionId: string, expiresAt: string }> {
    console.log(`[PaymentService] Generating QRIS for order ${orderId} with amount ${amount}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const transactionId = `mock_trx_${Date.now()}`;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Expire in 15 mins

    // Return dummy data
    return {
      qrisUrl: `https://api.sandbox.midtrans.com/v2/qris/${transactionId}/qr-code`,
      transactionId,
      expiresAt: expiresAt.toISOString()
    };
  }
};
