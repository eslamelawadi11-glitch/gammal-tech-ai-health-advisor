import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import FindDoctorsPage from './pages/FindDoctorsPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import PageWrapper from './components/PageWrapper';
import AIChatBot from './components/AIChatBot';


const ScrollToHash = () => {
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [hash]);
  return null;
};

// Layout wrapper to conditionally show/hide Sidebar and adjust margins
const LayoutConfig = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // App views that render the Sidebar
  const isAppView = currentPath === '/dashboard' || currentPath === '/doctors' || currentPath === '/profile';
  const isGuest = currentPath === '/' || currentPath === '/login';

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex flex-col md:flex-row rtl">
      {currentPath !== '/login' && <Navbar />}
      <main className={`flex-grow w-full ${isAppView ? 'md:pr-64' : ''} transition-all duration-500 ease-in-out`}>
        <AnimatePresence mode="wait">
          <div key={currentPath}>
            {children}
          </div>
        </AnimatePresence>
        {isGuest && currentPath !== '/login' && <Footer />}
        <AIChatBot />
      </main>
    </div>
  );
};

// Main App wrapper separated so useLocation() works inside Router
const AnimatedRoutes = () => {
  return (
    <LayoutConfig>
      <Routes>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><DashboardPage /></PageWrapper>} />
        <Route path="/doctors" element={<PageWrapper><FindDoctorsPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
        <Route path="/checkout" element={<PageWrapper><CheckoutPage /></PageWrapper>} />
      </Routes>
    </LayoutConfig>
  );
};

function App() {
  useEffect(() => {
    // Recovery: Settle any interrupted payments from previous sessions
    if (window.GammalTech && window.GammalTech.payment) {
      window.GammalTech.payment.settlePending();
    }
  }, []);

  return (
    <Router>
      <ScrollToHash />
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'inherit', fontWeight: '600' } }} />
      <AnimatedRoutes />
    </Router>
  );
}

export default App;
