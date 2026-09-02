import { useState } from 'react';
import { BarChart as BarIcon, PieChart as PieIcon, TrendingUp, Users, Activity } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

// Mock Data for Revenue Trends (Last 7 Months)
const revenueData = [
  { name: 'Mar', revenue: 12000000, orders: 40 },
  { name: 'Apr', revenue: 19000000, orders: 55 },
  { name: 'Mei', revenue: 15000000, orders: 48 },
  { name: 'Jun', revenue: 22000000, orders: 70 },
  { name: 'Jul', revenue: 28000000, orders: 90 },
  { name: 'Agu', revenue: 24000000, orders: 85 },
  { name: 'Sep', revenue: 32000000, orders: 110 },
];

// Mock Data for Product Category Distribution
const categoryData = [
  { name: 'Software', value: 45 },
  { name: 'Entertainment', value: 35 },
  { name: 'Design Tools', value: 20 },
];

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
            <h3 className="text-2xl font-bold text-white">84.2%</h3>
            <p className="text-xs text-emerald-400 mt-1">+2.4% dari bulan lalu</p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
            <Users className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Pelanggan Baru</p>
            <h3 className="text-2xl font-bold text-white">342</h3>
            <p className="text-xs text-emerald-400 mt-1">+12% dari bulan lalu</p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-6 backdrop-blur-md flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <Activity className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">Rata-rata Order (AOV)</p>
            <h3 className="text-2xl font-bold text-white">Rp 125K</h3>
            <p className="text-xs text-red-400 mt-1">-1.5% dari bulan lalu</p>
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
