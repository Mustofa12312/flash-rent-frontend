import { User, Mail, Phone, Shield, Key, Bell, LogOut, Code } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const CustomerAccountPage = () => {
  const { currentUser } = useAuth();
  
  const handleMakeAdmin = async () => {
    if (!currentUser) return;
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), { role: 'ADMIN' });
      alert('Berhasil! Anda sekarang adalah Admin. Silakan refresh halaman dan menu /admin akan terbuka.');
      window.location.reload();
    } catch (error) {
      alert('Gagal menjadikan Admin. Pastikan Firestore rules mengizinkan.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Akun Saya</h1>
        <p className="text-slate-500">Kelola informasi profil dan pengaturan keamanan akun Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 font-bold rounded-2xl transition-colors">
            <User className="w-5 h-5" />
            Profil
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold rounded-2xl transition-colors">
            <Shield className="w-5 h-5" />
            Keamanan
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold rounded-2xl transition-colors">
            <Bell className="w-5 h-5" />
            Notifikasi
          </button>
          <div className="pt-4 mt-4 border-t border-slate-200">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 font-semibold rounded-2xl transition-colors">
              <LogOut className="w-5 h-5" />
              Keluar Akun
            </button>
            <button 
              onClick={handleMakeAdmin}
              className="mt-4 w-full flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold rounded-2xl transition-colors text-sm"
            >
              <Code className="w-4 h-4" />
              [Dev] Jadikan Saya Admin
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Informasi Pribadi</h2>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full p-1 shadow-lg shadow-blue-500/20">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-slate-300" />
                </div>
              </div>
              <div className="flex-1 space-y-3 w-full">
                <button className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors text-sm">
                  Ubah Foto Profil
                </button>
                <p className="text-xs text-slate-400 text-center sm:text-left">Format JPG atau PNG. Maksimal 2MB.</p>
              </div>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-slate-700">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" defaultValue="Budi Santoso" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-900" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="email" defaultValue="budi.santoso@example.com" disabled className="w-full pl-12 pr-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 outline-none font-medium cursor-not-allowed" />
                  </div>
                  <p className="text-xs text-slate-500">Email tidak dapat diubah.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Nomor WhatsApp</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="tel" defaultValue="081234567890" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-slate-900" />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button type="button" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all">
                  Simpan Profil
                </button>
              </div>
            </form>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 md:p-8 flex items-start gap-4">
            <Key className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-orange-900 mb-1">Keamanan Akun</h3>
              <p className="text-sm text-orange-800 mb-4">Kami menyarankan Anda untuk menggunakan autentikasi tanpa kata sandi (Passwordless/OTP) untuk keamanan ekstra.</p>
              <button className="px-4 py-2 bg-white text-orange-700 font-bold rounded-xl shadow-sm hover:shadow-md transition-all text-sm border border-orange-200">
                Atur Keamanan
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CustomerAccountPage;
