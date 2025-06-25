/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useState } from 'react';
import { Phone, ArrowRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router'
export default function PremiumPhoneInput() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isFocused, setIsFocused] = useState(false);
const navigate  = useNavigate()


  const handleSubmit = () => {
    if (phoneNumber.trim()) {
      // Handle form submission here
      navigate({ to: '/verify' })
      

    }
  };

  const handleInputChange = (e:any) => {
    const value = e.target.value;
    // Allow only numbers and limit to 10 digits
    const numbersOnly = value.replace(/[^0-9]/g, '');
    if (numbersOnly.length <= 10) {
      setPhoneNumber(numbersOnly);
    }
  };

  const isValidNumber = phoneNumber.length >= 10;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Premium container */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl shadow-gray-200/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-4 shadow-lg">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to We4you</h1>
            <p className="text-gray-600 text-sm">Enter your number to register</p>
          </div>

          {/* Input Container */}
          <div className="space-y-6">
            {/* Phone Input Container */}
            <div className="relative">
              <div 
                className={`
                  relative flex items-center bg-gray-50 border-2 rounded-2xl transition-all duration-300 ease-out
                  ${isFocused ? 'border-gray-900 bg-white shadow-lg' : 'border-gray-200'}
                  hover:border-gray-300 hover:shadow-md
                `}
              >
                {/* Country Flag and Code */}
                <div className="flex items-center pl-4 pr-3 py-4 border-r border-gray-200">
                  {/* Indian Flag */}
                  <div className="w-6 h-4 mr-3 rounded-sm overflow-hidden shadow-sm border border-gray-300">
                    <div className="h-1/3 bg-orange-500"></div>
                    <div className="h-1/3 bg-white flex items-center justify-center">
                      <div className="w-2 h-2 border border-blue-800 rounded-full relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-1 h-1 bg-blue-800 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="h-1/3 bg-green-600"></div>
                  </div>
                  <span className="text-gray-700 font-medium text-sm">+91</span>
                </div>

                {/* Phone Number Input */}
                <input
                  type="text"
                  inputMode="numeric"
                  value={phoneNumber}
                  onChange={handleInputChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyPress={(e) => {
                    // Allow only numbers
                    if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Enter') {
                      e.preventDefault();
                    }
                    if (e.key === 'Enter' && isValidNumber) {
                      handleSubmit();
                    }
                  }}
                  placeholder="Enter your phone number"
                  className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 px-4 py-4 focus:outline-none text-lg font-medium"
                  maxLength={10}
                />
              </div>

              {/* Helper text */}
              <p className="text-xs text-gray-500 mt-2 ml-1">
                We'll send you a verification code
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!isValidNumber}
              className={`
                w-full  relative overflow-hidden rounded-2xl py-4 px-6 font-semibold text-lg transition-all duration-300 ease-out transform
                ${isValidNumber 
                  ? 'bg-[#FFA500] text-white shadow-lg hover:shadow-xl hover:bg-[#FFA500] hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-center justify-center space-x-2 ">
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>

          {/* Bottom text */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By continuing, you agree to our{' '}
            <span className="text-gray-900 hover:text-gray-700 cursor-pointer transition-colors font-medium">
              Terms of Service
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}