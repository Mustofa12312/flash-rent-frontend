import { useState, useEffect } from 'react';
import { Search, MoreVertical, Mail, Ban, CheckCircle, ExternalLink, Download, Loader2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'CUSTOMER'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCustomers(data);
      } catch (error) {
        console.error("Failed to fetch customers", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleExportCSV = () => {
    const headers = 'ID,Name,Email,Status\n';
    const rows = customers.map(c => `${c.id},${c.displayName || 'Anon'},${c.email},${c.status || 'ACTIVE'}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flash-rent-customers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = customers.filter(c => {
    const name = c.displayName || '';
    const email = c.email || '';
    const status = c.status || 'ACTIVE';
    
    const matchSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || email.toLowerCase().includes(searchQuery.toLowerCase()) || c.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || status.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Pelanggan</h1>
          <p className="text-slate-400">Manajemen data basis pengguna dan riwayat akun.</p>
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl border border-white/10 transition-colors">
          <Download className="w-5 h-5" />
          <span>Ekspor CSV</span>
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
              placeholder="Cari nama, email, atau ID..." 
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
              <option value="banned">Diblokir (Banned)</option>
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
                <th className="py-3 px-4 font-medium">Pengguna</th>
                <th className="py-3 px-4 font-medium">Kontak</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr key={customer.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-white/10">
                        <img src={customer.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.displayName}`} alt={customer.displayName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">{customer.displayName || 'Guest User'}</div>
                        <div className="text-xs text-slate-400 font-mono">{customer.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-slate-300">{customer.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    {(!customer.status || customer.status === 'ACTIVE') ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-medium text-emerald-400 w-max">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Aktif
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-medium text-red-400 w-max">
                        <Ban className="w-3.5 h-3.5" />
                        Diblokir
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors" title="Kirim Email">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors" title="Lihat Profil">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white transition-colors" title="Opsi Lainnya">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">Belum ada pelanggan ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        )}
        
        {/* Pagination Dummy */}
        <div className="mt-6 flex items-center justify-between text-sm text-slate-400 border-t border-white/10 pt-4">
          <div>Menampilkan {filtered.length} dari {customers.length} pelanggan</div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-50">Sebelumnnya</button>
            <button className="px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors">Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomersPage;
