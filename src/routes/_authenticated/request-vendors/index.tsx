import { createFileRoute } from '@tanstack/react-router'
import RequestVendor from '@/features/request-vendors'

export const Route = createFileRoute('/_authenticated/request-vendors/')({
  component: RequestVendor,
})
