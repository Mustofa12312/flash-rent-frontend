import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PackageCard from '../components/PackageCard';
import { ShieldCheck, Zap } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<any | null>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProduct({ id: docSnap.id, ...data });
          setPackages(data.packages || []);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  const handleCheckout = () => {
    if (selectedPackage && product) {
      navigate('/checkout', { 
        state: { product, pkg: selectedPackage }
      });
    }
  };

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-500">Memuat produk...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Produk Tidak Ditemukan</h2>
        <p className="text-slate-500 mb-6">Produk yang Anda cari tidak tersedia atau sudah dihapus.</p>
        <button onClick={() => navigate('/catalog')} className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors">
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Product Info */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <div className="h-64 sm:h-80 w-full bg-slate-900 overflow-hidden rounded-3xl flex items-center justify-center text-center mb-8 shadow-xl relative">
              {product.image ? (
                <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover opacity-40" />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-indigo-900 opacity-60"></div>
              )}
              <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight relative z-10 p-4">{product.name}</h1>
            </div>
            
            <div className="mb-4 flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                {product.category}
              </span>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full flex items-center">
                <ShieldCheck className="w-3 h-3 mr-1" /> Verified
              </span>
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{product.name}</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="flex items-start space-x-3 text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <p>Akses otomatis dikirimkan ke dashboard Anda sesaat setelah pembayaran terverifikasi.</p>
            </div>
          </div>
        </div>

        {/* Packages Selection */}
        <div className="lg:col-span-7">
          <div className="glass p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl bg-white/80">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Pilih Paket</h3>
            <p className="text-slate-500 mb-8">Pilih durasi sewa yang paling sesuai dengan kebutuhan Anda.</p>
            
            <div className="space-y-4 mb-8">
              {packages.map(pkg => (
                <PackageCard 
                  key={pkg.id} 
                  pkg={pkg} 
                  isSelected={selectedPackage?.id === pkg.id}
                  onSelect={setSelectedPackage}
                />
              ))}
            </div>

            <button
              onClick={handleCheckout}
              disabled={!selectedPackage}
              className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all shadow-lg ${
                selectedPackage 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              }`}
            >
              Lanjutkan ke Pembayaran
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
