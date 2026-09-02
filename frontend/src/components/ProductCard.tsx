import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { ChevronRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  startingPrice?: number;
}

export default function ProductCard({ product, startingPrice }: ProductCardProps) {
  // Format to IDR currency
  const formatIDR = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="group glass rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white flex flex-col h-full">
      {product.image ? (
        <div className="h-48 overflow-hidden flex-shrink-0">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-6 text-center flex-shrink-0">
          <h3 className="text-4xl font-bold text-white leading-tight uppercase shadow-sm">{product.name.charAt(0)}</h3>
        </div>
      )}
      
      <div className="p-6 flex flex-col flex-1">
        <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
          {product.category}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
        <p className="text-slate-600 text-sm line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <div>
            <div className="text-xs text-slate-500">Mulai dari</div>
            <div className="font-bold text-lg text-slate-900">
              {startingPrice ? formatIDR(startingPrice) : 'Rp -'}
            </div>
          </div>
          
          <Link 
            to={`/product/${product.id}`}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
