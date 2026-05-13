import React from 'react';
import { Sparkles, Calendar, User, Home, Activity, LogOut, Lock } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Button from './Button';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, logout } = useAuth();

  const isGuest = currentPath === '/' || currentPath === '/login';

  const getInitials = (name) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).slice(0, 2).join('');
  };

  const handleLogout = () => {
    localStorage.removeItem('is_demo_login');
    localStorage.removeItem('demo_user_email');
    logout();
  };

  if (isGuest) {
    return (
      <>
        {/* Guest Desktop & Mobile Top Header */}
        <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm transition-all duration-300">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <img src="/logo-navy.png" alt="VIP Healthcare" className="h-14 md:h-20 w-auto mix-blend-multiply object-contain" />
            </Link>

            {/* Desktop Links */}
            <nav className="hidden md:flex items-center gap-8 text-gray-600 font-medium">
              <Link to="/" className="hover:text-vipNavy transition-colors">الرئيسية</Link>
              <a href="/#value" className="hover:text-vipNavy transition-colors">المميزات</a>
              <a href="/#how-it-works" className="hover:text-vipNavy transition-colors">آلية العمل</a>
              <a href="/#faq" className="hover:text-vipNavy transition-colors">الأسئلة الشائعة</a>
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center text-sm text-gray-500 font-semibold bg-gray-50 px-3 py-1.5 rounded-full">
                تشفير مصرفي آمن <Lock className="w-4 h-4 mr-1 text-gray-400" />
              </div>
              <Link to="/login">
                <Button variant="primary" className="px-5 py-2 text-sm">
                  تسجيل الدخول
                </Button>
              </Link>
            </div>
          </div>
        </header>
      </>
    );
  }

  // Logged-in App Navbar
  return (
    <>
      {/* Desktop Sidebar (RTL) */}
      <aside className="hidden md:flex flex-col fixed inset-y-0 right-0 w-64 bg-white border-l border-gray-100 shadow-sm z-50 py-8 px-6 overflow-y-auto">
        <Link to="/" className="flex items-center justify-center mb-10 pt-2">
          <img src="/logo-navy.png" alt="VIP Healthcare" className="h-24 w-auto mix-blend-multiply object-contain" />
        </Link>

        <nav className="flex flex-col gap-2 flex-grow">
          <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">التطبيق</p>
          <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentPath === '/dashboard' ? 'bg-vipNavy text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-vipNavy'}`}>
            <Home className="w-5 h-5" />
            <span className="font-semibold text-sm">لوحة الصحة</span>
          </Link>
          <Link to="/doctors" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentPath === '/doctors' ? 'bg-vipNavy text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-vipNavy'}`}>
            <Calendar className="w-5 h-5" />
            <span className="font-semibold text-sm">حجز الأطباء</span>
          </Link>

          <p className="text-xs font-bold text-gray-400 mt-6 mb-2 uppercase tracking-wider">الحساب</p>
          <Link to="/profile" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${currentPath === '/profile' ? 'bg-vipNavy text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-vipNavy'}`}>
            <User className="w-5 h-5" />
            <span className="font-semibold text-sm">الملف الشخصي</span>
          </Link>
        </nav>

        <div className="mt-auto border-t border-gray-100 pt-6">
          <div className="flex items-center gap-3 px-2 mb-6">
            <div className="w-10 h-10 bg-[#D4B892] rounded-full text-white flex items-center justify-center font-bold">
              {getInitials(user?.name)}
            </div>
            <div>
              <p className="text-sm font-bold text-vipNavy truncate max-w-[120px]">{user?.name || 'مستخدم جديد'}</p>
              <p className="text-xs text-gray-400">عضو مميز</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-2 py-2 text-gray-500 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-bold">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* App Mobile Top Header */}
      <header className="md:hidden flex fixed top-0 w-full bg-white/90 backdrop-blur-md z-40 border-b border-gray-100 shadow-sm px-4 py-3 justify-between items-center transition-all">
        <Link to="/" className="flex items-center">
          <img src="/logo-navy.png" alt="VIP Healthcare" className="h-12 w-auto mix-blend-multiply object-contain" />
        </Link>
        <Link to="/profile" className="w-10 h-10 bg-[#D4B892] rounded-full flex items-center justify-center overflow-hidden text-white font-bold text-xs shadow-inner">
          {getInitials(user?.name)}
        </Link>
      </header>

      {/* App Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 pb-safe">
        <div className="flex justify-around items-center py-3">
          <Link to="/dashboard" className={`flex flex-col items-center gap-1 ${currentPath === '/dashboard' ? 'text-vipNavy' : 'text-gray-400'} transition-colors`}>
            <Activity className="w-6 h-6" />
            <span className="text-[10px] font-medium">مؤشراتي</span>
          </Link>
          <div className="relative -top-6">
            <Link to="/doctors" className="flex items-center justify-center w-14 h-14 bg-vipNavy rounded-full shadow-lg shadow-vipNavy/30 text-white hover:scale-105 transition-transform">
              <Calendar className="w-6 h-6 text-vipGoldDark" />
            </Link>
          </div>
          <Link to="/profile" className={`flex flex-col items-center gap-1 ${currentPath === '/profile' ? 'text-vipNavy' : 'text-gray-400'} transition-colors`}>
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">حسابي</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
