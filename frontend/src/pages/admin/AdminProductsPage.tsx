import { Plus, Search, Edit2, Trash2, MoreVertical, Star } from 'lucide-react';

const mockProducts = [
  {
    id: 'prod-1',
    name: 'Canva Pro',
    description: 'Akses penuh ke semua fitur premium Canva.',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=100',
    rating: 4.8,
    packages: [{ price: 15000 }]
  },
  {
    id: 'prod-2',
    name: 'Spotify Premium',
    description: 'Dengarkan musik tanpa iklan.',
    category: 'Entertainment',
    image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=100',
    rating: 4.9,
    packages: [{ price: 35000 }]
  }
];

const AdminProductsPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manajemen Produk</h1>
          <p className="text-slate-400">Kelola katalog produk, harga, dan ketersediaan.</p>
        </div>
        <button className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Tambah Produk
        </button>
      </div>

      <div className="bg-slate-900/40 border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari produk..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer">
              <option value="all">Semua Kategori</option>
              <option value="software">Software</option>
              <option value="entertainment">Entertainment</option>
            </select>
            <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer">
              <option value="newest">Terbaru</option>
              <option value="popular">Terpopuler</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-slate-400 text-sm">
                <th className="py-4 px-6 font-medium">Produk Info</th>
                <th className="py-4 px-6 font-medium">Kategori</th>
                <th className="py-4 px-6 font-medium">Harga (Mulai dari)</th>
                <th className="py-4 px-6 font-medium">Rating</th>
                <th className="py-4 px-6 font-medium">Stok/Status</th>
                <th className="py-4 px-6 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mockProducts.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-white/10 flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-semibold text-white mb-1">{product.name}</div>
                        <div className="text-xs text-slate-400 max-w-[200px] truncate">{product.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium text-slate-300">
                      {product.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-medium text-blue-400">
                    Rp {product.packages[0]?.price.toLocaleString('id-ID')}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-sm text-emerald-400">Tersedia</span>
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white transition-colors" title="Lainnya">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between text-sm text-slate-400">
          <div>Menampilkan 1 hingga {mockProducts.length} dari {mockProducts.length} produk</div>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-md hover:bg-white/10 transition-colors disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 rounded-md bg-blue-600 text-white">1</button>
            <button className="px-3 py-1 rounded-md hover:bg-white/10 transition-colors disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductsPage;
