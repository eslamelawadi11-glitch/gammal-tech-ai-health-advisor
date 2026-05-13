import React, { useState, useEffect } from 'react';
import { Heart, Flame, Droplet, Moon, Calendar, ChevronRight, Info, User, LogOut } from 'lucide-react'; // ضفنا LogOut هنا بس
import { Link, useNavigate } from 'react-router-dom'; // ضفنا useNavigate هنا
import { motion } from 'framer-motion';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import InsightCard from '../components/InsightCard';
import Spinner from '../components/Spinner';
import { mockUser, mockStats, mockInsights, mockAppointments } from '../data/mockData';
import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // دالة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('is_demo_login');
    localStorage.removeItem('demo_user_email');
    logout();
  };

  useEffect(() => {
    const isGTLoggedIn = window.GammalTech && window.GammalTech.isLoggedIn();

    // حماية الصفحة: لو مش مسجل دخول ارجع للوجن
    if (!isGTLoggedIn) {
      navigate('/login');
      return;
    }

    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [navigate, user]);

  if (loading) return <Spinner text="جاري تحديث بياناتك الصحّية..." />;

  const { heartRate, calories, water, sleep } = mockStats;

  return (
    <div className="font-sans text-vipNavy pb-24 md:pb-12 pt-20 md:pt-10">
      <div className="container mx-auto px-6 max-w-4xl">

        {/* Header - تم تعديله ليحتوي على زر الخروج */}
        <header className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">مساء الخير، {(user?.name || mockUser.name).split(' ')[0]}</h1>
            <p className="text-gray-500">إليك ملخص صحتك اليوم</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors border border-red-100 shadow-sm"
          >
            <span>خروج</span>
            <LogOut className="w-4 h-4" />
          </button>
        </header>

        {/* Daily Health Score */}
        <section className="bg-vipNavy text-white rounded-3xl p-6 mb-8 shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-vipGoldDark/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-vipGoldDark/30 transition-all duration-700"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-gray-300 flex items-center gap-2">
                مؤشر الصحة اليومي
                <div title="يعتمد التقييم على استقرار العلامات الحيوية الأخيرة" className="cursor-help text-gray-400 hover:text-vipGoldDark transition-colors">
                  <Info className="w-4 h-4" />
                </div>
              </span>
              <span className="bg-vipGoldDark/20 text-vipGoldDark text-xs font-bold px-3 py-1 rounded-full border border-vipGoldDark/30">ممتاز</span>
            </div>
            <div className="flex items-baseline gap-2 mb-6 text-left" dir="ltr">
              <span className="text-6xl font-black text-vipGoldDark">{mockUser.healthScore}</span>
              <span className="text-2xl text-gray-400">/100</span>
            </div>

            <ProgressBar percentage={mockUser.healthScore} />

            <div className="flex justify-between text-xs text-gray-400">
              <span>جميع المؤشرات الحيوية طبيعية</span>
              <span>مُحدث منذ 5 دقائق</span>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">إحصائيات سريعة</h2>
            <Link to="#" className="text-vipGoldDark text-sm font-semibold hover:underline">عرض الكل</Link>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><StatCard icon={Heart} colorClass="text-vipNavy fill-vipNavy" value={heartRate.value} unit={heartRate.unit} label={heartRate.label} /></motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><StatCard icon={Flame} colorClass="text-orange-500 fill-orange-500" value={calories.value} unit={calories.unit} label={calories.label} /></motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><StatCard icon={Droplet} colorClass="text-blue-400 fill-blue-400" value={water.value} unit={water.unit} label={water.label} /></motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><StatCard icon={Moon} colorClass="text-purple-400 fill-purple-400" value={sleep.value} unit={sleep.unit} label={sleep.label} /></motion.div>
          </motion.div>
        </section>

        {/* باقي الكود (Insights & Appointments) كما هو تماماً */}
        <section className="mb-10">
          <h2 className="text-lg font-bold mb-4">رؤى التحليل</h2>
          <div className="space-y-3">
            {mockInsights.map((insight) => (
              <InsightCard key={insight.id} {...insight} />
            ))}
          </div>
        </section>

        <section className="mb-4">
          <h2 className="text-lg font-bold mb-4">المواعيد القادمة</h2>
          {(user?.bookings || []).length > 0 ? (
            user.bookings.map((apt, index) => (
              <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-3">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-vipGoldDark/10 rounded-full flex items-center justify-center text-xl overflow-hidden">
                      <User className="text-vipGoldDark w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{apt.docName}</h4>
                      <p className="text-xs text-gray-500">{apt.specialty}</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-md font-bold">مؤكد</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span dir="ltr">{apt.date}</span>
                  </div>
                  <div className="text-[10px] text-gray-400">ID: {apt.paymentId.slice(-6)}</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 text-sm">لا توجد مواعيد محجوزة بعد.</p>
              <Link to="/doctors" className="text-vipGoldDark text-xs font-bold mt-2 inline-block">احجز أول موعد الآن</Link>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default DashboardPage;