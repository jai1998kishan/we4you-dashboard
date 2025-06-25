import { createFileRoute } from '@tanstack/react-router'
import PremiumOTPVerification from '@/features/auth/verify-otp/Verify'

export const Route = createFileRoute('/(auth)/verify')({
  component: PremiumOTPVerification,
})
