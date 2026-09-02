export type DurationType = 'LIMITED' | 'UNLIMITED';
export type DurationUnit = 'DAYS' | 'MONTHS' | 'YEARS';
export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'EXPIRED' | 'CANCELLED';
export type RentalStatus = 'PENDING' | 'ACTIVE' | 'EXPIRING' | 'EXPIRED' | 'CANCELLED';
export type AccessType = 'LICENSE_KEY' | 'CREDENTIAL' | 'ACCESS_URL';

export interface User {
  id: string;
  email: string;
  name?: string;
  whatsapp?: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  image?: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface Package {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  durationType: DurationType;
  durationValue: number | null;
  durationUnit: DurationUnit | null;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  productId: string;
  packageId: string;
  productName: string;
  packageName: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  provider: string; // e.g., 'XENDIT', 'MIDTRANS'
  paymentMethod: string; // e.g., 'QRIS'
  amount: number;
  status: PaymentStatus;
  qrCode?: string;
  expiresAt: string;
  providerTransactionId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Rental {
  id: string;
  userId: string;
  orderId: string;
  productId: string;
  packageId: string;
  startAt: string;
  expiresAt: string | null;
  durationType: DurationType;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Access {
  id: string;
  rentalId: string;
  userId: string;
  type: AccessType;
  licenseKey?: string;
  username?: string;
  password?: string;
  accessUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  maxDiscount?: number; // Only for PERCENTAGE
  minPurchase?: number;
  quota: number;
  used: number;
  expiresAt: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}
