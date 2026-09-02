import { useState, useEffect } from 'react';
import { Plus, Search, Trash2, X, Loader2, Database } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, getDoc, deleteDoc, doc, addDoc } from 'firebase/firestore';

const AdminProductsPage = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>(['Entertainment', 'Software', 'Design']);
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editProductId, setEditProductId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    image: '',
    rating: 5.0,
    packages: [
      { id: Date.now().toString(), durationValue: '1', durationUnit: 'Bulan', price: '' }
    ]
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    
    // Fetch categories from Firestore settings
    const fetchCategories = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'app'));
        if (snap.exists() && snap.data().categories) {
          setCategories(snap.data().categories);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
        fetchProducts();
      } catch (error) {
        alert('Gagal menghapus produk.');
      }
    }
  };

  const handleEditProduct = (product: any) => {
    setEditProductId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      image: product.image || '',
      rating: product.rating || 5.0,
      packages: product.packages || []
    });
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = async () => {
    try {
      const newProduct = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        image: formData.image || '',
        rating: formData.rating,
        features: ['Fitur Premium 1', 'Fitur Premium 2'],
        packages: formData.packages.map((pkg, i) => ({
          id: `pkg-${Date.now()}-${i}`,
          name: pkg.durationUnit === 'Unlimited' ? 'Akses Selamanya' : `Paket ${pkg.durationValue} ${pkg.durationUnit}`,
          durationType: pkg.durationUnit === 'Unlimited' ? 'UNLIMITED' : 'LIMITED',
          durationUnit: pkg.durationUnit,
          durationValue: Number(pkg.durationValue) || 1,
          price: Number(pkg.price.replace(/\./g, ''))
        }))
      };
      
      if (editProductId) {
        const { updateDoc } = await import('firebase/firestore');
        await updateDoc(doc(db, 'products', editProductId), newProduct);
      } else {
        await addDoc(collection(db, 'products'), newProduct);
      }
      
      setIsAddModalOpen(false);
      setEditProductId(null);
      fetchProducts();
      // Reset form
      setFormData({ 
        name: '', category: '', description: '', image: '', rating: 5.0, 
        packages: [{ id: Date.now().toString(), durationValue: '1', durationUnit: 'Bulan', price: '' }] 
      });
    } catch (error) {
      alert('Gagal menyimpan produk.');
    }
  };

  const handleSeedData = async () => {
    if (!confirm('Ini akan mengimpor produk contoh (Canva, Spotify, dll). Lanjutkan?')) return;
    try {
      const mockProducts = [
        {
          name: 'Canva Pro',
          description: 'Akses penuh ke semua fitur premium Canva.',
          category: 'Design',
          image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=500',
          rating: 4.8,
          features: ['Unlimited Templates', 'Brand Kit', 'Magic Resize'],
          packages: [{ id: 'pkg-c1', name: '1 Bulan', durationUnit: 'Bulan', durationValue: 1, price: 15000 }]
        },
        {
          name: 'Spotify Premium',
          description: 'Dengarkan musik tanpa iklan.',
          category: 'Entertainment',
          image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=500',
          rating: 4.9,
          features: ['Tanpa Iklan', 'Download Offline', 'Kualitas Suara Tinggi'],
          packages: [{ id: 'pkg-s1', name: '1 Bulan', durationUnit: 'Bulan', durationValue: 1, price: 35000 }]
        },
        {
          name: 'Netflix Premium',
          description: 'Streaming film dan series kualitas 4K UHD.',
          category: 'Entertainment',
          image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=500',
          rating: 4.9,
          features: ['Resolusi 4K UHD', 'Bisa ditonton di TV', 'Download Offline'],
          packages: [{ id: 'pkg-n1', name: '1 Bulan 1 Profil', durationUnit: 'Bulan', durationValue: 1, price: 45000 }]
        },
        {
          name: 'Microsoft Office 365',
          description: 'Lisensi resmi Microsoft Word, Excel, PowerPoint.',
          category: 'Software',
          image: 'https://images.unsplash.com/photo-1633419461186-7d40a38b4380?w=500',
          rating: 4.7,
          features: ['1 TB OneDrive', 'Aplikasi Premium', 'Bisa di 5 Perangkat'],
          packages: [{ id: 'pkg-m1', name: '1 Tahun', durationUnit: 'Tahun', durationValue: 1, price: 250000 }]
        }
      ];

      for (const prod of mockProducts) {
        await addDoc(collection(db, 'products'), prod);
      }
      alert('Berhasil impor produk contoh!');
      fetchProducts();
    } catch (error) {
      alert('Gagal impor data.');
    }
  };

  const handleAddPackage = () => {
    setFormData({
      ...formData,
      packages: [...formData.packages, { id: Date.now().toString(), durationValue: '1', durationUnit: 'Bulan', price: '' }]
    });
  };

  const handleRemovePackage = (index: number) => {
    const updated = formData.packages.filter((_, i) => i !== index);
    setFormData({ ...formData, packages: updated });
  };

  const handlePackageChange = (index: number, field: string, value: string) => {
    const updated = [...formData.packages];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, packages: updated });
  };

  const handlePackagePriceChange = (index: number, value: string) => {
    const rawValue = value.replace(/\D/g, '');
    const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const updated = [...formData.packages];
    updated[index] = { ...updated[index], price: formatted };
    setFormData({ ...formData, packages: updated });
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manajemen Produk</h1>
          <p className="text-slate-400">Kelola katalog produk, harga, dan ketersediaan.</p>
        </div>
        <div className="flex gap-2">
          {products.length === 0 && (
            <button 
              onClick={handleSeedData}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all flex items-center gap-2"
            >
              <Database className="w-5 h-5" />
              Impor Contoh
            </button>
          )}
          <button 
            onClick={() => {
              setEditProductId(null);
              setFormData({ 
                name: '', category: '', description: '', image: '', rating: 5.0, 
                packages: [{ id: Date.now().toString(), durationValue: '1', durationUnit: 'Bulan', price: '' }] 
              });
              setIsAddModalOpen(true);
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Tambah Produk
          </button>
        </div>
      </div>

      <div className="bg-slate-900/40 border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none cursor-pointer"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5 text-slate-400 text-sm">
                  <th className="py-4 px-6 font-medium">Produk Info</th>
                  <th className="py-4 px-6 font-medium">Kategori</th>
                  <th className="py-4 px-6 font-medium">Harga (Mulai dari)</th>
                  <th className="py-4 px-6 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-white/10 flex-shrink-0">
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                              {product.name.charAt(0).toUpperCase()}
                            </div>
                          )}
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
                      Rp {product.packages?.[0]?.price?.toLocaleString('id-ID') || 0}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors" title="Edit" onClick={() => handleEditProduct(product)}>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors" title="Hapus" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              Belum ada produk. Silakan tambah atau klik "Impor Contoh".
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-800/50">
              <h2 className="text-xl font-bold text-white">{editProductId ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Nama Produk</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Contoh: Netflix Premium" className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Kategori</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all appearance-none cursor-pointer">
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-300">Deskripsi Produk</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} placeholder="Deskripsi lengkap..." className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all"></textarea>
                </div>
                <div className="space-y-4 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-300">Daftar Paket Produk</label>
                    <button type="button" onClick={handleAddPackage} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                      <Plus className="w-3 h-3" /> Tambah Paket
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.packages.map((pkg, idx) => (
                      <div key={pkg.id} className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-800/30 border border-white/5 rounded-xl relative group">
                        <div className="flex-1 space-y-1">
                          <label className="text-xs text-slate-400">Durasi</label>
                          <div className="flex gap-2">
                            <input 
                              type="number" min="1" 
                              value={pkg.durationValue} 
                              onChange={e => handlePackageChange(idx, 'durationValue', e.target.value)}
                              disabled={pkg.durationUnit === 'Unlimited'}
                              className="w-20 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none disabled:opacity-50"
                            />
                            <select 
                              value={pkg.durationUnit} 
                              onChange={e => handlePackageChange(idx, 'durationUnit', e.target.value)}
                              className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none appearance-none"
                            >
                              <option value="Hari">Hari</option>
                              <option value="Bulan">Bulan</option>
                              <option value="Tahun">Tahun</option>
                              <option value="Unlimited">Unlimited</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-xs text-slate-400">Harga (Rp)</label>
                          <input 
                            type="text" 
                            value={pkg.price} 
                            onChange={e => handlePackagePriceChange(idx, e.target.value)}
                            placeholder="Contoh: 15.000"
                            className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none"
                          />
                        </div>
                        
                        {formData.packages.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemovePackage(idx)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-300">URL Gambar (Opsional)</label>
                  <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://..." className="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-transparent outline-none transition-all" />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-white/10 bg-slate-800/50 flex justify-end gap-3">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-6 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 font-medium transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSaveProduct}
                disabled={!formData.name || !formData.category || formData.packages.some(p => !p.price)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50"
              >
                Simpan Produk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductsPage;
