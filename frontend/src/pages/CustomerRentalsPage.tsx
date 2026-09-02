import { useState, useEffect } from 'react';
import { Key, Link as LinkIcon, Lock, Search, Filter, ShieldAlert, CheckCircle2, Clock, Play, Loader2, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const CustomerRentalsPage = () => {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [selectedRental, setSelectedRental] = useState<any>(null);
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const fetchRentals = async () => {
      if (!currentUser) return;
      try {
        const q = query(
          collection(db, 'rentals'), 
          where('userId', '==', currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort manually if no index created for orderBy
        data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRentals(data);
      } catch (error) {
        console.error('Error fetching rentals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, [currentUser]);

  const filteredRentals = rentals.filter(r => activeTab === 'ALL' || r.status === activeTab);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Penyewaan Saya</h1>
          <p className="text-slate-500">Kelola produk yang sedang Anda sewa dan lihat akses kredensial Anda.</p>
        </div>
        <Link 
          to="/catalog"
          className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-lg shadow-blue-500/30 flex items-center gap-2"
        >
          <Play className="w-4 h-4 fill-current" />
          Sewa Produk Lain
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['ALL', 'ACTIVE', 'EXPIRED'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'ALL' ? 'Semua' : tab === 'ACTIVE' ? 'Aktif' : 'Kedaluwarsa'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari produk..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <button className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rentals Grid */}
        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRentals.map(rental => {
              // Mock product image & name for now, in real scenario we'd fetch product details or store them in rental doc
              const productName = rental.productName || 'Produk Flash Rent';
              const packageDuration = rental.durationUnit ? `${rental.durationValue} ${rental.durationUnit}` : 'Unlimited';
              
              const expiresDate = rental.expiresAt 
                ? new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(rental.expiresAt))
                : 'Selamanya';

              return (
                <div key={rental.id} className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group bg-slate-50/50">
                  <div className="p-5 flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shadow-sm flex-shrink-0 flex items-center justify-center text-slate-400">
                      <Key className="w-8 h-8" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                          rental.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {rental.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 truncate" title={productName}>{productName}</h3>
                      <p className="text-sm text-slate-500">{packageDuration}</p>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-white border-y border-slate-100 flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-4 h-4" />
                      <span>{rental.expiresAt ? `Sampai ${expiresDate}` : 'Selamanya'}</span>
                    </div>
                  </div>

                  <div className="p-5 flex gap-2">
                    <button 
                      onClick={() => setSelectedRental(rental)}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <Key className="w-4 h-4" />
                      Lihat Akses
                    </button>
                    {rental.status === 'EXPIRED' && (
                      <button className="px-4 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-sm font-medium transition-colors">
                        Perpanjang
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {!loading && filteredRentals.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500">
                Tidak ada penyewaan dengan status tersebut.
              </div>
            )}
          </div>
        )}

      </div>

      {/* Access Credential Modal */}
      {selectedRental && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedRental(null)}></div>
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-slate-900 p-6 text-white text-center">
              <div className="w-16 h-16 bg-white/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Lock className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-1">Akses Produk</h2>
              <p className="text-slate-400 text-sm">{selectedRental.productName}</p>
            </div>
            
            <div className="p-6">
              {selectedRental.status === 'EXPIRED' && (
                <div className="flex gap-3 p-4 bg-red-50 text-red-700 rounded-xl mb-6">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">Masa sewa Anda telah berakhir. Akses disembunyikan. Silakan perpanjang untuk melihat kembali.</p>
                </div>
              )}

              {selectedRental.status === 'ACTIVE' && (
                <div className="space-y-4">
                  
                  {/* Credential Type Display */}
                  {selectedRental.accessData?.type === 'ACCOUNT' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email / Username</label>
                        <div className="flex gap-2">
                          <div className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 font-mono text-sm break-all">
                            {selectedRental.accessData.username}
                          </div>
                          <button onClick={() => handleCopy(selectedRental.accessData.username, 'user')} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200 text-slate-600">
                            {copied === 'user' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                        <div className="flex gap-2">
                          <div className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 font-mono text-sm break-all">
                            {selectedRental.accessData.password}
                          </div>
                          <button onClick={() => handleCopy(selectedRental.accessData.password, 'pass')} className="p-3 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200 text-slate-600">
                            {copied === 'pass' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedRental.accessData?.type === 'LICENSE' && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">License Key</label>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-4 bg-slate-900 text-green-400 rounded-xl font-medium font-mono text-center tracking-widest text-lg break-all shadow-inner">
                          {selectedRental.accessData.licenseKey}
                        </div>
                        <button onClick={() => handleCopy(selectedRental.accessData.licenseKey, 'key')} className="p-4 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200 text-slate-600">
                          {copied === 'key' ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedRental.accessData?.type === 'INVITE_LINK' && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">URL Undangan</label>
                      <a href={selectedRental.accessData.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl text-blue-700 font-medium transition-colors group">
                        <span className="truncate mr-4">{selectedRental.accessData.url}</span>
                        <LinkIcon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      </a>
                    </div>
                  )}

                  {selectedRental.accessData?.instructions && (
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600">
                      <p className="font-semibold text-slate-700 mb-1">Instruksi:</p>
                      <p>{selectedRental.accessData.instructions}</p>
                    </div>
                  )}

                  <div className="mt-6 p-4 bg-blue-50/50 rounded-xl flex gap-3 text-sm text-blue-800">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-blue-600" />
                    <p>Harap tidak membagikan informasi akses ini kepada siapa pun demi keamanan akun Anda.</p>
                  </div>
                </div>
              )}

              <div className="mt-8">
                <button 
                  onClick={() => setSelectedRental(null)}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerRentalsPage;
