import { useState } from 'react';
import { Save, Store, CreditCard, Bell, ShieldCheck, Database, Key, Settings, Tags, Plus, Trash2 } from 'lucide-react';

const AdminSettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('flash_categories');
    return saved ? JSON.parse(saved) : ['Entertainment', 'Software', 'Design'];
  });
  const [newCategory, setNewCategory] = useState('');

  const handleSaveCategories = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updated = [...categories, newCategory.trim()];
      setCategories(updated);
      localStorage.setItem('flash_categories', JSON.stringify(updated));
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (cat: string) => {
    const updated = categories.filter(c => c !== cat);
    setCategories(updated);
    localStorage.setItem('flash_categories', JSON.stringify(updated));
  };

  const tabs = [
    { id: 'general', label: 'Profil Toko', icon: Store },
    { id: 'kategori', label: 'Kategori Produk', icon: Tags },
    { id: 'payment', label: 'Payment Gateway', icon: CreditCard },
    { id: 'notifications', label: 'Notifikasi', icon: Bell },
    { id: 'security', label: 'Keamanan', icon: ShieldCheck },
    { id: 'integrations', label: 'API & Webhook', icon: Database },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Pengaturan Sistem</h1>
        <p className="text-slate-400">Konfigurasi seluruh aspek aplikasi Flash Rent dari satu tempat.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-3 backdrop-blur-md sticky top-24">
            <nav className="flex flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                    activeTab === tab.id
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1">
          <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md">
            
            {/* TAB: GENERAL */}
            {activeTab === 'general' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-white">Profil Toko</h2>
                  <p className="text-sm text-slate-400 mt-1">Informasi utama yang akan ditampilkan ke pelanggan.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Nama Toko</label>
                    <input type="text" defaultValue="Flash Rent" className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Email Kontak</label>
                    <input type="email" defaultValue="support@flashrent.com" className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-300">Deskripsi Singkat (SEO)</label>
                    <textarea rows={3} defaultValue="Platform sewa lisensi premium dan akun digital terbaik." className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all"></textarea>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex justify-end">
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/30">
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            )}

            {/* TAB: PAYMENT */}
            {activeTab === 'payment' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-white">Payment Gateway</h2>
                  <p className="text-sm text-slate-400 mt-1">Konfigurasi kunci rahasia penyedia pembayaran (Midtrans/Xendit).</p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Key className="w-4 h-4 text-purple-400" />
                      Secret API Key
                    </label>
                    <input type="password" defaultValue="sk_test_12345abcdefghijklmnopqrstuvwxyz" className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Callback URL (Webhook)</label>
                    <input type="text" defaultValue="https://api.flashrent.com/webhooks/payment" readOnly className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-2.5 text-slate-400 outline-none" />
                    <p className="text-xs text-slate-500 mt-1">Salin URL ini dan tempelkan di dasbor Payment Gateway Anda.</p>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-white/10 rounded-xl">
                    <div>
                      <h4 className="text-white font-medium">Mode Sandbox (Testing)</h4>
                      <p className="text-sm text-slate-400">Gunakan data palsu untuk menguji pembayaran tanpa uang sungguhan.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex justify-end">
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/30">
                    <Save className="w-4 h-4" />
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            )}

            {/* TAB: KATEGORI */}
            {activeTab === 'kategori' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="border-b border-white/10 pb-4 mb-6">
                  <h2 className="text-xl font-bold text-white">Kategori Produk</h2>
                  <p className="text-sm text-slate-400 mt-1">Kelola daftar kategori yang akan muncul saat menambah produk baru.</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveCategories()}
                      placeholder="Masukkan nama kategori baru..." 
                      className="flex-1 bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" 
                    />
                    <button 
                      onClick={handleSaveCategories}
                      disabled={!newCategory.trim()}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-500/30"
                    >
                      <Plus className="w-5 h-5" />
                      Tambah
                    </button>
                  </div>

                  <div className="bg-slate-800/30 border border-white/10 rounded-xl overflow-hidden mt-6">
                    <ul className="divide-y divide-white/5">
                      {categories.map((cat, idx) => (
                        <li key={idx} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                          <span className="text-white font-medium">{cat}</span>
                          <button 
                            onClick={() => handleRemoveCategory(cat)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                      {categories.length === 0 && (
                        <li className="p-4 text-center text-slate-400">Belum ada kategori yang ditambahkan.</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PLACEHOLDERS FOR OTHERS */}
            {['notifications', 'security', 'integrations'].includes(activeTab) && (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-white/10">
                  <Settings className="w-10 h-10 text-slate-500 animate-spin-slow" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Segera Hadir</h3>
                <p className="text-slate-400 max-w-sm">Pengaturan untuk modul ini masih dalam tahap pengembangan dan akan tersedia pada pembaruan sistem berikutnya.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
