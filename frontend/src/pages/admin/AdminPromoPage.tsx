import { Plus, Search, Tag, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import type { PromoCode } from '../../types';

const mockPromos: PromoCode[] = [
  {
    id: 'promo-1',
    code: 'FLASHSALE20',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    maxDiscount: 50000,
    minPurchase: 100000,
    quota: 100,
    used: 45,
    expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'promo-2',
    code: 'HEMAT50K',
    discountType: 'FIXED',
    discountValue: 50000,
    minPurchase: 200000,
    quota: 50,
    used: 50,
    expiresAt: new Date(Date.now() + 86400000 * 30).toISOString(),
    status: 'INACTIVE',
    createdAt: new Date().toISOString()
  }
];

const AdminPromoPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Kode Promo</h1>
          <p className="text-slate-400">Kelola diskon dan penawaran spesial untuk pelanggan.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/30">
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
              placeholder="Cari kode promo..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-slate-800/50 border border-white/10 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none min-w-[150px]">
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>
        </div>

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
              {mockPromos.map((promo) => (
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
                      <button className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white transition-colors" title="Lainnya">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPromoPage;
