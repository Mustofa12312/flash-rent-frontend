import { useState, useEffect } from 'react';
import { Search, Filter, Download, FileText, CheckCircle2, Clock, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

const CustomerOrdersPage = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'orders'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching orders:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUser]);

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDownloadInvoice = (order: any) => {
    const canvas = document.createElement('canvas');
    const W = 600;
    const H = 420;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, W, H);

    // Header bar
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(0, 0, W, 80);

    // Flash Rent title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 26px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('⚡ FLASH RENT', 30, 50);

    ctx.fillStyle = '#93c5fd';
    ctx.font = '13px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('INVOICE RESMI', W - 30, 45);
    ctx.fillStyle = '#64748b';
    ctx.fillText('flash-rent-51a14.web.app', W - 30, 62);

    // Order ID & Date
    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText('Order ID', 30, 110);
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(order.id, 30, 130);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText('Tanggal', 30, 158);
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '14px sans-serif';
    ctx.fillText(new Date(order.createdAt).toLocaleString('id-ID'), 30, 176);

    // Customer info
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText('Pelanggan', 300, 110);
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(order.customerName || '-', 300, 130);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText(order.customerEmail || '-', 300, 148);

    // Divider
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 200);
    ctx.lineTo(W - 30, 200);
    ctx.stroke();

    // Product info
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText('Produk', 30, 225);
    ctx.fillStyle = '#f1f5f9';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(order.productName || '-', 30, 245);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText('Paket', 30, 270);
    ctx.fillStyle = '#60a5fa';
    ctx.font = '14px sans-serif';
    ctx.fillText(order.packageName || '-', 30, 290);

    // Status
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px sans-serif';
    ctx.fillText('Status', 300, 225);
    const statusColor = order.status === 'PAID' ? '#34d399' : order.status === 'PENDING' ? '#fb923c' : '#f87171';
    ctx.fillStyle = statusColor;
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(order.status, 300, 245);

    // Divider
    ctx.strokeStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(30, 315);
    ctx.lineTo(W - 30, 315);
    ctx.stroke();

    // Total
    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('TOTAL TAGIHAN', W - 30, 345);
    ctx.fillStyle = '#60a5fa';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(formatIDR(order.amount || 0), W - 30, 375);

    // Footer
    ctx.fillStyle = '#475569';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Terima kasih telah menggunakan layanan Flash Rent. Dokumen ini adalah bukti transaksi resmi.', W / 2, 410);

    // Download
    const link = document.createElement('a');
    link.download = `Invoice-FlashRent-${order.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleExportCSV = () => {
    const headers = 'Order ID,Produk,Paket,Total,Status,Tanggal\n';
    const rows = orders
      .map(o => `${o.id},${o.productName},${o.packageName || '-'},${o.amount},${o.status},${new Date(o.createdAt).toLocaleString('id-ID')}`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'riwayat-pesanan-flashrent.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'PENDING': return <Clock className="w-4 h-4 text-orange-500" />;
      case 'VERIFYING': return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default: return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PAID': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'VERIFYING': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-red-50 text-red-700 border-red-200';
    }
  };

  const filtered = orders.filter(o => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return o.id?.toLowerCase().includes(q) || o.productName?.toLowerCase().includes(q);
  });

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Order ID atau Nama Produk..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
              />
            </div>
            <button className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
          
          <button
            onClick={handleExportCSV}
            disabled={orders.length === 0}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition-all flex items-center gap-2 text-sm w-full md:w-auto justify-center disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Unduh Laporan
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1 p-6 md:p-8 pt-0 mt-6">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
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
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 mb-0.5 font-mono text-sm">{order.id}</div>
                      <div className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString('id-ID')}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">{order.productName}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                        {order.packageName || '-'}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {formatIDR(order.amount || 0)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${getStatusStyle(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => handleDownloadInvoice(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        title="Unduh Invoice"
                      >
                        <FileText className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              {searchQuery ? 'Tidak ada pesanan yang cocok dengan pencarian Anda.' : (
                <>
                  Anda belum memiliki riwayat pesanan. <br />
                  <Link to="/catalog" className="text-blue-600 font-semibold hover:underline mt-2 inline-block">Mulai sewa sekarang</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrdersPage;
