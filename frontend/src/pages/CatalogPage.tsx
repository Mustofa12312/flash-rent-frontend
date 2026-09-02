import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['Semua']);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
        setProducts(data);

        // Derive categories
        const cats = new Set(data.map(p => p.category));
        setCategories(['Semua', ...Array.from(cats)]);
      } catch (error) {
        console.error("Failed to fetch catalog:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Semua Produk</h1>
          <p className="text-slate-600">Jelajahi berbagai lisensi dan akun premium untuk kebutuhan Anda.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-colors ${
              showFilter ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {showFilter ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
            <span className="hidden sm:inline">{showFilter ? 'Tutup' : 'Filter'}</span>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <div className="mb-8 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-sm font-semibold text-slate-500 mb-3">Kategori</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && !loading && (
        <div className="text-center py-16 text-slate-500">
          <p className="text-lg font-medium mb-2">Produk tidak ditemukan</p>
          <p className="text-sm">Coba ubah kata kunci atau filter Anda.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          [1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse bg-slate-200 rounded-2xl h-80"></div>
          ))
        ) : (
          filtered.map((product) => {
            const startingPrice = product.packages?.[0]?.price || 0;
            return <ProductCard key={product.id} product={product} startingPrice={startingPrice} />
          })
        )}
      </div>
    </div>
  );
}
