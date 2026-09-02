import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import type { Product, Package } from '../types';
import { QrCode, AlertCircle, ShieldCheck, MessageCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { QRCodeSVG } from 'qrcode.react';
import { generateDynamicQRIS } from '../lib/qris';

interface LocationState {
  product: Product;
  pkg: Package;
  customerDetails: any;
  finalPrice: number;
  qrisUrl?: string;
  expiresAt?: string;
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
  const [qrisString, setQrisString] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'VERIFYING' | 'PAID' | 'EXPIRED'>('PENDING');
  const [adminWA, setAdminWA] = useState('6281234567890');

  useEffect(() => {
    // Load admin WhatsApp from settings
    import('firebase/firestore').then(({ getDoc, doc: fsDoc }) => {
      getDoc(fsDoc(db, 'settings', 'app')).then(snap => {
        if (snap.exists() && snap.data().adminWhatsapp) {
          setAdminWA(snap.data().adminWhatsapp);
        }
      }).catch(() => {});
    });
  }, []);

  useEffect(() => {
    if (!orderId) return;

    // Generate Dynamic QRIS once the component mounts
    if (state.finalPrice) {
      try {
        const dynamicQR = generateDynamicQRIS(state.finalPrice);
        setQrisString(dynamicQR);
      } catch (err) {
        console.error("Failed to generate dynamic QRIS", err);
      }
    }

    // Listen to order status in real-time
    const unsubscribe = onSnapshot(doc(db, 'orders', orderId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.status === 'PAID') {
          setPaymentStatus('PAID');
          setTimeout(() => {
            navigate(`/success/${orderId}`, { state: { product, pkg, orderId } });
          }, 1500);
        } else if (data.status === 'VERIFYING') {
          setPaymentStatus('VERIFYING');
        } else if (data.status === 'EXPIRED') {
          setPaymentStatus('EXPIRED');
        }
      }
    });

    return () => unsubscribe();
  }, [orderId, navigate, product, pkg]);

  useEffect(() => {
    if (paymentStatus !== 'PENDING') return;

    const expiryTime = state.expiresAt ? new Date(state.expiresAt).getTime() : Date.now() + 15 * 60 * 1000;

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((expiryTime - now) / 1000));
      
      setTimeLeft(diff);
      
      if (diff <= 0) {
        clearInterval(timer);
        setPaymentStatus('EXPIRED');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentStatus, state.expiresAt]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h} Jam ${m} Menit ${s.toString().padStart(2, '0')} Detik`;
    }
    return `${m} Menit ${s.toString().padStart(2, '0')} Detik`;
  };

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleManualVerification = async () => {
    try {
      await updateDoc(doc(db, 'orders', orderId!), { status: 'VERIFYING' });
      // Status akan otomatis berubah ke VERIFYING,
      // dan admin akan memverifikasi secara manual dari dashboard.
    } catch (error: any) {
      console.error('Error updating order status:', error);
      alert(`Gagal mengupdate status pesanan. Pesan error: ${error?.message || 'Unknown'}`);
    }
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
            <p className="text-sm text-slate-500 mb-1">Total Tagihan (Transfer Tepat)</p>
            <p className="text-3xl font-bold text-blue-600">{formatIDR(state.finalPrice)}</p>
            <p className="text-xs text-rose-500 font-medium mt-1">⚠️ 3 Digit terakhir adalah kode unik</p>
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
        ) : paymentStatus === 'VERIFYING' ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Menunggu Verifikasi Admin</h2>
            <p className="text-slate-500 mb-6">Jangan tutup halaman ini. Kami sedang memverifikasi mutasi pembayaran Anda.</p>
            
            <a 
              href={`https://wa.me/${adminWA}?text=${encodeURIComponent(`Halo Admin, saya ingin konfirmasi pembayaran Order ${orderId}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full transition-colors shadow-lg shadow-emerald-500/30"
            >
              <MessageCircle className="w-5 h-5" />
              Chat Admin
            </a>
          </div>
        ) : paymentStatus === 'PAID' ? (
          <div className="text-center py-10">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Pembayaran Berhasil!</h2>
            <p className="text-slate-500">Mengarahkan Anda ke halaman akses...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6 relative">
              <div className="w-64 h-64 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center overflow-hidden p-2 mb-4">
                {qrisString ? (
                  <QRCodeSVG value={qrisString} size={240} className="w-full h-full" />
                ) : (
                  <>
                    <QrCode className="w-20 h-20 mb-2 text-slate-300" />
                    <span className="font-medium text-slate-400">Memuat QRIS...</span>
                  </>
                )}
              </div>
              <div className="text-center bg-blue-50 py-2 rounded-lg border border-blue-100">
                <p className="text-sm text-slate-600">Scan QRIS Atas Nama:</p>
                <p className="font-bold text-blue-700">FLASH RENT</p>
              </div>
            </div>

            <p className="text-slate-600 mb-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Selesaikan pembayaran dalam
            </p>
            <div className="text-xl font-bold text-slate-900 mb-8">
              {formatTime(timeLeft)}
            </div>

            <button 
              onClick={handleManualVerification}
              className="w-full max-w-sm bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-blue-500/30"
            >
              Saya Sudah Bayar
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
