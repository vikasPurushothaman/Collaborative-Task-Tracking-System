import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';

export default function OtpVerificationPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const handleChange = (val, i) => {
    if (!/^\d?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKey = (e, i) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    setOtp([...pasted, ...Array(6 - pasted.length).fill('')]);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async () => {
    const code = otp.join('');
    if (code.length < 6) return toast.error('Enter the 6-digit code');
    setLoading(true);
    try {
      await authService.verifyOtp(code);
      toast.success('OTP verified!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-brand-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">🔐</span>
      </div>
      <h2 className="text-xl font-bold text-white mb-1">Verify your identity</h2>
      <p className="text-brand-300 text-sm mb-6">Enter the 6-digit code sent to your email. <br /><span className="text-white/50 text-xs">(Use 123456 for demo)</span></p>

      <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => inputs.current[i] = el}
            value={digit}
            onChange={e => handleChange(e.target.value, i)}
            onKeyDown={e => handleKey(e, i)}
            maxLength={1}
            className="w-11 h-12 text-center text-xl font-bold bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-all"
            id={`otp-${i}`}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        id="otp-submit-btn"
        className="w-full py-2.5 bg-brand-500 hover:bg-brand-400 text-white font-medium rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verify Code'}
      </button>

      <button className="mt-4 text-sm text-brand-300 hover:text-white transition-colors">
        Resend code
      </button>
    </div>
  );
}
