/* eslint-disable no-console */
import { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { ArrowRight, Shield } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

// Define the component as a functional component with React.FC
const PremiumOTPVerification: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [focusedIndex, setFocusedIndex] = useState<number>(0)
  const inputRefs = useRef<HTMLInputElement[]>([])
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const queryParams = new URLSearchParams(window.location.search)
  const phone_number = queryParams.get('phone')
const navigate = useNavigate()
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  useEffect(() => {
    const isOtpComplete = otp.every((digit) => digit !== '')
    setIsComplete(isOtpComplete)
  }, [otp])

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return
    if (value && !/^[0-9]$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
      setFocusedIndex(index + 1)
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus()
        setFocusedIndex(index - 1)
      } else {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
      setFocusedIndex(index - 1)
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
      setFocusedIndex(index + 1)
    } else if (e.key === 'Enter' && isComplete) {
      handleSubmit()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const numbers = pastedData.replace(/\D/g, '').slice(0, 6)

    if (numbers.length > 0) {
      const newOtp = [...otp]
      for (let i = 0; i < numbers.length && i < 6; i++) {
        newOtp[i] = numbers[i]
      }
      setOtp(newOtp)

      const nextIndex = Math.min(numbers.length, 5)
      inputRefs.current[nextIndex]?.focus()
      setFocusedIndex(nextIndex)
    }
  }

const handleSubmit = async () => {
  const trimmedOtp = otp.join('').trim()
  try {
    const response = await axios.post(
      `https://aeba-2401-4900-8846-d79b-acbb-808c-1b4c-3cb.ngrok-free.app/vendors/verify-otp`,
      {
        phone: phone_number,
        otp: trimmedOtp,
      }
    )

    if (response.status === 200) {
      const { message, isVerified, data, sessionkey } = response.data

      // Store in localStorage
      localStorage.setItem('authData', JSON.stringify({
        message,
        isVerified,
        data,
        sessionkey,
      }))

      // Navigate after storing
      navigate({ to: "/registration-vendor" })
    }
  } catch (error) {
    console.error('OTP verification failed:', error)
  }
}


  const handleResendOTP = () => {}

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-50 p-4'>
      <div className='w-full max-w-md'>
        {/* Premium container */}
        <div className='rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl shadow-gray-200/50'>
          {/* Header */}
          <div className='mb-8 text-center'>
            <div className='mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-900 shadow-lg'>
              <Shield className='h-8 w-8 text-white' />
            </div>
            <h1 className='mb-2 text-2xl font-bold text-gray-900'>
              Verify OTP
            </h1>
            <p className='text-sm text-gray-600'>
              Enter the 6-digit code sent to your phone
            </p>
          </div>

          {/* OTP Input Container */}
          <div className='space-y-6'>
            {/* OTP Boxes */}
            <div className='flex justify-center space-x-3'>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el as HTMLInputElement
                  }}
                  type='text'
                  inputMode='numeric'
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => setFocusedIndex(index)}
                  onPaste={handlePaste}
                  className={`h-14 w-12 rounded-xl border-2 text-center text-xl font-bold transition-all duration-300 ease-out ${
                    focusedIndex === index
                      ? 'scale-105 transform border-gray-900 bg-white shadow-lg'
                      : digit
                        ? 'border-gray-400 bg-gray-50'
                        : 'border-gray-200 bg-gray-50'
                  } hover:border-gray-400 focus:border-gray-900 focus:bg-white focus:shadow-lg focus:outline-none ${digit ? 'text-gray-900' : 'text-gray-400'} `}
                  maxLength={1}
                />
              ))}
            </div>

            {/* Helper text */}
            <p className='text-center text-xs text-gray-500'>
              Didn't receive the code?{' '}
              <button
                onClick={handleResendOTP}
                className='font-medium text-gray-900 transition-colors hover:text-gray-700'
              >
                Resend OTP
              </button>
            </p>

            {/* Verify Button */}
            <button
              onClick={handleSubmit}
              disabled={!isComplete}
              className={`relative w-full transform overflow-hidden rounded-2xl px-6 py-4 text-lg font-semibold transition-all duration-300 ease-out ${
                isComplete
                  ? 'bg-[#FFA500] text-white shadow-lg hover:scale-[1.02] hover:bg-[#FFA500] hover:shadow-xl active:scale-[0.98]'
                  : 'cursor-not-allowed bg-gray-200 text-gray-400'
              } `}
            >
     
                {' '}
                <div className='flex items-center justify-center space-x-2'>
                  <span>Verify OTP</span>
                  <ArrowRight className='h-5 w-5' />
                </div>
          
            </button>
          </div>

          {/* Bottom text */}
          <p className='mt-6 text-center text-xs text-gray-500'>
            Keep this code secure and don't share it with anyone
          </p>
        </div>
      </div>
    </div>
  )
}

export default PremiumOTPVerification
