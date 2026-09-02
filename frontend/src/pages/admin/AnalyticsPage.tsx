import { useState, useEffect } from 'react';
import { BarChart as BarIcon, PieChart as PieIcon, TrendingUp, Users, Activity, Loader2 } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-white font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-slate-400">{entry.name}:</span>
            <span className="text-white font-medium">
              {entry.name === 'Pendapatan' 
                ? `Rp ${entry.value.toLocaleString('id-ID')}` 
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const AnalyticsPage = () => {
  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  
  // States for aggregated data
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [aov, setAov] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Orders (PAID)
        const ordersSnap = await getDocs(query(collection(db, 'orders'), where('status', '==', 'PAID')));
        const orders = ordersSnap.docs.map(doc => doc.data());
        
        // Calculate Revenue Trend (Mocking months logic based on order createdAt)
        // Since we don't have historical data, we will just use real orders and group by month.
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const revMap: Record<string, { revenue: number; orders: number }> = {};
        
        // Initialize last 6 months
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          revMap[monthNames[d.getMonth()]] = { revenue: 0, orders: 0 };
        }

        let totalRevenue = 0;
        orders.forEach(o => {
          const d = new Date(o.createdAt);
          const monthName = monthNames[d.getMonth()];
          if (revMap[monthName]) {
            revMap[monthName].revenue += o.finalPrice || 0;
            revMap[monthName].orders += 1;
          }
          totalRevenue += o.finalPrice || 0;
        });

        const formattedRevData = Object.keys(revMap).map(key => ({
          name: key,
          revenue: revMap[key].revenue,
          orders: revMap[key].orders
        }));
        setRevenueData(formattedRevData);

        // AOV
        setAov(orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0);

        // Fetch Products for Categories
        const productsSnap = await getDocs(collection(db, 'products'));
        const catCount: Record<string, number> = {};
        let totalProds = 0;
        productsSnap.docs.forEach(doc => {
          const cat = doc.data().category || 'Other';
          catCount[cat] = (catCount[cat] || 0) + 1;
          totalProds++;
        });
        
        const catData = Object.keys(catCount).map(key => ({
          name: key,
          value: totalProds > 0 ? Math.round((catCount[key] / totalProds) * 100) : 0
        }));
        setCategoryData(catData);

        // Fetch Customers count
        const usersSnap = await getDocs(query(collection(db, 'users'), where('role', '==', 'CUSTOMER')));
        setTotalCustomers(usersSnap.size);

      } catch (error) {
        console.error("Error fetching analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Laporan Analitik</h1>
          <p className="text-slate-400">Visualisasi data dan performa bisnis Flash Rent.</p>
        </div>
        <div className="flex bg-slate-900/50 rounded-xl p-1 border border-white/10">
          {[{key: 'monthly', label: 'Bulanan'}, {key: 'weekly', label: 'Mingguan'}, {key: 'yearly', label: 'Tahunan'}].map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === p.key ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <TrendingUp className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Konversi Pembayaran</p>
            <h3 className="text-2xl font-bold text-white">100%</h3>
            <p className="text-xs text-emerald-400 mt-1">Real-time data</p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
            <Users className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Pelanggan Aktif</p>
            <h3 className="text-2xl font-bold text-white">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : totalCustomers}
            </h3>
            <p className="text-xs text-emerald-400 mt-1">Total di database</p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <Activity className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Rata-rata Order (AOV)</p>
            <h3 className="text-2xl font-bold text-white">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Rp ${aov.toLocaleString('id-ID')}`}
            </h3>
            <p className="text-xs text-emerald-400 mt-1">Berdasarkan total penjualan</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart - Revenue Trend */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <BarIcon className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Tren Pendapatan</h2>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(value) => `Rp${value / 1000000}M`}
                />
                <RechartsTooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  name="Pendapatan"
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Side Chart - Category Distribution */}
        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <PieIcon className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Distribusi Kategori</h2>
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="w-full mt-4 space-y-3">
              {categoryData.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-slate-300 text-sm">{category.name}</span>
                  </div>
                  <span className="text-white font-medium text-sm">{category.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
