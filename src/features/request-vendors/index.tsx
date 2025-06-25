import React, { useState } from 'react';
import { Check, X, Eye, MapPin, FileText, CreditCard, Building, Phone, Mail, Calendar, User } from 'lucide-react';

const RequestVendor = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);

  // Mock vendor requests data
  const vendorRequests = [
    {
      id: 1,
      company_name: "TechCorp Solutions Pvt Ltd",
      GST_no: "29ABCDE1234F1Z5",
      aadhaar_number: "****-****-1234",
      pan_card_number: "ABCDE1234F",
      country: "India",
      state: "Karnataka",
      city: "Bangalore",
      pincode: "560001",
      lat: 12.9716,
      long: 77.5946,
      address: "123, MG Road, Bangalore, Karnataka",
      email: "contact@techcorp.com",
      phone: "+91 98765 43210",
      submitted_at: "2024-06-20T10:30:00Z",
      documents: {
        GST_certificate: "/api/placeholder/600/400",
        aadhaar_front_image: "/api/placeholder/600/400",
        aadhaar_rear_image: "/api/placeholder/600/400",
        pan_card_image: "/api/placeholder/600/400",
        registration_certificate: "/api/placeholder/600/400",
        signed_agreement_copy: "/api/placeholder/600/400"
      }
    },
    {
      id: 2,
      company_name: "InnovateTech Industries",
      GST_no: "27FGHIJ5678K2L9",
      aadhaar_number: "****-****-5678",
      pan_card_number: "FGHIJ5678K",
      country: "India",
      state: "Maharashtra",
      city: "Mumbai",
      pincode: "400001",
      lat: 19.0760,
      long: 72.8777,
      address: "456, Nariman Point, Mumbai, Maharashtra",
      email: "info@innovatetech.com",
      phone: "+91 87654 32109",
      submitted_at: "2024-06-19T14:45:00Z",
      documents: {
        GST_certificate: "/api/placeholder/600/400",
        aadhaar_front_image: "/api/placeholder/600/400",
        aadhaar_rear_image: "/api/placeholder/600/400",
        pan_card_image: "/api/placeholder/600/400",
        registration_certificate: "/api/placeholder/600/400",
        signed_agreement_copy: "/api/placeholder/600/400"
      }
    }
  ];

  const handleApprove = (vendorId) => {
    console.log(`Approved vendor ${vendorId}`);
  };

  const handleReject = (vendorId) => {
    console.log(`Rejected vendor ${vendorId}`);
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const toggleCardExpansion = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const DocumentCard = ({ title, imageUrl }) => (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-all duration-200 cursor-pointer"
      onClick={() => openImageModal(imageUrl)}
    >
      <div className="text-sm font-medium text-gray-900 mb-3">{title}</div>
      <div className="aspect-video bg-gray-100 rounded border overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vendor Requests</h1>
              <p className="text-gray-600 mt-1">Review and manage vendor registration requests</p>
            </div>
            <div className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium">
              {vendorRequests.length} Pending
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {vendorRequests.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-lg border shadow-sm">
              {/* Card Header */}
              <div className="border-b p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{vendor.company_name}</h2>
                      <p className="text-gray-500 text-sm flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(vendor.submitted_at)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleCardExpansion(vendor.id)}
                    className="border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">{expandedCard === vendor.id ? 'Hide Details' : 'Show Details'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Info */}
              <div className="p-6 bg-gray-50 border-b">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">GST Number</p>
                    <p className="font-medium text-gray-900">{vendor.GST_no}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Location</p>
                    <p className="font-medium text-gray-900">{vendor.city}, {vendor.state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">PAN Number</p>
                    <p className="font-medium text-gray-900">{vendor.pan_card_number}</p>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedCard === vendor.id && (
                <div className="p-6 space-y-8">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Email</p>
                          <p className="text-gray-900">{vendor.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Phone</p>
                          <p className="text-gray-900">{vendor.phone}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Address</p>
                          <p className="text-gray-900">{vendor.address}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Aadhaar Number</p>
                          <p className="text-gray-900">{vendor.aadhaar_number}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <DocumentCard 
                        title="GST Certificate" 
                        imageUrl={vendor.documents.GST_certificate}
                      />
                      <DocumentCard 
                        title="Aadhaar Front" 
                        imageUrl={vendor.documents.aadhaar_front_image}
                      />
                      <DocumentCard 
                        title="Aadhaar Rear" 
                        imageUrl={vendor.documents.aadhaar_rear_image}
                      />
                      <DocumentCard 
                        title="PAN Card" 
                        imageUrl={vendor.documents.pan_card_image}
                      />
                      <DocumentCard 
                        title="Registration Certificate" 
                        imageUrl={vendor.documents.registration_certificate}
                      />
                      <DocumentCard 
                        title="Signed Agreement" 
                        imageUrl={vendor.documents.signed_agreement_copy}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="p-6 bg-gray-50 border-t">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    Review all documents and information before making a decision
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleReject(vendor.id)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleApprove(vendor.id)}
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
                    >
                      <Check className="w-4 h-4" />
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
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={closeImageModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Document"
              className="max-w-full max-h-full rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestVendor;