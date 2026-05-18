import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import Spinner from '../components/Spinner';

const HealthAdvisorPage = () => {
  const navigate = useNavigate();

  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [meals, setMeals] = useState('');
  const [activity, setActivity] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (window.GammalTech && !window.GammalTech.isLoggedIn()) {
      navigate('/login');
    }
  }, [navigate]);

  const bmiInfo = useMemo(() => {
    if (!height || !weight) return '';
    const heightInMeters = Number(height) / 100;
    if (!heightInMeters) return '';
    const bmi = (Number(weight) / (heightInMeters * heightInMeters)).toFixed(1);
    if (!Number.isFinite(Number(bmi))) return '';
    return `مؤشر كتلة الجسم (BMI): ${bmi}`;
  }, [height, weight]);

  const prompt = useMemo(() => {
    return `أنت استشاري صحي متخصص. قم بتحليل البيانات التالية وقدم تقييماً للمخاطر الصحية:

📋 بيانات المريض:
- العمر: ${age} سنة
- الوزن: ${weight} كجم
- الطول: ${height || 'غير محدد'} سم
${bmiInfo}
- مستوى النشاط: ${activity}

🩺 الأعراض:
${symptoms}

🍽️ الوجبات الأخيرة:
${meals || 'غير محددة'}

📝 التاريخ الطبي:
${medicalHistory || 'لا يوجد'}

المطلوب:
1. تقييم مستوى المخاطر الصحية (منخفض/متوسط/عالي)
2. تحليل الأعراض وربطها بالحالة العامة
3. توصيات غذائية ونمط حياة
4. متى يجب زيارة الطبيب
5. نصائح وقائية

⚠️ تذكير هام: اذكر بوضوح أن هذا تقييم استشاري فقط وليس تشخيصاً طبياً نهائياً.

قدم الإجابة بطريقة منظمة وواضحة باللغة العربية.`;
  }, [activity, age, bmiInfo, height, meals, medicalHistory, symptoms, weight]);

  const reset = () => {
    setAge('');
    setWeight('');
    setHeight('');
    setSymptoms('');
    setMeals('');
    setActivity('');
    setMedicalHistory('');
    setSubmitting(false);
    setResult('');
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult('');

    if (!window.GammalTech?.ai?.ask) {
      setError('فشل تحميل Gammal Tech SDK. تأكد من الاتصال بالإنترنت.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await window.GammalTech.ai.ask(prompt, { maxTokens: 2000 });
      setResult(String(response || ''));
    } catch (err) {
      setError(err?.message ? String(err.message) : 'حدث خطأ أثناء التحليل. حاول مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) return <Spinner text="جاري تحليل بياناتك بواسطة الذكاء الاصطناعي..." />;

  return (
    <div className="font-sans text-vipNavy pb-24 md:pb-12 pt-20 md:pt-10">
      <div className="container mx-auto px-6 max-w-4xl">
        <header className="mb-6">
          <div className="bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white rounded-3xl p-7 shadow-md overflow-hidden relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-black">مستشار صحي ذكي</h1>
              </div>
              <p className="text-white/90 font-semibold">تقييم صحي مدعوم بالذكاء الاصطناعي</p>
            </div>
          </div>
        </header>

        <div className="bg-[#fff3cd] border-2 border-[#ffc107] rounded-2xl p-5 mb-6 text-center">
          <h2 className="text-[#856404] text-lg font-black mb-2">تنويه هام جداً</h2>
          <p className="text-[#856404] font-bold mb-1">أنا لست طبيباً!</p>
          <p className="text-[#856404] leading-7 font-semibold">
            هذا التقييم يقدم معلومات صحية عامة فقط. استشر طبيباً مختصاً دائماً قبل اتخاذ أي قرارات صحية.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4 mb-6 font-semibold">
            {error}
          </div>
        )}

        {result ? (
          <section className="bg-gray-50 rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <h2 className="text-2xl font-black text-[#667eea] mb-5">نتيجة التقييم الصحي</h2>
            <div className="bg-white rounded-2xl p-5 border-r-4 border-[#667eea] shadow-sm">
              <p className="whitespace-pre-wrap leading-8 text-gray-700 font-semibold">{result}</p>
            </div>
            <button
              type="button"
              onClick={reset}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 transition-colors text-white font-black py-3.5 rounded-2xl"
            >
              تحليل جديد
            </button>
          </section>
        ) : (
          <section className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
            <form onSubmit={onSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 font-bold text-gray-700" htmlFor="age">العمر (Age) *</label>
                <input
                  id="age"
                  type="number"
                  required
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="مثال: 35"
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-vipGoldDark/40"
                />
              </div>

              <div>
                <label className="block mb-2 font-bold text-gray-700" htmlFor="weight">الوزن بالكيلوجرام (Weight in kg) *</label>
                <input
                  id="weight"
                  type="number"
                  required
                  min={20}
                  max={300}
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="مثال: 75"
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-vipGoldDark/40"
                />
              </div>

              <div>
                <label className="block mb-2 font-bold text-gray-700" htmlFor="height">الطول بالسنتيمتر (Height in cm)</label>
                <input
                  id="height"
                  type="number"
                  min={100}
                  max={250}
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="مثال: 170 (اختياري)"
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-vipGoldDark/40"
                />
                {bmiInfo && <p className="mt-2 text-xs font-bold text-gray-500">{bmiInfo}</p>}
              </div>

              <div>
                <label className="block mb-2 font-bold text-gray-700" htmlFor="symptoms">الأعراض (Symptoms) *</label>
                <textarea
                  id="symptoms"
                  required
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder={`صف الأعراض التي تشعر بها...\nمثال: صداع، حمى، سعال، إرهاق`}
                  className="w-full min-h-[120px] bg-white border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-vipGoldDark/40 resize-y"
                />
              </div>

              <div>
                <label className="block mb-2 font-bold text-gray-700" htmlFor="meals">الوجبات الأخيرة (Recent Meals)</label>
                <textarea
                  id="meals"
                  value={meals}
                  onChange={(e) => setMeals(e.target.value)}
                  placeholder={`اذكر آخر وجباتك...\nمثال: فطور: بيض وخبز، غداء: أرز ودجاج`}
                  className="w-full min-h-[100px] bg-white border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-vipGoldDark/40 resize-y"
                />
              </div>

              <div>
                <label className="block mb-2 font-bold text-gray-700" htmlFor="activity">مستوى النشاط البدني (Activity Level) *</label>
                <select
                  id="activity"
                  required
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-vipGoldDark/40"
                >
                  <option value="">-- اختر مستوى النشاط --</option>
                  <option value="sedentary">قليل جداً (Sedentary) - لا توجد رياضة</option>
                  <option value="light">خفيف (Light) - رياضة 1-3 أيام/أسبوع</option>
                  <option value="moderate">متوسط (Moderate) - رياضة 3-5 أيام/أسبوع</option>
                  <option value="active">نشيط (Active) - رياضة 6-7 أيام/أسبوع</option>
                  <option value="very_active">نشيط جداً (Very Active) - رياضة مكثفة يومياً</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-bold text-gray-700" htmlFor="medical_history">التاريخ الطبي (Medical History)</label>
                <textarea
                  id="medical_history"
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  placeholder={`أي أمراض مزمنة أو أدوية تتناولها...\nمثال: ضغط دم، سكري، حساسية`}
                  className="w-full min-h-[100px] bg-white border border-gray-200 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-vipGoldDark/40 resize-y"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-br from-[#667eea] to-[#764ba2] hover:shadow-lg transition-shadow text-white font-black py-4 rounded-2xl"
              >
                تحليل الحالة الصحية
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default HealthAdvisorPage;

