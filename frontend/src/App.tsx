import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';
import CustomerRentalsPage from './pages/CustomerRentalsPage';
import CustomerOrdersPage from './pages/CustomerOrdersPage';
import CustomerAccountPage from './pages/CustomerAccountPage';

// Admin Pages
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import AdminPromoPage from './pages/admin/AdminPromoPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminCustomersPage from './pages/admin/AdminCustomersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';

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
    <Footer />
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
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="promos" element={<AdminPromoPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            {/* Catch missing admin routes */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
          <Route path="/catalog" element={<PublicLayout><CatalogPage /></PublicLayout>} />
          <Route path="/product/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
          <Route path="/checkout" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
          <Route path="/payment/:orderId" element={<PublicLayout><PaymentPage /></PublicLayout>} />
          <Route path="/success/:orderId" element={<PublicLayout><SuccessPage /></PublicLayout>} />
          
          {/* Customer Portal Routes */}
          <Route path="/rentals" element={<PublicLayout><CustomerRentalsPage /></PublicLayout>} />
          <Route path="/orders" element={<PublicLayout><CustomerOrdersPage /></PublicLayout>} />
          <Route path="/account" element={<PublicLayout><CustomerAccountPage /></PublicLayout>} />

          {/* 404 Catch All */}
          <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
