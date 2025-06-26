import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Check,
  X,
  Eye,
  MapPin,
  FileText,
  CreditCard,
  Building,
  Phone,
  Mail,
  Calendar,
  User,
} from 'lucide-react'

const RequestDriver = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [expandedCard, setExpandedCard] = useState(null)
  const [data, setData] = useState([])

  // Mock vendor requests data
  const driverRequests = [
    {
      id: 1,
      company_name: 'TechCorp Solutions Pvt Ltd',
      GST_no: '29ABCDE1234F1Z5',
      aadhaar_number: '****-****-1234',
      pan_card_number: 'ABCDE1234F',
      country: 'India',
      state: 'Karnataka',
      city: 'Bangalore',
      pincode: '560001',
      lat: 12.9716,
      long: 77.5946,
      address: '123, MG Road, Bangalore, Karnataka',
      email: 'contact@techcorp.com',
      phone: '+91 98765 43210',
      submitted_at: '2024-06-20T10:30:00Z',
      documents: {
        GST_certificate: '/api/placeholder/600/400',
        aadhaar_front_image: '/api/placeholder/600/400',
        aadhaar_rear_image: '/api/placeholder/600/400',
        pan_card_image: '/api/placeholder/600/400',
        registration_certificate: '/api/placeholder/600/400',
        signed_agreement_copy: '/api/placeholder/600/400',
      },
    },
    {
      id: 2,
      company_name: 'InnovateTech Industries',
      GST_no: '27FGHIJ5678K2L9',
      aadhaar_number: '****-****-5678',
      pan_card_number: 'FGHIJ5678K',
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      pincode: '400001',
      lat: 19.076,
      long: 72.8777,
      address: '456, Nariman Point, Mumbai, Maharashtra',
      email: 'info@innovatetech.com',
      phone: '+91 87654 32109',
      submitted_at: '2024-06-19T14:45:00Z',
      documents: {
        GST_certificate: '/api/placeholder/600/400',
        aadhaar_front_image: '/api/placeholder/600/400',
        aadhaar_rear_image: '/api/placeholder/600/400',
        pan_card_image: '/api/placeholder/600/400',
        registration_certificate: '/api/placeholder/600/400',
        signed_agreement_copy: '/api/placeholder/600/400',
      },
    },
  ]

  const fetchData = async () => {
    const res = await axios.get(
      'https://aeba-2401-4900-8846-d79b-acbb-808c-1b4c-3cb.ngrok-free.app/vendors?page=1&limit=10'
    )
    console.log('-------res----', res)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleApprove = (vendorId) => {
    console.log(`Approved vendor ${vendorId}`)
  }

  const handleReject = (vendorId) => {
    console.log(`Rejected vendor ${vendorId}`)
  }

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
  }

  const toggleCardExpansion = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const DocumentCard = ({ title, imageUrl }) => (
    <div
      className='cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-400'
      onClick={() => openImageModal(imageUrl)}
    >
      <div className='mb-3 text-sm font-medium text-gray-900'>{title}</div>
      <div className='aspect-video overflow-hidden rounded border bg-gray-100'>
        <img
          src={imageUrl}
          alt={title}
          className='h-full w-full object-cover transition-transform duration-200 hover:scale-105'
        />
      </div>
    </div>
  )

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='border-b bg-white'>
        <div className='mx-auto max-w-6xl px-6 py-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>
                Driver Requests
              </h1>
              <p className='mt-1 text-gray-600'>
                Review and manage driver registration requests
              </p>
            </div>
            <div className='rounded-lg bg-black px-4 py-2 text-sm font-medium text-white'>
              {driverRequests.length} Pending
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='mx-auto max-w-6xl px-6 py-8'>
        <div className='space-y-6'>
          {driverRequests.map((vendor) => (
            <div
              key={vendor.id}
              className='rounded-lg border bg-white shadow-sm'
            >
              {/* Card Header */}
              <div className='border-b p-6'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-black'>
                      <Building className='h-5 w-5 text-white' />
                    </div>
                    <div>
                      <h2 className='text-xl font-bold text-gray-900'>
                        {vendor.company_name}
                      </h2>
                      <p className='mt-1 flex items-center text-sm text-gray-500'>
                        <Calendar className='mr-1 h-4 w-4' />
                        {formatDate(vendor.submitted_at)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleCardExpansion(vendor.id)}
                    className='flex items-center space-x-2 rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:border-gray-400'
                  >
                    <Eye className='h-4 w-4' />
                    <span className='text-sm'>
                      {expandedCard === vendor.id
                        ? 'Hide Details'
                        : 'Show Details'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Quick Info */}
              <div className='border-b bg-gray-50 p-6'>
                <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
                  <div>
                    <p className='mb-1 text-sm text-gray-500'>GST Number</p>
                    <p className='font-medium text-gray-900'>{vendor.GST_no}</p>
                  </div>
                  <div>
                    <p className='mb-1 text-sm text-gray-500'>Location</p>
                    <p className='font-medium text-gray-900'>
                      {vendor.city}, {vendor.state}
                    </p>
                  </div>
                  <div>
                    <p className='mb-1 text-sm text-gray-500'>PAN Number</p>
                    <p className='font-medium text-gray-900'>
                      {vendor.pan_card_number}
                    </p>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedCard === vendor.id && (
                <div className='space-y-8 p-6'>
                  {/* Contact Information */}
                  <div>
                    <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                      Contact Information
                    </h3>
                    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                      <div className='space-y-4'>
                        <div>
                          <p className='mb-1 text-sm text-gray-500'>Email</p>
                          <p className='text-gray-900'>{vendor.email}</p>
                        </div>
                        <div>
                          <p className='mb-1 text-sm text-gray-500'>Phone</p>
                          <p className='text-gray-900'>{vendor.phone}</p>
                        </div>
                      </div>
                      <div className='space-y-4'>
                        <div>
                          <p className='mb-1 text-sm text-gray-500'>Address</p>
                          <p className='text-gray-900'>{vendor.address}</p>
                        </div>
                        <div>
                          <p className='mb-1 text-sm text-gray-500'>
                            Aadhaar Number
                          </p>
                          <p className='text-gray-900'>
                            {vendor.aadhaar_number}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h3 className='mb-4 text-lg font-semibold text-gray-900'>
                      Documents
                    </h3>
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                      <DocumentCard
                        title='GST Certificate'
                        imageUrl={vendor.documents.GST_certificate}
                      />
                      <DocumentCard
                        title='Aadhaar Front'
                        imageUrl={vendor.documents.aadhaar_front_image}
                      />
                      <DocumentCard
                        title='Aadhaar Rear'
                        imageUrl={vendor.documents.aadhaar_rear_image}
                      />
                      <DocumentCard
                        title='PAN Card'
                        imageUrl={vendor.documents.pan_card_image}
                      />
                      <DocumentCard
                        title='Registration Certificate'
                        imageUrl={vendor.documents.registration_certificate}
                      />
                      <DocumentCard
                        title='Signed Agreement'
                        imageUrl={vendor.documents.signed_agreement_copy}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className='border-t bg-gray-50 p-6'>
                <div className='flex items-center justify-between'>
                  <p className='text-sm text-gray-600'>
                    Review all documents and information before making a
                    decision
                  </p>
                  <div className='flex space-x-3'>
                    <button
                      onClick={() => handleReject(vendor.id)}
                      className='flex items-center space-x-2 rounded-lg border border-gray-300 px-6 py-2 text-gray-700 transition-colors hover:bg-gray-50'
                    >
                      <X className='h-4 w-4' />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApprove(vendor.id)}
                      className='flex items-center space-x-2 rounded-lg bg-black px-6 py-2 text-white transition-colors hover:bg-gray-800'
                    >
                      <Check className='h-4 w-4' />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className='bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-black p-4'
          onClick={closeImageModal}
        >
          <div
            className='relative max-h-full max-w-4xl'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeImageModal}
              className='absolute -top-10 right-0 z-10 text-white transition-colors hover:text-gray-300'
            >
              <X className='h-6 w-6' />
            </button>
            <img
              src={selectedImage}
              alt='Document'
              className='max-h-full max-w-full rounded-lg'
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default RequestDriver
