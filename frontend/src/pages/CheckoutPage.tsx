import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useForm as useReactHookForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Product, Package, PromoCode } from '../types';
import { Shield, CreditCard, ChevronLeft, Tag, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

// Form validation schema using Zod
const checkoutSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  whatsapp: z.string().min(9, 'Nomor WhatsApp tidak valid').max(15, 'Nomor terlalu panjang'),
});

type CheckoutFormInputs = z.infer<typeof checkoutSchema>;

interface LocationState {
  product: Product;
  pkg: Package;
}

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { currentUser } = useAuth();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useReactHookForm<CheckoutFormInputs>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    if (currentUser) {
      if (currentUser.displayName) setValue('name', currentUser.displayName);
      if (currentUser.email) setValue('email', currentUser.email);
    }
  }, [currentUser, setValue]);

  // Redirect if accessed directly without product/package state
  if (!state || !state.product || !state.pkg) {
    return <Navigate to="/catalog" replace />;
  }

  const { product, pkg } = state;

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleApplyPromo = () => {
    setPromoError('');
    // Mock Promo Logic
    const code = promoCode.toUpperCase();
    if (code === 'FLASHSALE20') {
      if (pkg.price < 100000) {
        setPromoError('Minimal pembelian Rp 100.000 untuk promo ini');
        return;
      }
      setAppliedPromo({
        id: 'promo-1', code: 'FLASHSALE20', discountType: 'PERCENTAGE', discountValue: 20, maxDiscount: 50000,
        minPurchase: 100000, quota: 100, used: 45, expiresAt: '', status: 'ACTIVE', createdAt: ''
      });
    } else if (code === 'HEMAT50K') {
      if (pkg.price < 200000) {
        setPromoError('Minimal pembelian Rp 200.000 untuk promo ini');
        return;
      }
      setAppliedPromo({
        id: 'promo-2', code: 'HEMAT50K', discountType: 'FIXED', discountValue: 50000,
        minPurchase: 200000, quota: 50, used: 50, expiresAt: '', status: 'ACTIVE', createdAt: ''
      });
    } else {
      setPromoError('Kode promo tidak valid atau sudah kedaluwarsa');
      setAppliedPromo(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'PERCENTAGE') {
      discountAmount = (pkg.price * appliedPromo.discountValue) / 100;
      if (appliedPromo.maxDiscount && discountAmount > appliedPromo.maxDiscount) {
        discountAmount = appliedPromo.maxDiscount;
      }
    } else {
      discountAmount = appliedPromo.discountValue;
    }
  }
  
  const finalPrice = Math.max(0, pkg.price - discountAmount);

  const onSubmit = async (data: CheckoutFormInputs) => {
    setIsSubmitting(true);
    try {
      const createOrderFn = httpsCallable(functions, 'createOrder');
      
      const payload = {
        productId: product.id,
        packageId: pkg.id,
        customer: {
          name: data.name,
          email: data.email,
          whatsapp: data.whatsapp
        },
        promoCode: appliedPromo?.code // Can be handled in backend later
      };

      const result = await createOrderFn(payload);
      const orderData = result.data as any;
      
      navigate(`/payment/${orderData.orderId}`, { 
        state: { 
          product, 
          pkg,
          customerDetails: data,
          promo: appliedPromo,
          finalPrice: orderData.amount,
          qrisUrl: orderData.qrisUrl,
          expiresAt: orderData.expiresAt
        }
      });
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert(`Gagal membuat pesanan: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 mr-1" /> Kembali
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Form Section */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Informasi Pemesan</h2>
            
            {!currentUser ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="w-16 h-16 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Wajib Login</h3>
                <p className="text-slate-500 mb-6 px-4">Anda harus masuk ke akun Anda agar pesanan dan lisensi tersimpan dengan aman di Dashboard Anda.</p>
                <button 
                  onClick={() => navigate('/login', { state: { from: location } })}
                  className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Login Sekarang
                </button>
              </div>
            ) : (
              <>
                <p className="text-slate-500 text-sm mb-8">Masukkan data diri Anda. Akses produk akan dikirimkan melalui Email dan WhatsApp yang terdaftar.</p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.name ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'}`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Alamat Email</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="john@example.com"
                  className={`w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.email ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'}`}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nomor WhatsApp</label>
                <input
                  {...register('whatsapp')}
                  type="tel"
                  placeholder="08123456789"
                  className={`w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${errors.whatsapp ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'}`}
                />
                {errors.whatsapp && <p className="mt-1 text-sm text-red-500">{errors.whatsapp.message}</p>}
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center py-4 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Memproses...' : 'Lanjut ke Pembayaran QRIS'}
                </button>
              </div>
            </form>
            </>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center border-b border-slate-700 pb-4">
              Ringkasan Pesanan
            </h3>
            
            <div className="flex justify-between mb-4">
              <span className="text-slate-400">Produk</span>
              <span className="font-semibold">{product.name}</span>
            </div>
            
            <div className="flex justify-between mb-4">
              <span className="text-slate-400">Paket</span>
              <span className="font-semibold">{pkg.name}</span>
            </div>
            
            <div className="flex justify-between mb-6">
              <span className="text-slate-400">Masa Aktif</span>
              <span className="font-semibold">
                {pkg.durationType === 'UNLIMITED' ? 'Selamanya' : `${pkg.durationValue} ${pkg.durationUnit}`}
              </span>
            </div>

            {/* Promo Code Input */}
            <div className="mb-6 border-t border-slate-700 pt-6">
              <label className="block text-sm text-slate-400 mb-2">Kode Promo (Opsional)</label>
              {appliedPromo ? (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium text-emerald-400 tracking-wider">{appliedPromo.code}</span>
                  </div>
                  <button 
                    onClick={handleRemovePromo}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Hapus
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Contoh: FLASHSALE20"
                    className="flex-1 min-w-0 w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 uppercase"
                  />
                  <button 
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={!promoCode.trim()}
                    className="shrink-0 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    Terapkan
                  </button>
                </div>
              )}
              {promoError && <p className="mt-2 text-sm text-red-400">{promoError}</p>}
            </div>

            <div className="border-t border-slate-700 pt-4 mb-2 flex justify-between items-center text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span>{formatIDR(pkg.price)}</span>
            </div>
            
            {appliedPromo && (
              <div className="mb-2 flex justify-between items-center text-sm text-emerald-400 animate-in fade-in">
                <span>Diskon Promo</span>
                <span>-{formatIDR(discountAmount)}</span>
              </div>
            )}

            <div className="border-t border-slate-700 pt-4 mb-8 flex justify-between items-end">
              <span className="text-lg">Total Bayar</span>
              <span className="text-3xl font-bold text-blue-400">{formatIDR(finalPrice)}</span>
            </div>

            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex items-start">
                <Shield className="w-5 h-5 mr-3 text-emerald-400 flex-shrink-0" />
                <p>Pembayaran 100% aman dan dikonfirmasi secara otomatis.</p>
              </div>
              <div className="flex items-start">
                <CreditCard className="w-5 h-5 mr-3 text-blue-400 flex-shrink-0" />
                <p>Mendukung semua e-Wallet dan Mobile Banking via QRIS.</p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
