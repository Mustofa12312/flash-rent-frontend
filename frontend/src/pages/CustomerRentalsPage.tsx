import { useState } from 'react';
import { Key, Link as LinkIcon, Lock, Search, Filter, ShieldAlert, CheckCircle2, Clock, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockRentals = [
  {
    id: 'RNT-20260902-001',
    productName: 'Canva Pro Premium',
    package: 'Unlimited',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100',
    startedAt: '2 Sep 2026',
    expiresAt: null,
    status: 'ACTIVE',
    accessType: 'CREDENTIAL',
    credentials: {
      username: 'flashrent_user_991@example.com',
      password: 'SuperSecretPassword123'
    }
  },
  {
    id: 'RNT-20260815-042',
    productName: 'Windows 11 Pro License',
    package: 'Lifetime',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100',
    startedAt: '15 Aug 2026',
    expiresAt: null,
    status: 'ACTIVE',
    accessType: 'LICENSE_KEY',
    credentials: {
      key: 'W11P-XXXX-YYYY-ZZZZ-1234'
    }
  },
  {
    id: 'RNT-20260701-088',
    productName: 'Spotify Premium',
    package: '1 Bulan',
    image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=100',
    startedAt: '1 Jul 2026',
    expiresAt: '1 Aug 2026',
    status: 'EXPIRED',
    accessType: 'ACCOUNT_INVITE',
    credentials: {
      url: 'https://spotify.com/invite/xxxxxxx'
    }
  }
];

const CustomerRentalsPage = () => {
  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [selectedRental, setSelectedRental] = useState<any>(null);

  const filteredRentals = mockRentals.filter(r => activeTab === 'ALL' || r.status === activeTab);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRentals.map(rental => (
            <div key={rental.id} className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group bg-slate-50/50">
              <div className="p-5 flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm flex-shrink-0">
                  <img src={rental.image} alt={rental.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                      rental.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {rental.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 truncate" title={rental.productName}>{rental.productName}</h3>
                  <p className="text-sm text-slate-500">{rental.package}</p>
                </div>
              </div>

              <div className="px-5 py-3 bg-white border-y border-slate-100 flex justify-between items-center text-sm">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span>{rental.expiresAt ? `Sampai ${rental.expiresAt}` : 'Selamanya'}</span>
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
          ))}

          {filteredRentals.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              Tidak ada penyewaan dengan status tersebut.
            </div>
          )}
        </div>

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
                  {selectedRental.accessType === 'CREDENTIAL' && (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email / Username</label>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 font-mono text-sm break-all">
                          {selectedRental.credentials.username}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 font-mono text-sm break-all">
                          {selectedRental.credentials.password}
                        </div>
                      </div>
                    </>
                  )}

                  {selectedRental.accessType === 'LICENSE_KEY' && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">License Key</label>
                      <div className="p-4 bg-slate-900 text-green-400 rounded-xl font-medium font-mono text-center tracking-widest text-lg break-all shadow-inner">
                        {selectedRental.credentials.key}
                      </div>
                    </div>
                  )}

                  {selectedRental.accessType === 'ACCOUNT_INVITE' && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">URL Undangan</label>
                      <a href={selectedRental.credentials.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl text-blue-700 font-medium transition-colors group">
                        <span className="truncate mr-4">{selectedRental.credentials.url}</span>
                        <LinkIcon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                      </a>
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
