import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="glass p-8 rounded-2xl shadow-xl text-center"><h1 className="text-4xl font-bold text-blue-600 mb-4">Flash Rent</h1><p className="text-slate-600">Platform Rental Produk Digital</p></div></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
