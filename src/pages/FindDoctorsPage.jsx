import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import DoctorCard from '../components/DoctorCard';
import Spinner from '../components/Spinner';
import { mockDoctors } from '../data/mockData';

const FindDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCat, setActiveCat] = useState('الكل');
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    const isGTLoggedIn = window.GammalTech && window.GammalTech.isLoggedIn();

    if (isGTLoggedIn) {
      try {
        const data = await window.GammalTech.user.get();
        if (!data.doctors) {
          // Seed initial doctors if empty
          const initialDoctors = mockDoctors;
          await window.GammalTech.user.save({ ...data, doctors: initialDoctors });
          setDoctors(initialDoctors);
        } else {
          setDoctors(data.doctors);
        }
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors(mockDoctors);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const categories = ["الكل", "القلب", "التغذية", "الأسنان", "الأعصاب", "الباطنة", "العيون"];
  
  const handleBook = async (doctor) => {
    if (window.GammalTech && !window.GammalTech.isLoggedIn() && localStorage.getItem('is_demo_login') !== 'true') {
      toast.error('يرجى تسجيل الدخول أولاً');
      window.GammalTech.login();
      return;
    }

    setLoading(true);
    try {
      if (window.GammalTech) {
        window.GammalTech.pay(100, `حجز موعد مع ${doctor.name}`, async (payment) => {
          // ON DELIVER CALLBACK
          console.log('Payment ID:', payment.id);
          
          const data = await window.GammalTech.user.get();
          const newBooking = {
            docName: doctor.name,
            specialty: doctor.specialty,
            date: new Date().toLocaleDateString('ar-EG'),
            paymentId: payment.id
          };
          
          data.bookings = [...(data.bookings || []), newBooking];
          await window.GammalTech.user.save(data);
          
          // Confirm Delivery
          await window.GammalTech.payment.confirmDelivery(payment.id);
          
          toast.success(`تم حجز الموعد مع ${doctor.name} بنجاح!`);
          setLoading(false);
        });
      }
    } catch (error) {
      setLoading(false);
      if (error.code === 'INSUFFICIENT_BALANCE') {
        toast.error('رصيد المحفظة غير كافٍ');
      } else {
        toast.error('حدث خطأ أثناء الدفع');
      }
    }
  };

  const filteredDoctors = doctors.filter(doc => {
    const matchSearch = doc.name.includes(searchTerm) || doc.specialty.includes(searchTerm);
    const matchCat = activeCat === 'الكل' || doc.specialty.includes(activeCat);
    return matchSearch && matchCat;
  });

  const recommendedDoctor = filteredDoctors.find(d => d.recommended);
  const otherDoctors = filteredDoctors.filter(d => !d.recommended);

  return (
    <div className="font-sans text-vipNavy pb-24 md:pb-12 pt-20 md:pt-10">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Header & Search */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold mb-4">البحث عن أخصائي</h1>
          <div className="flex gap-2">
            <div className="flex-grow relative">
              <Search className="w-5 h-5 absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن أطباء، أو تخصصات..." 
                className="w-full bg-white border border-gray-200 rounded-xl py-3 pr-11 pl-4 focus:outline-none focus:ring-2 focus:ring-vipGoldDark/50 shadow-sm transition-all"
              />
            </div>
            <button className="bg-vipGoldDark text-white p-3 rounded-xl shadow-sm hover:bg-opacity-90 transition-colors flex-shrink-0 flex items-center justify-center w-12 h-12">
              <Filter className="w-5 h-5 fill-white" />
            </button>
          </div>
        </header>

        {/* Categories */}
        <div className="flex overflow-x-auto gap-3 pb-4 mb-4 scrollbar-hide -mx-6 px-6" style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button 
              key={cat} 
              onClick={() => setActiveCat(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${activeCat === cat ? 'bg-vipNavy text-white shadow-md' : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <Spinner text={`جاري تحديث القائمة...`} />
        ) : (
          <>
            {/* AI Recommended */}
            {recommendedDoctor && activeCat === 'الكل' && searchTerm === '' && (
              <section className="mb-8 relative z-0">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-[#FAF7F2] border-2 border-[#EBE3D5] rounded-3xl p-6 shadow-md relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-vipGoldDark/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-vipGoldDark/20 transition-all"></div>
                  
                  <div className="flex items-center justify-between mb-5 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Sparkles className="w-5 h-5 text-vipGoldDark relative z-10" />
                        <span className="absolute inset-0 bg-vipGoldDark rounded-full animate-ping opacity-30"></span>
                      </div>
                      <span className="font-bold text-vipNavy text-sm">مرشح خصيصاً لك (AI)</span>
                    </div>
                    <span className="bg-vipGoldDark/20 text-vipGoldDark text-xs font-bold px-3 py-1 rounded-full border border-vipGoldDark/30">
                      تطابق {recommendedDoctor.matchScore}
                    </span>
                  </div>

                  <div className="bg-white rounded-2xl p-5 shadow-sm border border-white/50 relative z-10">
                    <div className="flex gap-4">
                      <div className={`w-16 h-16 ${recommendedDoctor.bgTheme} rounded-2xl flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-inner`}>
                        {recommendedDoctor.name.split(' ').map(n=>n[0]).slice(1,3).join('')}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-bold text-lg mb-1">{recommendedDoctor.name}</h4>
                        <p className="text-sm text-gray-500 mb-2">{recommendedDoctor.specialty}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Star className="w-3 h-3 text-vipGoldDark fill-vipGoldDark" />
                          <span className="font-bold text-gray-700 mx-1">{recommendedDoctor.rating}</span>
                          <span>• {recommendedDoctor.experience} سنة خبرة</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 bg-gray-50 p-3 rounded-xl text-xs text-gray-500 mb-4 border border-gray-100">
                      {recommendedDoctor.reason}
                    </div>

                    <Button variant="gold" className="w-full py-3 text-sm" onClick={() => handleBook(recommendedDoctor)}>
                      حجز موعد (100 EGP)
                    </Button>
                  </div>
                </motion.div>
              </section>
            )}

            {/* Available Specialists */}
            <section>
              <h2 className="text-lg font-bold mb-4">الأخصائيين المتاحين</h2>
              <div className="space-y-4">
                {otherDoctors.length > 0 ? otherDoctors.map((doc) => (
                  <DoctorCard key={doc.id} doctor={doc} onBook={() => handleBook(doc)} />
                )) : (
                  <div className="text-center text-gray-500 py-10 border border-dashed rounded-xl border-gray-300">
                    لا يوجد أطباء متاحين بهذا البحث.
                  </div>
                )}
              </div>
            </section>
          </>
        )}

      </div>
    </div>
  );
};

export default FindDoctorsPage;
