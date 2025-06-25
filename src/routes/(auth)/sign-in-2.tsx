import { createFileRoute } from '@tanstack/react-router'
import PremiumRegistrationForm2 from '@/features/auth/registration2/Registartion2'

export const Route = createFileRoute('/(auth)/sign-in-2')({
  component: PremiumRegistrationForm2,
})
