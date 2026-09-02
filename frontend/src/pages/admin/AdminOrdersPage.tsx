import { useState } from 'react';
import { Search, Filter, Download, MoreHorizontal, CheckCircle2, Clock, XCircle } from 'lucide-react';

// Mock data for orders
const mockOrders = [
  { id: 'FR-20260902-1001', customer: 'Budi Santoso', email: 'budi@example.com', product: 'Windows 11 Pro', amount: 'Rp 250.000', date: '2 Sep 2026, 14:30', status: 'PAID', type: 'LICENSE' },
  { id: 'FR-20260902-1002', customer: 'Siti Aminah', email: 'siti.a@gmail.com', product: 'Netflix Premium (1 Bulan)', amount: 'Rp 45.000', date: '2 Sep 2026, 13:15', status: 'PAID', type: 'ACCOUNT' },
  { id: 'FR-20260901-0988', customer: 'Agus Pratama', email: 'agus_p@yahoo.com', product: 'Canva Pro (1 Tahun)', amount: 'Rp 150.000', date: '1 Sep 2026, 09:45', status: 'PENDING', type: 'ACCOUNT' },
  { id: 'FR-20260830-0850', customer: 'Rina Wijaya', email: 'rinaw@example.com', product: 'Spotify Premium (1 Bulan)', amount: 'Rp 35.000', date: '30 Aug 2026, 20:10', status: 'EXPIRED', type: 'ACCOUNT' },
  { id: 'FR-20260829-0742', customer: 'Dimas Aditya', email: 'dimasaditya@mail.com', product: 'Microsoft Office 365', amount: 'Rp 300.000', date: '29 Aug 2026, 11:20', status: 'FAILED', type: 'LICENSE' },
];

const AdminOrdersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleExportCSV = () => {
    const headers = 'Order ID,Customer,Email,Product,Amount,Date,Status\n';
    const rows = mockOrders.map(o => `${o.id},${o.customer},${o.email},${o.product},${o.amount},${o.date},${o.status}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flash-rent-orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'PENDING': return <Clock className="w-4 h-4 text-orange-400" />;
      default: return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PENDING': return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default: return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Daftar Pesanan</h1>
          <p className="text-slate-400">Pantau seluruh riwayat transaksi dan status penyewaan.</p>
        </div>
        <button onClick={handleExportCSV} className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all flex items-center gap-2">
          <Download className="w-4 h-4" />
          Ekspor CSV
        </button>
      </div>

      <div className="bg-slate-900/40 border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden flex flex-col">
        {/* Tabs & Filters */}
        <div className="p-4 border-b border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex bg-white/5 rounded-lg p-1 border border-white/5">
            {['all', 'PAID', 'PENDING', 'EXPIRED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {tab === 'all' ? 'Semua' : tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Order ID / Nama..." 
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white"
              />
            </div>
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-slate-400 text-sm">
                <th className="py-4 px-6 font-medium">Order ID & Waktu</th>
                <th className="py-4 px-6 font-medium">Pelanggan</th>
                <th className="py-4 px-6 font-medium">Produk</th>
                <th className="py-4 px-6 font-medium">Tipe Akses</th>
                <th className="py-4 px-6 font-medium">Total Harga</th>
                <th className="py-4 px-6 font-medium">Status</th>
                <th className="py-4 px-6 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders
                .filter(order => activeTab === 'all' || order.status === activeTab)
                .filter(order => {
                  if (!searchQuery.trim()) return true;
                  const q = searchQuery.toLowerCase();
                  return order.id.toLowerCase().includes(q) || order.customer.toLowerCase().includes(q) || order.product.toLowerCase().includes(q);
                })
                .map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-white mb-0.5">{order.id}</div>
                    <div className="text-xs text-slate-400">{order.date}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-slate-200">{order.customer}</div>
                    <div className="text-xs text-slate-400">{order.email}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-slate-300 font-medium">{order.product}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md text-xs font-medium text-slate-300">
                      {order.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-white">
                    {order.amount}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
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

export default AdminOrdersPage;
