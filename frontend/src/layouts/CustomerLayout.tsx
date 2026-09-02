import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-grow pt-16">
        {/* pt-16 to offset the fixed navbar */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
