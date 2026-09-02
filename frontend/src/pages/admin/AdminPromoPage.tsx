import { useState, useEffect } from 'react';
import { Plus, Search, Tag, Edit2, Trash2, X, Loader2 } from 'lucide-react';
import type { PromoCode } from '../../types';
import { db } from '../../lib/firebase';
import { collection, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';

const AdminPromoPage = () => {
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Create Form State
  const [newCode, setNewCode] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState('');
  const [minPurchase, setMinPurchase] = useState('');
  const [quota, setQuota] = useState('');

  const fetchPromos = async () => {
    try {
      const snap = await getDocs(collection(db, 'promos'));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PromoCode[];
      setPromos(data);
    } catch (error) {
      console.error("Failed to fetch promos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus kode promo ini?')) {
      try {
        await deleteDoc(doc(db, 'promos', id));
        setPromos(prev => prev.filter(p => p.id !== id));
      } catch (error) {
        console.error("Failed to delete promo", error);
        alert('Gagal menghapus promo');
      }
    }
  };

  const handleCreatePromo = async () => {
    if (!newCode || !discountValue || !quota) {
      alert('Mohon lengkapi data promo!');
      return;
    }

    setSaving(true);
    try {
      const promoId = `promo-${Date.now()}`;
      const newPromo: PromoCode = {
        id: promoId,
        code: newCode.toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minPurchase: minPurchase ? Number(minPurchase) : 0,
        quota: Number(quota),
        used: 0,
        expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(), // +30 Days
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'promos', promoId), newPromo);
      setPromos(prev => [newPromo, ...prev]);
      
      setIsCreateOpen(false);
      setNewCode('');
      setDiscountValue('');
      setMinPurchase('');
      setQuota('');
      alert('Promo berhasil dibuat!');
    } catch (error) {
      console.error("Failed to create promo", error);
      alert('Gagal membuat promo');
    } finally {
      setSaving(false);
    }
  };

  const filtered = promos.filter(p => {
    const matchSearch = p.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Kode Promo</h1>
          <p className="text-slate-400">Kelola diskon dan penawaran spesial untuk pelanggan.</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/30">
          <Plus className="w-5 h-5" />
          <span>Buat Promo</span>
        </button>
      </div>

      <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode promo..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-800/50 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none min-w-[150px]"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-sm">
                <th className="py-3 px-4 font-medium">Kode</th>
                <th className="py-3 px-4 font-medium">Nilai Diskon</th>
                <th className="py-3 px-4 font-medium">Kuota Terpakai</th>
                <th className="py-3 px-4 font-medium">Berlaku Sampai</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((promo) => (
                <tr key={promo.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                        <Tag className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white tracking-wider">{promo.code}</div>
                        <div className="text-xs text-slate-400">Min. Trx: Rp {promo.minPurchase?.toLocaleString('id-ID')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-emerald-400">
                      {promo.discountType === 'PERCENTAGE' 
                        ? `${promo.discountValue}% (Max Rp ${promo.maxDiscount?.toLocaleString('id-ID')})`
                        : `Rp ${promo.discountValue.toLocaleString('id-ID')}`}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-800 rounded-full h-2 max-w-[100px]">
                        <div 
                          className={`h-2 rounded-full ${promo.used >= promo.quota ? 'bg-red-500' : 'bg-blue-500'}`} 
                          style={{ width: `${(promo.used / promo.quota) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-slate-300">{promo.used}/{promo.quota}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-300">
                    {new Date(promo.expiresAt).toLocaleDateString('id-ID', { 
                      day: 'numeric', month: 'short', year: 'numeric' 
                    })}
                  </td>
                  <td className="py-4 px-4">
                    {promo.status === 'ACTIVE' ? (
                      <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-medium text-emerald-400">
                        Aktif
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-500/10 border border-slate-500/20 rounded-full text-xs font-medium text-slate-400">
                        Tidak Aktif
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors" title="Edit" onClick={() => alert(`Edit promo: ${promo.code}\n(Fitur edit form akan tersedia di fase backend)`)}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Hapus" onClick={() => handleDelete(promo.id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">Belum ada promo yang ditambahkan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {/* Create Promo Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-800/50">
              <h2 className="text-xl font-bold text-white">Buat Kode Promo Baru</h2>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Kode Promo</label>
                <input type="text" value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="Contoh: HEMAT30" className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white uppercase focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Tipe Diskon</label>
                  <select value={discountType} onChange={e => setDiscountType(e.target.value as any)} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all appearance-none">
                    <option value="PERCENTAGE">Persentase (%)</option>
                    <option value="FIXED">Nominal Tetap (Rp)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Nilai Diskon</label>
                  <input type="number" value={discountValue} onChange={e => setDiscountValue(e.target.value)} placeholder="20" className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Min. Pembelian (Rp)</label>
                  <input type="number" value={minPurchase} onChange={e => setMinPurchase(e.target.value)} placeholder="100000" className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Kuota</label>
                  <input type="number" value={quota} onChange={e => setQuota(e.target.value)} placeholder="100" className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 bg-slate-800/50 flex justify-end gap-3">
              <button onClick={() => setIsCreateOpen(false)} disabled={saving} className="px-6 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 font-medium transition-colors">Batal</button>
              <button onClick={handleCreatePromo} disabled={saving} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-lg shadow-blue-500/30">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Promo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPromoPage;
