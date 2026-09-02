import { Search, Filter, Download, FileText, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockOrders = [
  { id: 'FR-20260902-1001', product: 'Canva Pro Premium', amount: 'Rp 100.000', date: '2 Sep 2026, 14:30', status: 'PAID', type: 'Unlimited' },
  { id: 'FR-20260815-0042', product: 'Windows 11 Pro License', amount: 'Rp 250.000', date: '15 Aug 2026, 10:15', status: 'PAID', type: 'Lifetime' },
  { id: 'FR-20260810-0988', product: 'Adobe Creative Cloud', amount: 'Rp 85.000', date: '10 Aug 2026, 09:45', status: 'EXPIRED', type: '1 Bulan' },
  { id: 'FR-20260701-0850', product: 'Spotify Premium', amount: 'Rp 35.000', date: '1 Jul 2026, 20:10', status: 'PAID', type: '1 Bulan' }
];

const CustomerOrdersPage = () => {

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'PENDING': return <Clock className="w-4 h-4 text-orange-600" />;
      default: return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Riwayat Pesanan</h1>
          <p className="text-slate-500">Lihat semua transaksi penyewaan yang pernah Anda lakukan.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari Order ID atau Nama Produk..." 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
              />
            </div>
            <button className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
          
          <button className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-all flex items-center gap-2 text-sm w-full md:w-auto justify-center">
            <Download className="w-4 h-4" />
            Unduh Laporan
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1 p-6 md:p-8 pt-0 mt-6">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 text-sm">
                <th className="py-4 px-4 font-semibold">Order ID & Waktu</th>
                <th className="py-4 px-4 font-semibold">Produk</th>
                <th className="py-4 px-4 font-semibold">Paket</th>
                <th className="py-4 px-4 font-semibold">Total Harga</th>
                <th className="py-4 px-4 font-semibold">Status</th>
                <th className="py-4 px-4 font-semibold text-right">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 px-4">
                    <div className="font-bold text-slate-900 mb-0.5">{order.id}</div>
                    <div className="text-xs text-slate-500">{order.date}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-800">{order.product}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                      {order.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    {order.amount}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${getStatusStyle(order.status)}`}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Lihat Invoice">
                      <FileText className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {mockOrders.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              Anda belum memiliki riwayat pesanan. <br/>
              <Link to="/catalog" className="text-blue-600 font-semibold hover:underline mt-2 inline-block">Mulai sewa sekarang</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrdersPage;
