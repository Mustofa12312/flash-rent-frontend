import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';
// Temporarily using mock data since Firebase is not fully connected
// import { ProductService } from '../lib/services/product.service';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Canva Pro',
    description: 'Akses penuh ke semua fitur premium Canva. Ratusan ribu template, elemen grafis, dan alat desain profesional.',
    category: 'Design',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Spotify Premium',
    description: 'Dengarkan musik tanpa iklan, unduh untuk offline, dan nikmati kualitas suara tertinggi.',
    category: 'Entertainment',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Netflix Premium',
    description: 'Streaming film dan series kualitas 4K UHD. Mendukung hingga 4 layar bersamaan.',
    category: 'Entertainment',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Microsoft Office 365',
    description: 'Lisensi resmi Microsoft Word, Excel, PowerPoint, dan 1TB OneDrive Storage.',
    category: 'Software',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API Call
    setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Semua Produk</h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Temukan berbagai layanan digital terbaik. Pilih produk, tentukan paket, dan nikmati akses instan.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="animate-pulse bg-slate-200 rounded-2xl h-80"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              // Mocking a starting price for display purposes
              startingPrice={15000} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
