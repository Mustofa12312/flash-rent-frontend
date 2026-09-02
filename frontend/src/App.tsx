import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';

// Security & Error Handling Pages
import ErrorBoundary from './components/ErrorBoundary';
import NotFoundPage from './pages/NotFoundPage';

// Dummy wrapper for public pages to keep Navbar
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-slate-50 flex flex-col">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    
    <footer className="bg-slate-900 text-slate-400 py-12 text-center mt-auto border-t border-slate-800">
      <p>© {new Date().getFullYear()} Flash Rent. All rights reserved.</p>
    </footer>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Admin Routes (No public Navbar) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            {/* Catch missing admin routes */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/catalog" element={<PublicLayout><CatalogPage /></PublicLayout>} />
          <Route path="/product/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
          <Route path="/checkout" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
          <Route path="/payment" element={<PublicLayout><PaymentPage /></PublicLayout>} />
          <Route path="/success" element={<PublicLayout><SuccessPage /></PublicLayout>} />
          
          {/* 404 Catch All */}
          <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
