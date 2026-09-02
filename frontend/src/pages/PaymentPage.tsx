import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import type { Product, Package } from '../types';
import { Loader2, QrCode, AlertCircle, Zap } from 'lucide-react';

interface LocationState {
  product: Product;
  pkg: Package;
  customerDetails: any;
  finalPrice?: number;
}

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  // Realistically we'd fetch order details, here we rely on state or mock it
  if (!state || !state.product || !state.pkg) {
    return <Navigate to="/catalog" replace />;
  }

  const { product, pkg } = state;
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'PAID' | 'EXPIRED'>('PENDING');

  useEffect(() => {
    if (paymentStatus !== 'PENDING') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPaymentStatus('EXPIRED');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentStatus]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleSimulatePayment = () => {
    setPaymentStatus('PAID');
    // Simulate webhook delay
    setTimeout(() => {
      navigate(`/success/${orderId}`, {
        state: { product, pkg, orderId }
      });
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Selesaikan Pembayaran</h1>
          <p className="text-slate-500">Order ID: <span className="font-mono text-slate-700 font-semibold">{orderId}</span></p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-slate-900">{product.name}</h3>
            <p className="text-sm text-slate-500">{pkg.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 mb-1">Total Tagihan</p>
            <p className="text-2xl font-bold text-blue-600">{formatIDR(state.finalPrice ?? pkg.price)}</p>
          </div>
        </div>

        {paymentStatus === 'EXPIRED' ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Waktu Pembayaran Habis</h2>
            <p className="text-slate-500 mb-6">QRIS sudah tidak berlaku. Silakan buat pesanan baru.</p>
            <button 
              onClick={() => navigate('/catalog')}
              className="bg-slate-900 text-white px-6 py-3 rounded-full hover:bg-slate-800 transition-colors"
            >
              Kembali ke Produk
            </button>
          </div>
        ) : paymentStatus === 'PAID' ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Pembayaran Berhasil!</h2>
            <p className="text-slate-500">Sedang memproses akses Anda...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 relative group">
              {/* Dummy QR Code Image representation */}
              <div className="w-64 h-64 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                <QrCode className="w-20 h-20 mb-2" />
                <span className="font-medium">QRIS Placeholder</span>
              </div>

              {/* Secret Simulate Button */}
              <button 
                onClick={handleSimulatePayment}
                className="absolute inset-0 bg-blue-600/90 text-white font-bold rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center"
              >
                <Zap className="w-10 h-10 mb-2" />
                Simulasi Webhook PAID
              </button>
            </div>

            <p className="text-slate-600 mb-2 flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin text-blue-500" />
              Menunggu pembayaran...
            </p>
            <div className="text-3xl font-mono font-bold text-slate-900">
              {formatTime(timeLeft)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
