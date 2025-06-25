import PremiumRegistrationForm from '@/features/auth/registration1/Registration1'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(auth)/registration1')({
  component: PremiumRegistrationForm,
})


