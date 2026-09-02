import type { Package } from '../types';
import { Check } from 'lucide-react';

interface PackageCardProps {
  pkg: Package;
  isSelected: boolean;
  onSelect: (pkg: Package) => void;
}

export default function PackageCard({ pkg, isSelected, onSelect }: PackageCardProps) {
  const formatIDR = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const isUnlimited = pkg.durationType === 'UNLIMITED';

  return (
    <div 
      onClick={() => onSelect(pkg)}
      className={`relative p-6 rounded-2xl border-2 transition-all cursor-pointer ${
        isSelected 
          ? 'border-blue-500 bg-blue-50/50 shadow-md' 
          : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'
      }`}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center">
          <Check className="h-4 w-4" />
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900">{pkg.name}</h3>
        <p className="text-sm text-slate-500 mt-1">{pkg.description}</p>
      </div>
      
      <div className="flex items-baseline mb-4">
        <span className="text-3xl font-extrabold text-slate-900">{formatIDR(pkg.price)}</span>
        <span className="ml-1 text-slate-500 font-medium">
          {isUnlimited ? '/selamanya' : ''}
        </span>
      </div>

      <div className="text-sm font-medium text-slate-700 bg-slate-100 py-1.5 px-3 rounded-lg inline-block">
        Masa Aktif: {isUnlimited ? 'Unlimited' : `${pkg.durationValue} ${pkg.durationUnit}`}
      </div>
    </div>
  );
}
