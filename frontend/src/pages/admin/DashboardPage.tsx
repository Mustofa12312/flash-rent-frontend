import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Package, DollarSign, ArrowUpRight, Loader2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, getDocs, getCountFromServer, getAggregateFromServer, sum, orderBy, limit } from 'firebase/firestore';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    customers: 0,
    products: 0,
    activeRentals: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // 1. Total Revenue (Sum of finalPrice for PAID orders)
        const ordersRef = collection(db, 'orders');
        const paidOrdersQ = query(ordersRef, where('status', '==', 'PAID'));
        const revenueSnapshot = await getAggregateFromServer(paidOrdersQ, {
          totalRevenue: sum('finalPrice')
        });

        // 2. Customers Count
        const usersRef = collection(db, 'users');
        const customersQ = query(usersRef, where('role', '==', 'CUSTOMER'));
        const customersSnapshot = await getCountFromServer(customersQ);

        // 3. Products Count
        const productsRef = collection(db, 'products');
        const productsSnapshot = await getCountFromServer(productsRef);

        // 4. Active Rentals Count
        const rentalsRef = collection(db, 'rentals');
        const activeRentalsQ = query(rentalsRef, where('status', '==', 'ACTIVE'));
        const activeRentalsSnapshot = await getCountFromServer(activeRentalsQ);

        // 5. Recent Orders
        const recentOrdersQ = query(ordersRef, orderBy('createdAt', 'desc'), limit(5));
        const recentOrdersSnap = await getDocs(recentOrdersQ);
        const ordersData = recentOrdersSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setStats({
          revenue: revenueSnapshot.data().totalRevenue || 0,
          customers: customersSnapshot.data().count,
          products: productsSnapshot.data().count,
          activeRentals: activeRentalsSnapshot.data().count
        });
        setRecentOrders(ordersData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatIDR = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const statCards = [
    { title: 'Total Pendapatan', value: formatIDR(stats.revenue), icon: DollarSign, color: 'from-emerald-500 to-green-500' },
    { title: 'Pelanggan Aktif', value: stats.customers.toLocaleString(), icon: Users, color: 'from-blue-500 to-cyan-500' },
    { title: 'Total Produk', value: stats.products.toLocaleString(), icon: Package, color: 'from-purple-500 to-indigo-500' },
    { title: 'Penyewaan Aktif', value: stats.activeRentals.toLocaleString(), icon: TrendingUp, color: 'from-orange-500 to-red-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Ringkasan Dasbor</h1>
          <p className="text-slate-400">Pantau performa bisnis Flash Rent hari ini.</p>
        </div>
        <Link to="/admin/orders" className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-colors flex items-center gap-2">
          Unduh Laporan <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-white/20 transition-all">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110`}></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-slate-400 text-sm font-medium mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Transaksi Terakhir</h2>
          <Link to="/admin/orders" className="text-sm text-blue-400 hover:text-blue-300 font-medium">Lihat Semua</Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-slate-400 text-sm">
                <th className="pb-4 font-medium px-4">Order ID</th>
                <th className="pb-4 font-medium px-4">Pelanggan</th>
                <th className="pb-4 font-medium px-4">Produk</th>
                <th className="pb-4 font-medium px-4">Tanggal</th>
                <th className="pb-4 font-medium px-4">Jumlah</th>
                <th className="pb-4 font-medium px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const date = new Intl.DateTimeFormat('id-ID', {
                  day: '2-digit', month: 'short', year: 'numeric',
                  hour: '2-digit', minute: '2-digit'
                }).format(new Date(order.createdAt));
                
                return (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-medium text-white">{order.id}</td>
                  <td className="py-4 px-4 text-slate-300">
                    <div>{order.customerName}</div>
                    <div className="text-xs text-slate-500">{order.customerEmail}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-300">
                    <div>{order.productName}</div>
                    <div className="text-xs text-slate-500">{order.packageName}</div>
                  </td>
                  <td className="py-4 px-4 text-slate-400 text-sm">{date}</td>
                  <td className="py-4 px-4 font-medium text-white">{formatIDR(order.finalPrice)}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      order.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      order.status === 'PENDING' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                      order.status === 'VERIFYING' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
