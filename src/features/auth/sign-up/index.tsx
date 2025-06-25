/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from '@tanstack/react-router'
import { Phone, ArrowRight } from 'lucide-react'

export default function PremiumPhoneInput() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
  try {
    const response = await axios.post(
      'https://aeba-2401-4900-8846-d79b-acbb-808c-1b4c-3cb.ngrok-free.app/vendors/request-otp',
      {
        phone: phoneNumber,
        country_code: 91,
      }
    );

    // Check for successful response
    if (response.status === 200 && phoneNumber.trim()) {
      navigate({ to: `/verify?phone=${phoneNumber}` });
    } else {
      console.error('OTP request did not succeed:', response);
    }
  } catch (error) {
    console.error('OTP request failed:', error);
  }
};


  const handleInputChange = (e: any) => {
    const value = e.target.value
    // Allow only numbers and limit to 10 digits
    const numbersOnly = value.replace(/[^0-9]/g, '')
    if (numbersOnly.length <= 10) {
      setPhoneNumber(numbersOnly)
    }
  }

  const isValidNumber = phoneNumber.length >= 10

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
      <div className='w-full max-w-md'>
        {/* Premium container */}
        <div className='rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl shadow-gray-200/50'>
          {/* Header */}
          <div className='mb-8 text-center'>
            <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900 shadow-lg'>
              <Phone className='h-8 w-8 text-white' />
            </div>
            <h1 className='mb-2 text-2xl font-bold text-gray-900'>
              Welcome to We4you
            </h1>
            <p className='text-sm text-gray-600'>
              Enter your number to register
            </p>
          </div>

          {/* Input Container */}
          <div className='space-y-6'>
            {/* Phone Input Container */}
            <div className='relative'>
              <div
                className={`relative flex items-center rounded-2xl border-2 bg-gray-50 transition-all duration-300 ease-out ${isFocused ? 'border-gray-900 bg-white shadow-lg' : 'border-gray-200'} hover:border-gray-300 hover:shadow-md`}
              >
                {/* Country Flag and Code */}
                <div className='flex items-center border-r border-gray-200 py-4 pr-3 pl-4'>
                  {/* Indian Flag */}
                  <div className='mr-3 h-4 w-6 overflow-hidden rounded-sm border border-gray-300 shadow-sm'>
                    <div className='h-1/3 bg-orange-500'></div>
                    <div className='flex h-1/3 items-center justify-center bg-white'>
                      <div className='relative h-2 w-2 rounded-full border border-blue-800'>
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <div className='h-1 w-1 rounded-full bg-blue-800'></div>
                        </div>
                      </div>
                    </div>
                    <div className='h-1/3 bg-green-600'></div>
                  </div>
                  <span className='text-sm font-medium text-gray-700'>+91</span>
                </div>

                {/* Phone Number Input */}
                <input
                  type='text'
                  inputMode='numeric'
                  value={phoneNumber}
                  onChange={handleInputChange}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onKeyPress={(e) => {
                    // Allow only numbers
                    if (
                      !/[0-9]/.test(e.key) &&
                      e.key !== 'Backspace' &&
                      e.key !== 'Delete' &&
                      e.key !== 'Enter'
                    ) {
                      e.preventDefault()
                    }
                    if (e.key === 'Enter' && isValidNumber) {
                      handleSubmit()
                    }
                  }}
                  placeholder='Enter your phone number'
                  className='flex-1 bg-transparent px-4 py-4 text-lg font-medium text-gray-900 placeholder-gray-500 focus:outline-none'
                  maxLength={10}
                />
              </div>

              {/* Helper text */}
              <p className='mt-2 ml-1 text-xs text-gray-500'>
                We'll send you a verification code
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!isValidNumber}
              className={`relative w-full transform overflow-hidden rounded-2xl px-6 py-4 text-lg font-semibold transition-all duration-300 ease-out ${
                isValidNumber
                  ? 'bg-[#FFA500] text-white shadow-lg hover:scale-[1.02] hover:bg-[#FFA500] hover:shadow-xl active:scale-[0.98]'
                  : 'cursor-not-allowed bg-gray-200 text-gray-400'
              } `}
            >
              <div className='flex items-center justify-center space-x-2'>
                <span>Continue</span>
                <ArrowRight className='h-5 w-5' />
              </div>
            </button>
          </div>

          {/* Bottom text */}
          <p className='mt-6 text-center text-xs text-gray-500'>
            By continuing, you agree to our{' '}
            <span className='cursor-pointer font-medium text-gray-900 transition-colors hover:text-gray-700'>
              Terms of Service
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
