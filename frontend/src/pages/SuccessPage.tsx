import { useLocation, Navigate, Link } from 'react-router-dom';
import type { Product, Package } from '../types';
import { CheckCircle2, Key, ExternalLink, Copy, Check, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

interface LocationState {
  product: Product;
  pkg: Package;
  orderId: string;
}

export default function SuccessPage() {
  const location = useLocation();
  const state = location.state as LocationState;

  if (!state || !state.product || !state.pkg || !state.orderId) {
    return <Navigate to="/" replace />;
  }

  const { product, pkg, orderId } = state;
  const [copied, setCopied] = useState<string | null>(null);
  const [rentalData, setRentalData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const q = query(collection(db, 'rentals'), where('orderId', '==', orderId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setRentalData(querySnapshot.docs[0].data());
        }
      } catch (error) {
        console.error('Error fetching rental data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRental();
  }, [orderId]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const getExpiryDate = () => {
    if (rentalData?.expiresAt === null || pkg.durationType === 'UNLIMITED') return 'Selamanya';
    if (rentalData?.expiresAt) {
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
      }).format(new Date(rentalData.expiresAt));
    }
    return '-';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Pembayaran Berhasil!</h1>
        <p className="text-lg text-slate-600">
          Order <span className="font-mono font-semibold">{orderId}</span> telah lunas. Rental Anda sekarang aktif.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rental Details */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Detail Rental</h2>
          
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-500 mb-1">Produk</p>
              <p className="font-semibold text-slate-900">{product.name}</p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500 mb-1">Paket</p>
              <p className="font-semibold text-slate-900">{pkg.name}</p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500 mb-1">Status</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span> ACTIVE
              </span>
            </div>
            
            <div>
              <p className="text-sm text-slate-500 mb-1">Berlaku Sampai</p>
              <p className="font-semibold text-slate-900">{getExpiryDate()}</p>
            </div>
          </div>
        </div>

        {/* Access Details */}
        <div className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Key className="w-32 h-32" />
          </div>
          
          <h2 className="text-xl font-bold mb-6 relative z-10">Akses Produk</h2>
          <p className="text-slate-400 text-sm mb-8 relative z-10">Gunakan informasi berikut untuk mengakses produk digital Anda.</p>
          
          {/* Access Data from DB */}
          <div className="space-y-6 relative z-10">
            {rentalData?.accessData ? (
              rentalData.accessData.type === 'LICENSE' ? (
                <div>
                  <p className="text-sm text-slate-400 mb-2">License Key</p>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-slate-800 px-4 py-3 rounded-xl font-mono text-emerald-400 border border-slate-700 break-all">
                      {rentalData.accessData.licenseKey}
                    </code>
                    <button 
                      onClick={() => handleCopy(rentalData.accessData.licenseKey, 'key')}
                      className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700 text-slate-300"
                    >
                      {copied === 'key' ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{rentalData.accessData.instructions}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Username</p>
                    <p className="font-mono font-semibold">{rentalData.accessData.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">Password</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-mono font-semibold">{rentalData.accessData.password}</p>
                      <button onClick={() => handleCopy(rentalData.accessData.password, 'pw')} className="text-slate-400 hover:text-white">
                        {copied === 'pw' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">{rentalData.accessData.instructions}</p>
                </div>
              )
            ) : (
              <div className="text-center py-6 text-slate-400">
                Data akses belum tersedia atau sedang diproses.
              </div>
            )}
            
            <div className="pt-6 border-t border-slate-800">
              <Link to="/rentals" className="flex items-center justify-center w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold transition-colors">
                Lihat di Dashboard <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <Link to="/" className="text-blue-600 font-semibold hover:underline">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
