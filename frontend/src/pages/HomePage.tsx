import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Clock, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, limit, getDocs } from 'firebase/firestore';

export default function HomePage() {
  const [latestProducts, setLatestProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const q = query(collection(db, 'products'), limit(3));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLatestProducts(data);
      } catch (error) {
        console.error("Failed to fetch latest products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Akses Digital <span className="text-blue-500">Tanpa Batas</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10">
            Sewa software, layanan langganan, dan produk digital premium secara instan. Tanpa ribet, langsung pakai.
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/catalog" 
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg shadow-blue-500/30 flex items-center"
            >
              Jelajahi Produk <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Mengapa Memilih Flash Rent?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 transform -rotate-6">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Akses Instan</h3>
              <p className="text-slate-600">Sistem otomatis memberikan akses tepat setelah pembayaran QRIS terkonfirmasi.</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-6">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Aman & Terpercaya</h3>
              <p className="text-slate-600">Jaminan uang kembali jika akses produk digital tidak berfungsi sesuai janji.</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Fleksibel</h3>
              <p className="text-slate-600">Pilih paket sesuai kebutuhan. Harian, bulanan, atau unlimited selamanya.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Produk Terbaru</h2>
              <p className="text-slate-600">Jelajahi produk yang baru ditambahkan ke katalog kami.</p>
            </div>
            <Link to="/catalog" className="hidden sm:flex text-blue-600 font-semibold hover:text-blue-700 items-center gap-1">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestProducts.map(product => (
                <Link to={`/product/${product.id}`} key={product.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
                  {product.image ? (
                    <div className="h-48 overflow-hidden relative bg-slate-100 flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-600 uppercase tracking-wider">
                        {product.category}
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-6 text-center relative flex-shrink-0">
                      <h3 className="text-4xl font-bold text-white leading-tight uppercase shadow-sm">{product.name.charAt(0)}</h3>
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-600 uppercase tracking-wider">
                        {product.category}
                      </div>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{product.description}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                      <div>
                        <p className="text-xs text-slate-400 font-medium mb-0.5">Mulai dari</p>
                        <p className="font-bold text-slate-900">
                          Rp {product.packages?.[0]?.price?.toLocaleString('id-ID') || 0}
                        </p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              
              {!loading && latestProducts.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">
                  Katalog produk masih kosong.
                </div>
              )}
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/catalog" className="inline-flex text-blue-600 font-semibold hover:text-blue-700 items-center gap-1">
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6">Siap untuk mencoba?</h2>
          <p className="text-xl text-blue-100 mb-10">
            Checkout sebagai tamu (guest) dalam hitungan detik. Tanpa perlu daftar akun yang ribet.
          </p>
          <Link 
            to="/catalog" 
            className="bg-white text-blue-600 hover:bg-slate-50 font-bold py-4 px-10 rounded-full transition-all duration-300 shadow-xl inline-block"
          >
            Mulai Sekarang
          </Link>
        </div>
      </section>
    </div>
  );
}
