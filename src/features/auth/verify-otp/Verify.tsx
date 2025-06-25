import { useState, useRef, useEffect } from 'react';
import { ArrowRight, Shield } from 'lucide-react';

// Define the component as a functional component with React.FC
const PremiumOTPVerification: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    const isOtpComplete = otp.every(digit => digit !== '');
    setIsComplete(isOtpComplete);
  }, [otp]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^[0-9]$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
        setFocusedIndex(index - 1);
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    } else if (e.key === 'Enter' && isComplete) {
      handleSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numbers = pastedData.replace(/\D/g, '').slice(0, 6);

    if (numbers.length > 0) {
      const newOtp = [...otp];
      for (let i = 0; i < numbers.length && i < 6; i++) {
        newOtp[i] = numbers[i];
      }
      setOtp(newOtp);

      const nextIndex = Math.min(numbers.length, 5);
      inputRefs.current[nextIndex]?.focus();
      setFocusedIndex(nextIndex);
    }
  };

  const handleSubmit = () => {

  };

  const handleResendOTP = () => {
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Premium container */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl shadow-gray-200/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h1>
            <p className="text-gray-600 text-sm">
              Enter the 6-digit code sent to your phone
            </p>
          </div>

          {/* OTP Input Container */}
          <div className="space-y-6">
            {/* OTP Boxes */}
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el as HTMLInputElement;
                  }}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => setFocusedIndex(index)}
                  onPaste={handlePaste}
                  className={`
                    w-12 h-14 text-center text-xl font-bold rounded-xl border-2 transition-all duration-300 ease-out
                    ${focusedIndex === index 
                      ? 'border-gray-900 bg-white shadow-lg transform scale-105' 
                      : digit 
                        ? 'border-gray-400 bg-gray-50' 
                        : 'border-gray-200 bg-gray-50'
                    }
                    hover:border-gray-400 focus:outline-none focus:border-gray-900 focus:bg-white focus:shadow-lg
                    ${digit ? 'text-gray-900' : 'text-gray-400'}
                  `}
                  maxLength={1}
                />
              ))}
            </div>

            {/* Helper text */}
            <p className="text-xs text-gray-500 text-center">
              Didn't receive the code?{' '}
              <button 
                onClick={handleResendOTP}
                className="text-gray-900 hover:text-gray-700 font-medium transition-colors"
              >
                Resend OTP
              </button>
            </p>

            {/* Verify Button */}
            <button
              onClick={handleSubmit}
              disabled={!isComplete}
              className={`
                w-full relative overflow-hidden rounded-2xl py-4 px-6 font-semibold text-lg transition-all duration-300 ease-out transform
                ${isComplete 
                  ? 'bg-[#FFA500] text-white shadow-lg hover:shadow-xl hover:bg-[#FFA500] hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Verify OTP</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>

          {/* Bottom text */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Keep this code secure and don't share it with anyone
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumOTPVerification;