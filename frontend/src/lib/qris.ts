/**
 * Fungsi untuk mengkalkulasi CRC16 CCITT (Polynomial 0x1021)
 * Standar yang digunakan oleh EMVCo (QRIS)
 */
function calculateCRC16(str: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = (crc << 1);
      }
    }
  }
  crc &= 0xFFFF;
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Mengubah QRIS Statis menjadi QRIS Dinamis (Otomatis terisi nominal)
 */
export function generateDynamicQRIS(amount: number): string {
  // Base String QRIS Statis Pribadi Anda (tanpa 8 karakter terakhir CRC)
  const originalString = "00020101021126570011ID.DANA.WWW011893600915303466384502090346638450303UMI51440014ID.CO.QRIS.WWW0215ID10265825957850303UMI5204899953033605802ID5910Flash Rent6012Kab. Sampang610569254";
  
  // 1. Ubah Tag 01 (Point of Initiation Method) dari '11' (Static) menjadi '12' (Dynamic)
  let dynamicString = originalString.replace("010211", "010212");
  
  // 2. Tambahkan Tag 54 (Transaction Amount)
  const amountStr = String(Math.floor(amount));
  const amountLength = String(amountStr.length).padStart(2, '0');
  const amountTag = `54${amountLength}${amountStr}`;
  
  dynamicString += amountTag;
  
  // 3. Tambahkan ID CRC (Tag 63, length 04)
  dynamicString += "6304";
  
  // 4. Kalkulasi CRC16 baru dan gabungkan
  const newCRC = calculateCRC16(dynamicString);
  return dynamicString + newCRC;
}
