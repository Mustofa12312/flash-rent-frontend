import { Link } from 'react-router-dom';
import { Zap, Menu, X, User, LogOut, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  return (
    <nav className="fixed w-full z-50 glass-dark text-white border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-blue-500" />
              <span className="font-bold text-xl tracking-tight">Flash Rent</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/catalog" className="text-slate-300 hover:text-white transition-colors">Products</Link>
            
            {currentUser ? (
              <>
                <Link to="/rentals" className="text-slate-300 hover:text-white transition-colors">My Rentals</Link>
                <Link to="/orders" className="text-slate-300 hover:text-white transition-colors">Orders</Link>
                <div className="h-6 w-px bg-slate-700"></div>
                <Link to="/account" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                  <User className="h-5 w-5" />
                  <span>Account</span>
                </Link>
                <button onClick={logout} className="flex items-center space-x-2 text-rose-400 hover:text-rose-300 transition-colors">
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <div className="h-6 w-px bg-slate-700"></div>
                <Link to="/login" className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full font-medium transition-colors">
                  Daftar
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/catalog" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Products</Link>
            {currentUser ? (
              <>
                <Link to="/rentals" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">My Rentals</Link>
                <Link to="/orders" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Orders</Link>
                <Link to="/account" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Account</Link>
                <button onClick={logout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-rose-400 hover:text-rose-300 hover:bg-slate-800">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Login</Link>
                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800">Daftar</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
