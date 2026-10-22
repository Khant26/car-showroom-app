import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetail from './pages/CarDetail';
import Rental from './pages/Rental';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

// The admin dashboard is code-split so customers never download it.
const AdminApp = lazy(() => import('./admin/AdminApp'));

// Customer-facing layout (navbar + footer + shared showroom data).
function CustomerLayout() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </AppProvider>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<LoadingSpinner size="lg" className="min-h-screen" />}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/cars/:id" element={<CarDetail />} />
        <Route path="/rental" element={<Rental />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
