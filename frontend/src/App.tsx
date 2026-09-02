import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerLayout from './layouts/CustomerLayout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="payment/:orderId" element={<PaymentPage />} />
          <Route path="success/:orderId" element={<SuccessPage />} />
          {/* Placeholder for future pages */}
          <Route path="rentals" element={<div className="p-20 text-center text-2xl font-bold">My Rentals (Coming Soon)</div>} />
          <Route path="orders" element={<div className="p-20 text-center text-2xl font-bold">Orders (Coming Soon)</div>} />
          <Route path="account" element={<div className="p-20 text-center text-2xl font-bold">Account (Coming Soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
