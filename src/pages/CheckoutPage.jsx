import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { CreditCard, Wallet, CheckCircle2, ShoppingCart, ShieldCheck } from 'lucide-react';

const CheckoutPage = () => {
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const product = {
    name: 'Gammal Tech Premium Subscription',
    description: 'Full access to all courses, projects, and mentorship programs for 1 year.',
    priceEGP: 5000,
    priceUSD: 100,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };

  const handleOnDeliver = async (payment) => {
    console.log('Delivery started for:', payment.id, 'User:', payment.user_id);
    
    try {
      // Simulate backend call to save transaction
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: payment.id,
          userId: payment.user_id,
          product: product.name,
          amount: payment.amount,
          currency: payment.currency
        })
      }).catch(err => {
        console.warn('Backend simulation: Fetch failed, proceeding with delivery confirmation.');
        return { ok: true }; // Proceed anyway for the demo
      });

      // CRITICAL: Confirm delivery to mark transaction complete
      if (window.GammalTech && window.GammalTech.payment) {
        await window.GammalTech.payment.confirmDelivery(payment.id);
        setTransactionId(payment.id);
        setIsSuccess(true);
        toast.success('Payment confirmed and product delivered!');
      }
    } catch (error) {
      console.error('Error during delivery confirmation:', error);
      toast.error('Delivery confirmation failed. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const checkLogin = () => {
    if (window.GammalTech && !window.GammalTech.isLoggedIn()) {
      toast.error('Please login to proceed');
      window.GammalTech.login();
      return false;
    }
    return true;
  };

  const handleWalletPayment = async () => {
    if (!checkLogin()) return;
    setLoading(true);
    
    try {
      if (window.GammalTech) {
        window.GammalTech.pay(
          product.priceEGP,
          `Purchase of ${product.name}`,
          handleOnDeliver
        );
      }
    } catch (error) {
      setLoading(false);
      handleErrors(error, 'wallet');
    }
  };

  const handleCardPayment = async () => {
    if (!checkLogin()) return;
    setLoading(true);
    
    try {
      if (window.GammalTech) {
        window.GammalTech.payCard(
          product.priceUSD,
          'USD',
          `Purchase of ${product.name}`,
          handleOnDeliver
        );
      }
    } catch (error) {
      setLoading(false);
      handleErrors(error, 'card');
    }
  };

  const handleErrors = (error, type) => {
    const code = error.code || error.message;
    console.error(`Payment error (${type}):`, code);

    const walletErrors = {
      'INSUFFICIENT_BALANCE': 'Your wallet balance is not enough for this transaction.',
      'USER_CANCELLED': 'Payment cancelled by user.',
      'NOT_LOGGED_IN': 'You must be logged in to pay with your wallet.'
    };

    const cardErrors = {
      'CARD_DECLINED': 'Your card was declined. Please check with your bank.',
      'INSUFFICIENT_FUNDS': 'Insufficient funds on your card.',
      '3DS_FAILED': 'Security verification failed. Please try again.',
      'USER_CANCELLED': 'Payment cancelled by user.'
    };

    const message = type === 'wallet' ? walletErrors[code] : cardErrors[code];
    toast.error(message || `An error occurred during ${type} payment.`);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCF9] px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border border-[#E8E1D2]"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">Thank you for your purchase. Your premium access is now active.</p>
          <div className="bg-[#F8F5F0] rounded-xl p-4 mb-8 text-left">
            <p className="text-sm text-gray-500 mb-1">Transaction ID</p>
            <p className="font-mono text-sm text-gray-800 break-all">{transactionId}</p>
          </div>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-[#1A1A1A] text-white py-4 rounded-xl font-bold hover:bg-black transition-colors"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCF9] pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Product Section */}
          <div className="flex-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#E8E1D2]"
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full font-bold shadow-sm">
                  ★ Premium
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 text-primary-600 mb-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Checkout</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <p className="text-gray-600 leading-relaxed mb-8">
                  {product.description}
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[#F8F5F0] rounded-2xl">
                    <span className="text-gray-600 font-medium">Wallet Price</span>
                    <span className="text-2xl font-bold text-gray-900">{product.priceEGP} EGP</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[#F8F5F0] rounded-2xl">
                    <span className="text-gray-600 font-medium">Card Price</span>
                    <span className="text-2xl font-bold text-gray-900">${product.priceUSD}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Payment Section */}
          <div className="w-full md:w-[400px]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-xl p-8 border border-[#E8E1D2] sticky top-28"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Methods</h3>
              
              <div className="space-y-4 mb-8">
                <button 
                  onClick={handleWalletPayment}
                  disabled={loading}
                  className="w-full group relative overflow-hidden bg-primary-600 text-white p-5 rounded-2xl font-bold hover:bg-primary-700 transition-all disabled:opacity-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <span>Gammal Tech Wallet</span>
                  </div>
                  <span className="text-sm bg-white/20 px-2 py-1 rounded">EGP</span>
                </button>

                <button 
                  onClick={handleCardPayment}
                  disabled={loading}
                  className="w-full group relative overflow-hidden bg-gray-900 text-white p-5 rounded-2xl font-bold hover:bg-black transition-all disabled:opacity-50 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <span>International Card</span>
                  </div>
                  <span className="text-sm bg-white/10 px-2 py-1 rounded">USD</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-500 text-sm">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span>Secure 256-bit SSL encrypted payment</span>
                </div>
                <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest">
                  Powered by Gammal Tech Web SDK v3.0.1
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
