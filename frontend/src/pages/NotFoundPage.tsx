import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full text-center">
        {/* Animated 404 */}
        <div className="relative mb-8 inline-block">
          <h1 className="text-[120px] sm:text-[180px] font-black leading-none tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-blue-600 via-purple-600 to-slate-900 opacity-90 drop-shadow-sm select-none">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-blue-500/10 blur-[100px] -z-10 rounded-full"></div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Halaman Tidak Ditemukan
        </h2>
        <p className="text-slate-500 mb-10 text-lg">
          Maaf, halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau memang tidak pernah ada.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/20"
          >
            <Home className="w-5 h-5" />
            Kembali ke Beranda
          </Link>
          
          <Link 
            to="/catalog" 
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-slate-700 rounded-xl font-medium border border-slate-200 hover:border-blue-500 hover:text-blue-600 transition-all"
          >
            <Search className="w-5 h-5" />
            Cari Produk
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
