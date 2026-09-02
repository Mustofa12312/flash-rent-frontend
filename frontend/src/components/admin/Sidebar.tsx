import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PackageSearch, 
  ShoppingCart, 
  LogOut, 
  Settings,
  Users,
  BarChart2,
  Tag
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Laporan', icon: BarChart2, path: '/admin/analytics' },
    { name: 'Promo & Diskon', icon: Tag, path: '/admin/promos' },
    { name: 'Produk', icon: PackageSearch, path: '/admin/products' },
    { name: 'Pesanan', icon: ShoppingCart, path: '/admin/orders' },
    { name: 'Pelanggan', icon: Users, path: '/admin/customers' },
    { name: 'Pengaturan', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900/90 lg:bg-slate-900/60 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      <div className="h-20 flex items-center px-8 border-b border-white/5">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Flash<span className="text-white">Admin</span>
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-4">Menu Utama</div>
        
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsOpen(false)}
            end={item.path === '/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-white/5">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Keluar</span>
        </button>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;
