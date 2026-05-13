import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, User, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const AIChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'مرحباً! أنا مساعدك الصحي الذكي. كيف يمكنني مساعدتك اليوم؟' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      if (window.GammalTech && window.GammalTech.ai) {
        let response = '';
        const systemPrompt = `You are a professional medical assistant for "VIP Healthcare" app. 
        - Be empathetic, professional, and helpful.
        - Answer health-related questions.
        - Encourage users to book with doctors if the case sounds serious.
        - If the user asks about their name, use: ${user?.name || 'User'}.
        - Always respond in Arabic.`;

        const token = window.GammalTech.getToken();
        if (window.GammalTech.isLoggedIn() && token) {
          console.log("Using AI Chat with token...");
          response = await window.GammalTech.ai.chat(token, userMessage, { system: systemPrompt });
        } else {
          console.log("Using AI Ask (Guest mode)...");
          response = await window.GammalTech.ai.ask(userMessage, { system: systemPrompt });
        }
        
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      } else {
        console.warn("GammalTech SDK or AI module not found.");
      }
    } catch (error) {
      console.error("Gammal Tech AI Error Details:", error);
      const errorMsg = error.message || 'حدث خطأ أثناء التواصل مع الذكاء الاصطناعي. يرجى المحاولة لاحقاً.';
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (window.GammalTech && window.GammalTech.isLoggedIn()) {
      const token = window.GammalTech.getToken();
      await window.GammalTech.ai.chat(token, '', { reset: true });
    }
    setMessages([{ role: 'assistant', content: 'تم بدء محادثة جديدة. كيف يمكنني مساعدتك؟' }]);
  };

  return (
    <div className="fixed bottom-24 left-6 md:bottom-10 md:left-10 z-[60]" dir="rtl">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white w-[350px] md:w-[400px] h-[500px] rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-vipNavy p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-vipGoldDark/20 rounded-full flex items-center justify-center">
                  <Bot className="text-vipGoldDark w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">مساعد VIP الذكي</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-gray-400 text-[10px]">متصل الآن</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleReset} className="text-gray-400 hover:text-white transition-colors" title="إعادة تعيين المحادثة">
                  <RefreshCcw className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/30">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex gap-2 max-w-[85%] ${m.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-vipNavy' : 'bg-vipGoldDark'}`}>
                      {m.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4 text-white" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm shadow-sm ${m.role === 'user' ? 'bg-white text-vipNavy border border-gray-100 rounded-tr-none' : 'bg-vipNavy text-white rounded-tl-none'}`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-end">
                  <div className="flex gap-2 items-center bg-gray-100 px-4 py-2 rounded-2xl">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                    <span className="text-[10px] text-gray-500 font-bold">جاري التفكير...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-50 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اسألني أي شيء عن صحتك..."
                className="flex-grow bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:border-vipGoldDark transition-all"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-vipNavy text-white p-2 rounded-xl hover:bg-opacity-95 transition-all shadow-md disabled:bg-gray-300"
              >
                <Send className="w-5 h-5 transform rotate-180" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 ${isOpen ? 'bg-red-500' : 'bg-vipNavy'}`}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageSquare className="w-8 h-8 text-vipGoldDark" />}
      </motion.button>
    </div>
  );
};

export default AIChatBot;
