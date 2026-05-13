import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Activity, Bell, FileText, Settings, Shield,
  LogOut, Star, ChevronLeft, Heart, Flame, Droplet,
  Moon, Calendar, ChevronRight, Info
} from 'lucide-react';
import { mockUser } from '../data/mockData';
import Spinner from '../components/Spinner';

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(mockUser);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);
  const [sectionData, setSectionData] = useState({});

  const fetchUserData = async () => {
    const isDemo = localStorage.getItem('is_demo_login') === 'true';
    const isGTLoggedIn = window.GammalTech && window.GammalTech.isLoggedIn();

    if (isGTLoggedIn) {
      try {
        const data = await window.GammalTech.user.get();
        setUserData({ ...mockUser, ...data });
        setNewName(data.name || mockUser.name);
        setSectionData(data); // Store everything for easy access
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    setLoading(false);
  };

  const handleSaveSection = async (key, value) => {
    const isGTLoggedIn = window.GammalTech && window.GammalTech.isLoggedIn();

    const updatedData = { ...sectionData, [key]: value };
    
    if (isGTLoggedIn) {
      try {
        await window.GammalTech.user.save(updatedData);
        setUserData({ ...mockUser, ...updatedData });
        setSectionData(updatedData);
        setActiveSection(null);
      } catch (error) {
        console.error("Error saving section data:", error);
      }
    }
  };

  useEffect(() => {
    const isDemo = localStorage.getItem('is_demo_login') === 'true';
    const isGTLoggedIn = window.GammalTech && window.GammalTech.isLoggedIn();

    if (!isGTLoggedIn && !isDemo) {
      navigate('/login');
      return;
    }

    fetchUserData();
  }, [navigate]);

  // دالة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('is_demo_login');
    localStorage.removeItem('demo_user_email');
    localStorage.removeItem('demo_user_data');
    if (window.GammalTech) {
      window.GammalTech.logout();
    }
    navigate('/login');
  };

  if (loading) return <Spinner text="جاري تحميل ملفك الشخصي..." />;

  const settingsLinks = [
    { id: 'personal', icon: <User className="w-5 h-5" />, title: "المعلومات الشخصية", fields: [{label: 'الاسم الكامل', key: 'name'}, {label: 'رقم الهاتف', key: 'phone'}, {label: 'العنوان', key: 'address'}] },
    { id: 'goals', icon: <Activity className="w-5 h-5" />, title: "الأهداف الصحية", fields: [{label: 'الوزن المستهدف', key: 'targetWeight'}, {label: 'السعرات اليومية', key: 'dailyCalories'}] },
    { id: 'privacy', icon: <Shield className="w-5 h-5" />, title: "الخصوصية والأمان", fields: [{label: 'مشاركة البيانات مع الأطباء', key: 'shareWithDoctors', type: 'checkbox'}] },
    { id: 'notifications', icon: <Bell className="w-5 h-5" />, title: "الإشعارات", fields: [{label: 'تنبيهات المواعيد', key: 'apptNotifications', type: 'checkbox'}] },
    { id: 'medical', icon: <FileText className="w-5 h-5" />, title: "السجلات الطبية", fields: [{label: 'فصيلة الدم', key: 'bloodType'}, {label: 'الحساسية', key: 'allergies'}] },
    { id: 'app', icon: <Settings className="w-5 h-5" />, title: "إعدادات التطبيق", fields: [{label: 'اللغة', key: 'language'}, {label: 'الوضع الداكن', key: 'darkMode', type: 'checkbox'}] },
  ];

  if (activeSection) {
    const section = settingsLinks.find(s => s.id === activeSection);
    return (
      <div className="font-sans text-vipNavy pb-24 pt-20">
        <div className="container mx-auto px-6 max-w-lg">
          <button onClick={() => setActiveSection(null)} className="flex items-center gap-2 text-gray-400 mb-8 hover:text-vipNavy transition-colors">
            <ChevronRight className="w-5 h-5" />
            <span>العودة للملف الشخصي</span>
          </button>
          
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-vipGoldDark/10 text-vipGoldDark rounded-2xl">
                {section.icon}
              </div>
              <h2 className="text-2xl font-bold">{section.title}</h2>
            </div>

            <div className="space-y-6">
              {section.fields.map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">{field.label}</label>
                  {field.type === 'checkbox' ? (
                    <input 
                      type="checkbox" 
                      defaultChecked={sectionData[field.key]} 
                      onChange={(e) => setSectionData({...sectionData, [field.key]: e.target.checked})}
                      className="w-5 h-5 accent-vipGoldDark"
                    />
                  ) : (
                    <input 
                      type="text" 
                      defaultValue={sectionData[field.key] || ''} 
                      onChange={(e) => setSectionData({...sectionData, [field.key]: e.target.value})}
                      className="w-full px-5 py-3 rounded-xl border border-gray-100 bg-gray-50/50 outline-none focus:border-vipGoldDark transition-all"
                    />
                  )}
                </div>
              ))}
              <button 
                onClick={() => handleSaveSection(activeSection, sectionData)}
                className="w-full bg-vipNavy text-white py-4 rounded-2xl font-bold mt-8 hover:bg-opacity-95 transition-all shadow-lg"
              >
                حفظ التغييرات
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="font-sans text-vipNavy pb-24 pt-20">
      <div className="container mx-auto px-6 max-w-lg">

        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-[#D4B892] rounded-3xl flex items-center justify-center text-4xl font-bold text-white mb-4 shadow-xl">
            {userData.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          
          {isEditing ? (
            <div className="flex flex-col items-center gap-2 mb-4">
              <input 
                type="text" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)}
                className="text-xl font-bold text-center border-b-2 border-vipGoldDark outline-none bg-transparent px-2"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={handleSaveName} className="text-xs bg-vipGoldDark text-white px-3 py-1 rounded-full font-bold">حفظ</button>
                <button onClick={() => setIsEditing(false)} className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-bold">إلغاء</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-1 group cursor-pointer" onClick={() => setIsEditing(true)}>
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              <Settings className="w-4 h-4 text-gray-300 group-hover:text-vipGoldDark transition-colors" />
            </div>
          )}

          <span className="bg-vipGoldDark/10 text-vipGoldDark text-xs font-bold px-3 py-1 rounded-full border border-vipGoldDark/20 mb-6">
            {userData.memberType || "VIP Member"}
          </span>

          <div className="w-full bg-vipNavy text-white rounded-2xl p-4 flex justify-between items-center shadow-lg mb-8">
            <div>
              <h4 className="font-bold flex items-center gap-2">
                <Star className="w-4 h-4 text-vipGoldDark fill-vipGoldDark" />
                باقة الـ VIP: نشطة
              </h4>
              <p className="text-xs text-gray-400">صالحة حتى {userData.planExpiry}</p>
            </div>
            <button className="bg-vipGoldDark text-vipNavy px-4 py-2 rounded-lg text-xs font-bold hover:bg-opacity-90 transition">إدارة</button>
          </div>
        </div>

        {/* Settings Links */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <h2 className="px-5 pt-5 pb-2 text-lg font-bold text-right">إعدادات الحساب</h2>
          <div className="divide-y divide-gray-50">
            {settingsLinks.map((link) => (
              <button 
                key={link.title} 
                onClick={() => setActiveSection(link.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition text-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className="text-gray-400">{link.icon}</div>
                  <span className="font-semibold text-sm">{link.title}</span>
                </div>
                <ChevronLeft className="w-5 h-5 text-gray-300" />
              </button>
            ))}
          </div>
        </div>

        {/* Logout Button Footer */}
        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 text-red-600 px-8 py-3 rounded-2xl text-sm font-bold hover:bg-red-100 transition-colors border border-red-100 shadow-sm"
          >
            <span>تسجيل الخروج</span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;