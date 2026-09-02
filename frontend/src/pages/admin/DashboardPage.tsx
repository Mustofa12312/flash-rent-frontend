import React from 'react';
import { TrendingUp, Users, Package, DollarSign, ArrowUpRight } from 'lucide-react';

const statCards = [
  { title: 'Total Pendapatan', value: 'Rp 24.500.000', increase: '+15.3%', icon: DollarSign, color: 'from-emerald-500 to-green-500' },
  { title: 'Pelanggan Aktif', value: '1,234', increase: '+4.1%', icon: Users, color: 'from-blue-500 to-cyan-500' },
  { title: 'Total Produk', value: '85', increase: '+2', icon: Package, color: 'from-purple-500 to-indigo-500' },
  { title: 'Penyewaan Aktif', value: '432', increase: '+12.5%', icon: TrendingUp, color: 'from-orange-500 to-red-500' },
];

const recentOrders = [
  { id: 'FR-1001', customer: 'Budi Santoso', product: 'Windows 11 Pro', date: '02 Sep 2026', amount: 'Rp 250.000', status: 'PAID' },
  { id: 'FR-1002', customer: 'Siti Aminah', product: 'Netflix Premium 1 Bulan', date: '02 Sep 2026', amount: 'Rp 45.000', status: 'PAID' },
  { id: 'FR-1003', customer: 'Agus Pratama', product: 'Canva Pro 1 Tahun', date: '01 Sep 2026', amount: 'Rp 150.000', status: 'PENDING' },
  { id: 'FR-1004', customer: 'Rina Wijaya', product: 'Spotify Premium', date: '01 Sep 2026', amount: 'Rp 35.000', status: 'EXPIRED' },
];

const DashboardPage = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Ringkasan Dasbor</h1>
          <p className="text-slate-400">Pantau performa bisnis Flash Rent hari ini.</p>
        </div>
        <button className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-colors flex items-center gap-2">
          Unduh Laporan <ArrowUpRight className="w-4 h-4" />
        </button>
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
              <span className="text-emerald-400 text-sm font-medium bg-emerald-400/10 px-2.5 py-1 rounded-full flex items-center gap-1">
                {stat.increase} <TrendingUp className="w-3 h-3" />
              </span>
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
          <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">Lihat Semua</button>
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
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-4 font-medium text-white">{order.id}</td>
                  <td className="py-4 px-4 text-slate-300">{order.customer}</td>
                  <td className="py-4 px-4 text-slate-300">{order.product}</td>
                  <td className="py-4 px-4 text-slate-400 text-sm">{order.date}</td>
                  <td className="py-4 px-4 font-medium text-white">{order.amount}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      order.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      order.status === 'PENDING' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {order.status}
                    </span>
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

export default DashboardPage;
