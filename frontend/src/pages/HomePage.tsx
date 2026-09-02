import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Zap, Clock } from 'lucide-react';

export default function HomePage() {
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
