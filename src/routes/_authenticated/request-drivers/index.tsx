import { createFileRoute } from '@tanstack/react-router'
import RequestDriver from '@/features/request-drivers'

export const Route = createFileRoute('/_authenticated/request-drivers/')({
  component: RequestDriver,
})
