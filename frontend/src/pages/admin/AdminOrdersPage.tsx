import { useState, useEffect } from 'react';
import { Search, Filter, Download, MoreHorizontal, CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { AccessManager } from '../../lib/accessManager';

const AdminOrdersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching orders:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleExportCSV = () => {
    const headers = 'Order ID,Customer,Email,Product,Amount,Date,Status\n';
    const rows = orders.map(o => `${o.id},${o.customerName},${o.customerEmail},${o.productName},${o.amount},${new Date(o.createdAt).toLocaleString('id-ID')},${o.status}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flash-rent-orders.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleVerify = async (orderId: string, action: 'APPROVE' | 'REJECT') => {
    if (!window.confirm(`Yakin ingin ${action === 'APPROVE' ? 'menyetujui' : 'menolak'} pesanan ini?`)) return;
    
    setProcessingId(orderId);
    try {
      const orderRef = doc(db, 'orders', orderId);
      const orderSnap = await getDoc(orderRef);
      if (!orderSnap.exists()) throw new Error('Pesanan tidak ditemukan');
      const orderData = orderSnap.data();

      if (action === 'REJECT') {
        await updateDoc(orderRef, { status: 'FAILED', updatedAt: new Date().toISOString() });
        alert('Pesanan telah ditolak.');
      } else if (action === 'APPROVE') {
        // 1. Update Order Status
        await updateDoc(orderRef, { status: 'PAID', updatedAt: new Date().toISOString() });

        // 2. Generate Access Data
        const accessData = await AccessManager.assignAccessData(orderData.productId, orderId, orderData.productCategory);

        // 3. Create Rental Doc
        const rentalId = `RNT-${new Date().toISOString().slice(2,10).replace(/-/g,'')}-${Math.random().toString(16).slice(2,6).toUpperCase()}`;
        
        let expiresAt = null;
        if (orderData.packageDurationType !== 'UNLIMITED') {
          const now = new Date();
          const value = orderData.packageDurationValue || 30;
          if (orderData.packageDurationUnit === 'Hari') now.setDate(now.getDate() + value);
          else if (orderData.packageDurationUnit === 'Bulan') now.setMonth(now.getMonth() + value);
          else if (orderData.packageDurationUnit === 'Tahun') now.setFullYear(now.getFullYear() + value);
          expiresAt = now.toISOString();
        }

        await setDoc(doc(db, 'rentals', rentalId), {
          id: rentalId,
          orderId: orderId,
          userId: orderData.userId,
          productId: orderData.productId,
          productName: orderData.productName,
          packageId: orderData.packageId,
          package: orderData.packageName,
          durationUnit: orderData.packageDurationUnit,
          durationValue: orderData.packageDurationValue,
          status: 'ACTIVE',
          accessData: accessData,
          createdAt: new Date().toISOString(),
          expiresAt: expiresAt
        });

        alert('Pesanan berhasil disetujui dan lisensi dibuat.');
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || 'Gagal memverifikasi pesanan');
    } finally {
      setProcessingId(null);
    }
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
      case 'VERIFYING': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
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
          <div className="flex bg-white/5 rounded-lg p-1 border border-white/5 overflow-x-auto">
            {['all', 'VERIFYING', 'PAID', 'PENDING', 'EXPIRED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
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
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Belum ada data pesanan.
                  </td>
                </tr>
              ) : (
                orders
                  .filter(order => activeTab === 'all' || order.status === activeTab)
                  .filter(order => {
                    if (!searchQuery.trim()) return true;
                    const q = searchQuery.toLowerCase();
                    return order.id.toLowerCase().includes(q) || (order.customerName && order.customerName.toLowerCase().includes(q)) || (order.productName && order.productName.toLowerCase().includes(q));
                  })
                  .map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white mb-0.5">{order.id}</div>
                      <div className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleString('id-ID')}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-slate-200">{order.customerName}</div>
                      <div className="text-xs text-slate-400">{order.customerEmail}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-slate-300 font-medium">{order.productName}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-md text-xs font-medium text-slate-300">
                        {order.productCategory?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-white">
                      Rp {order.amount?.toLocaleString('id-ID')}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {order.status === 'VERIFYING' ? (
                        <div className="flex gap-2 justify-end">
                          <button 
                            disabled={processingId === order.id}
                            onClick={() => handleVerify(order.id, 'APPROVE')}
                            className="px-3 py-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-md text-xs font-medium border border-emerald-500/30 transition-colors disabled:opacity-50"
                          >
                            Setuju
                          </button>
                          <button 
                            disabled={processingId === order.id}
                            onClick={() => handleVerify(order.id, 'REJECT')}
                            className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-md text-xs font-medium border border-red-500/30 transition-colors disabled:opacity-50"
                          >
                            Tolak
                          </button>
                        </div>
                      ) : (
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
