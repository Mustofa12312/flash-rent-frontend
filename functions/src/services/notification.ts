import { AccessData } from './accessManager';

export const NotificationManager = {
  /**
   * Simulasi pengiriman notifikasi WhatsApp
   */
  async sendWhatsAppMessage(phone: string, customerName: string, productName: string, accessData: AccessData) {
    let credentialsText = '';
    
    if (accessData.type === 'LICENSE') {
      credentialsText = `🔑 *License Key*: ${accessData.licenseKey}`;
    } else if (accessData.type === 'ACCOUNT') {
      credentialsText = `👤 *Username*: ${accessData.username}\n🔒 *Password*: ${accessData.password}`;
    }

    const message = `Halo ${customerName}, terima kasih telah menyewa di Flash Rent! 🎉

Pesanan Anda untuk *${productName}* telah berhasil diaktifkan.

Berikut adalah detail akses Anda:
${credentialsText}

📌 *Instruksi*: ${accessData.instructions}

Jika ada kendala, silakan balas pesan ini. Terima kasih!`;

    // Di dunia nyata, ini akan memanggil API Wablas/Twilio/Fonnte
    // await fetch('https://api.whatsapp-provider.com/send', { ... })
    
    console.log(`\n[MOCK WHATSAPP] Sending to: ${phone}`);
    console.log(message);
    console.log('--------------------------------------------------\n');
  },

  /**
   * Simulasi pengiriman notifikasi Email
   */
  async sendEmail(email: string, customerName: string, productName: string, accessData: AccessData) {
    // Di dunia nyata, ini akan memanggil API SendGrid / Nodemailer
    
    console.log(`\n[MOCK EMAIL] Sending to: ${email}`);
    console.log(`Subject: Akses Produk Flash Rent - ${productName}`);
    console.log(`Halo ${customerName}, Pesanan ${productName} Anda sudah aktif. Kredensial telah kami siapkan.`);
    console.log('--------------------------------------------------\n');
  },

  /**
   * Fungsi helper utama yang dipanggil oleh Webhook
   */
  async notifySuccess(customerData: { name: string, phone: string, email: string }, productName: string, accessData: AccessData) {
    try {
      // Jalankan secara paralel agar tidak memperlambat response webhook
      await Promise.all([
        this.sendWhatsAppMessage(customerData.phone, customerData.name, productName, accessData),
        this.sendEmail(customerData.email, customerData.name, productName, accessData)
      ]);
    } catch (error) {
      console.error('Failed to send notifications:', error);
    }
  }
};
