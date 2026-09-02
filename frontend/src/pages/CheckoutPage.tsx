import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useForm as useReactHookForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Product, Package } from '../types';
import { Shield, CreditCard, ChevronLeft } from 'lucide-react';
import { useState } from 'react';

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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useReactHookForm<CheckoutFormInputs>({
    resolver: zodResolver(checkoutSchema),
  });

  // Redirect if accessed directly without product/package state
  if (!state || !state.product || !state.pkg) {
    return <Navigate to="/products" replace />;
  }

  const { product, pkg } = state;

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const onSubmit = (data: CheckoutFormInputs) => {
    setIsSubmitting(true);
    // Simulate order creation & QRIS generation
    setTimeout(() => {
      console.log('Order created for:', data);
      setIsSubmitting(false);
      
      const mockOrderId = `FR-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      navigate(`/payment/${mockOrderId}`, { 
        state: { 
          product, 
          pkg,
          customerDetails: data
        }
      });
    }, 1500);
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

            <div className="border-t border-slate-700 pt-6 mb-8 flex justify-between items-end">
              <span className="text-lg">Total Bayar</span>
              <span className="text-3xl font-bold text-blue-400">{formatIDR(pkg.price)}</span>
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
