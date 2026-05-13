import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // التأكد من حالة الدخول عند تحميل الصفحة
  useEffect(() => {
    if (window.GammalTech && window.GammalTech.isLoggedIn()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);

  };

  const handleGammalLogin = async () => {
    // ... logic remains same ...
    setIsLoading(true);
    try {
      const token = await window.GammalTech.login();
      if (token) {
        const result = await window.GammalTech.verify();
        if (result.success) {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F9FA] p-6 text-[#1B263B] font-sans">

      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <img src="/logo-navy.png" alt="VIP Healthcare" className="h-20 w-auto mb-3 object-contain" />
        <p className="text-gray-400 text-xs tracking-widest uppercase">Premium Healthcare Solutions</p>
      </div>

      <div className="max-w-md w-full bg-white rounded-[2rem] p-8 shadow-2xl border border-gray-100">

        <h2 className="text-2xl font-bold text-center mb-8">تسجيل الدخول</h2>

        {/* Primary Action: Email & Password */}
        <form onSubmit={handleEmailLogin} className="space-y-5 mb-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-[#1B263B] focus:ring-1 focus:ring-[#1B263B] outline-none transition-all bg-gray-50/50"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 mr-1">كلمة المرور</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:border-[#1B263B] focus:ring-1 focus:ring-[#1B263B] outline-none transition-all bg-gray-50/50"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1B263B] text-white rounded-2xl py-4 font-bold text-lg hover:bg-opacity-90 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg"
          >
            {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-4 mb-4">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink-0 mx-4 text-gray-300 text-[10px] font-bold uppercase tracking-widest">أو عبر</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        {/* Alternative Methods */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleGammalLogin}
            disabled={isLoading}
            className="flex flex-col items-center justify-center gap-3 bg-white border border-gray-200 p-4 rounded-2xl hover:bg-gray-50 transition-all group"
          >
            <img src="https://www.gammal.tech/favicon.ico" className="w-8 h-8 grayscale group-hover:grayscale-0 transition-all" alt="GT" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Gammal Tech</span>
          </button>

          <button className="flex flex-col items-center justify-center gap-3 bg-white border border-gray-200 p-4 rounded-2xl hover:bg-gray-50 transition-all group">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.96.95-2.04 1.44-3.24 1.46-1.18.02-2.09-.32-3.35-.32-1.28 0-2.27.35-3.32.32-1.14-.03-2.14-.49-3.01-1.39C2.45 18.66 1.42 15.86 1.42 13.01c0-2.11.7-3.86 2.08-5.24 1.14-1.14 2.58-1.72 4.31-1.74 1.28.02 2.37.4 3.19.4.82 0 2.1-.49 3.59-.49 1.44.02 2.8.52 3.82 1.5-3.01 1.48-2.52 5.61.47 7.03-.68 1.76-1.57 3.51-2.83 5.81zM11.91 5.92c-.01-2.43 2.11-4.5 4.3-4.51.13 2.59-2.03 4.51-4.3 4.51z" />
            </svg>
            <span className="text-[10px] font-bold uppercase tracking-tighter">Apple ID</span>
          </button>
        </div>

        <p className="text-center text-[10px] text-gray-400 mt-8 leading-relaxed uppercase tracking-widest">
          Verified by <span className="font-bold text-gray-600">Gammal Tech Passport</span>
        </p>
      </div>

      <p className="text-center text-xs text-gray-400 mt-10">
        ليس لديك حساب؟ <a href="https://my.gammal.tech" target="_blank" className="text-[#BFA37E] font-bold hover:underline">سجل الآن في جمال تك</a>
      </p>
    </div>
  );
};

export default LoginPage;