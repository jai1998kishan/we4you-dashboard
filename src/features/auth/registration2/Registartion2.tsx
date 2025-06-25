/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useCallback, memo } from 'react';
import {
  Building2,
  FileText,
  CreditCard,
  Upload,
  X,
  MapPin,
  Globe,
  ArrowRight,
  Image as LucideImage,
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import axios from 'axios';

// Define form data structure
interface FormData {
  company_name: string;
  GST_no: string;
  aadhaar_number: string;
  pan_card_number: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  lat: string;
  long: string;
  address: string;
}

// Define file uploads structure
interface FileUploads {
  GST_certificate: File | null;
  aadhaar_front_image: File | null;
  aadhaar_rear_image: File | null;
  pan_card_image: File | null;
  registration_certificate: File | null;
  signed_agreement_copy: File | null;
}

const PremiumRegistrationForm2: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    company_name: '',
    GST_no: '',
    aadhaar_number: '',
    pan_card_number: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    lat: '',
    long: '',
    address: '',
  });

  const [fileUploads, setFileUploads] = useState<FileUploads>({
    GST_certificate: null,
    aadhaar_front_image: null,
    aadhaar_rear_image: null,
    pan_card_image: null,
    registration_certificate: null,
    signed_agreement_copy: null,
  });

  const [filePreviews, setFilePreviews] = useState<{[key: string]: string}>({});
  const [focusedField, setFocusedField] = useState<string>('');
  
  const fileInputRefs = {
    GST_certificate: useRef<HTMLInputElement>(null),
    aadhaar_front_image: useRef<HTMLInputElement>(null),
    aadhaar_rear_image: useRef<HTMLInputElement>(null),
    pan_card_image: useRef<HTMLInputElement>(null),
    registration_certificate: useRef<HTMLInputElement>(null),
    signed_agreement_copy: useRef<HTMLInputElement>(null),
  };

  const navigate = useNavigate();

  // Handle text input changes
  const handleInputChange = useCallback(
    (field: keyof FormData, e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  // Handle file uploads
  const handleFileUpload = useCallback(
    (fileType: keyof FileUploads, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFileUploads((prev) => ({
          ...prev,
          [fileType]: file,
        }));

        // Create preview for images
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setFilePreviews((prev) => ({
              ...prev,
              [fileType]: event.target?.result as string,
            }));
          };
          reader.readAsDataURL(file);
        } else {
          setFilePreviews((prev) => ({
            ...prev,
            [fileType]: file.name,
          }));
        }
      }
    },
    []
  );

  // Remove file
  const removeFile = useCallback((fileType: keyof FileUploads) => {
    setFileUploads((prev) => ({
      ...prev,
      [fileType]: null,
    }));
    setFilePreviews((prev) => {
      const newPreviews = { ...prev };
      delete newPreviews[fileType];
      return newPreviews;
    });
    if (fileInputRefs[fileType].current) {
      fileInputRefs[fileType].current!.value = '';
    }
  }, []);

  // Get current location
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            lat: position.coords.latitude.toFixed(6),
            long: position.coords.longitude.toFixed(6),
          }));
        },
        () => {
          alert('Unable to get location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }, []);

  // Check if form is valid
  const isFormValid = useCallback((): boolean => {
    const requiredTextFields: Array<keyof FormData> = [
      'company_name',
      'GST_no',
      'aadhaar_number',
      'pan_card_number',
      'country',
      'state',
      'city',
      'pincode',
      'lat',
      'long',
      'address',
    ];

    const requiredFiles: Array<keyof FileUploads> = [
      'GST_certificate',
      'aadhaar_front_image',
      'aadhaar_rear_image',
      'pan_card_image',
      'registration_certificate',
      'signed_agreement_copy',
    ];

    const textFieldsValid = requiredTextFields.every((field) => formData[field].trim() !== '');
    const filesValid = requiredFiles.every((file) => fileUploads[file] !== null);

    return textFieldsValid && filesValid;
  }, [formData, fileUploads]);

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!isFormValid()) return;

    const storedData = localStorage.getItem('authData');
    let sessionKey = '';
    if (storedData) {
      try {
        const authData = JSON.parse(storedData);
        sessionKey = authData.sessionkey;
        console.log('Session Key:', sessionKey);
      } catch (error) {
        console.error('Failed to parse authData:', error);
        alert('Authentication data is invalid.');
        return;
      }
    } else {
      alert('No authentication data found. Please log in again.');
      return;
    }

    // Create FormData to hold both text and file inputs
    const formDataToSend = new FormData();

    // Append all text form fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === 'lat' || key === 'long') {
        // Convert lat/long to float
        formDataToSend.append(key, parseFloat(value).toString());
      } else if (key === 'aadhaar_number') {
        // Convert aadhaar to int
        formDataToSend.append(key, parseInt(value).toString());
      } else {
        formDataToSend.append(key, value);
      }
    });

    // Append all file uploads
    Object.entries(fileUploads).forEach(([key, file]) => {
      if (file) {
        formDataToSend.append(key, file);
      }
    });

    try {
      const response = await axios.post(
        'https://aeba-2401-4900-8846-d79b-acbb-808c-1b4c-3cb.ngrok-free.app/vendors/company-details', 
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${sessionKey}`,
          },
        }
      );

      console.log('Company registration successful:', response.data);
      if (response.status === 201) {
        navigate({ to: "/" });
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      const errorMessage =
        error.response?.data?.message || 'Failed to submit registration. Please try again.';
      alert(errorMessage);
    }
  }, [formData, fileUploads, isFormValid, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl shadow-gray-200/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-4 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Company Registration</h1>
            <p className="text-gray-600 text-sm">Complete your company details and upload required documents</p>
          </div>

          <div className="space-y-8">
            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Building2 className="w-5 h-5" />
                <span>Company Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Company Name"
                  field="company_name"
                  icon={Building2}
                  placeholder="Enter company name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('company_name')}
                  onBlur={() => setFocusedField('')}
                />
                <InputField
                  label="GST Number"
                  field="GST_no"
                  icon={FileText}
                  placeholder="Enter GST number"
                  value={formData.GST_no}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('GST_no')}
                  onBlur={() => setFocusedField('')}
                />
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Personal Information</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Aadhaar Number"
                  field="aadhaar_number"
                  type="number"
                  icon={CreditCard}
                  placeholder="Enter 12-digit Aadhaar number"
                  value={formData.aadhaar_number}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('aadhaar_number')}
                  onBlur={() => setFocusedField('')}
                />
                <InputField
                  label="PAN Card Number"
                  field="pan_card_number"
                  icon={CreditCard}
                  placeholder="Enter PAN number"
                  value={formData.pan_card_number}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('pan_card_number')}
                  onBlur={() => setFocusedField('')}
                />
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Location Details</span>
              </h3>
              
              <InputField
                label="Address"
                field="address"
                icon={MapPin}
                placeholder="Enter complete address"
                value={formData.address}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('address')}
                onBlur={() => setFocusedField('')}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Country"
                  field="country"
                  icon={Globe}
                  placeholder="India"
                  value={formData.country}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('country')}
                  onBlur={() => setFocusedField('')}
                />
                <InputField
                  label="State"
                  field="state"
                  icon={MapPin}
                  placeholder="Uttar Pradesh"
                  value={formData.state}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('state')}
                  onBlur={() => setFocusedField('')}
                />
                <InputField
                  label="City"
                  field="city"
                  icon={MapPin}
                  placeholder="Ghaziabad"
                  value={formData.city}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('city')}
                  onBlur={() => setFocusedField('')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="Pincode"
                  field="pincode"
                  type="number"
                  icon={MapPin}
                  placeholder="201001"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('pincode')}
                  onBlur={() => setFocusedField('')}
                />
                <div className="md:col-span-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4" />
                        <span>Location Coordinates</span>
                      </div>
                      <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-colors"
                      >
                        Get Current Location
                      </button>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <InputField
                        label=""
                        field="lat"
                        type="text"
                        placeholder="Latitude"
                        value={formData.lat}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('lat')}
                        onBlur={() => setFocusedField('')}
                      />
                      <InputField
                        label=""
                        field="long"
                        type="text"
                        placeholder="Longitude"
                        value={formData.long}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('long')}
                        onBlur={() => setFocusedField('')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Uploads */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Upload className="w-5 h-5" />
                <span>Required Documents</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadField
                  label="GST Certificate"
                  fileType="GST_certificate"
                  file={fileUploads.GST_certificate}
                  preview={filePreviews.GST_certificate}
                  onUpload={handleFileUpload}
                  onRemove={removeFile}
                  inputRef={fileInputRefs.GST_certificate}
                />
                
                <FileUploadField
                  label="Registration Certificate"
                  fileType="registration_certificate"
                  file={fileUploads.registration_certificate}
                  preview={filePreviews.registration_certificate}
                  onUpload={handleFileUpload}
                  onRemove={removeFile}
                  inputRef={fileInputRefs.registration_certificate}
                />

                <FileUploadField
                  label="Aadhaar Front Image"
                  fileType="aadhaar_front_image"
                  file={fileUploads.aadhaar_front_image}
                  preview={filePreviews.aadhaar_front_image}
                  onUpload={handleFileUpload}
                  onRemove={removeFile}
                  inputRef={fileInputRefs.aadhaar_front_image}
                  accept="image/*"
                />

                <FileUploadField
                  label="Aadhaar Rear Image"
                  fileType="aadhaar_rear_image"
                  file={fileUploads.aadhaar_rear_image}
                  preview={filePreviews.aadhaar_rear_image}
                  onUpload={handleFileUpload}
                  onRemove={removeFile}
                  inputRef={fileInputRefs.aadhaar_rear_image}
                  accept="image/*"
                />

                <FileUploadField
                  label="PAN Card Image"
                  fileType="pan_card_image"
                  file={fileUploads.pan_card_image}
                  preview={filePreviews.pan_card_image}
                  onUpload={handleFileUpload}
                  onRemove={removeFile}
                  inputRef={fileInputRefs.pan_card_image}
                  accept="image/*"
                />

                <FileUploadField
                  label="Signed Agreement Copy"
                  fileType="signed_agreement_copy"
                  file={fileUploads.signed_agreement_copy}
                  preview={filePreviews.signed_agreement_copy}
                  onUpload={handleFileUpload}
                  onRemove={removeFile}
                  inputRef={fileInputRefs.signed_agreement_copy}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={`
                w-full relative overflow-hidden rounded-2xl py-4 px-6 font-semibold text-lg transition-all duration-300 ease-out transform
                ${isFormValid()
                  ? 'bg-gray-900 text-white shadow-lg hover:shadow-xl hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98]'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>Submit Company Registration</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>

          {/* Bottom text */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By submitting, you agree to our{' '}
            <span className="text-gray-900 hover:text-gray-700 cursor-pointer transition-colors font-medium">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="text-gray-900 hover:text-gray-700 cursor-pointer transition-colors font-medium">
              Privacy Policy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Input Field Component
interface InputFieldProps {
  label: string;
  field: keyof FormData;
  type?: string;
  icon?: React.ElementType;
  placeholder?: string;
  value: string;
  onChange: (field: keyof FormData, e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
}

const InputField: React.FC<InputFieldProps> = memo(
  ({ label, field, type = 'text', icon: Icon, placeholder, value, onChange, onFocus, onBlur }) => (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
          {Icon && <Icon className="w-4 h-4" />}
          <span>{label}</span>
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(field, e)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-gray-50 hover:border-gray-300 focus:outline-none focus:border-gray-900 focus:bg-white focus:shadow-lg transition-all duration-300 ease-out text-gray-900 placeholder-gray-500"
      />
    </div>
  )
);

// File Upload Field Component
interface FileUploadFieldProps {
  label: string;
  fileType: keyof FileUploads;
  file: File | null;
  preview?: string;
  onUpload: (fileType: keyof FileUploads, e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (fileType: keyof FileUploads) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  accept?: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = memo(
  ({ label, fileType, file, preview, onUpload, onRemove, inputRef, accept = "*/*" }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
        <Upload className="w-4 h-4" />
        <span>{label}</span>
      </label>
      <div className="space-y-3">
        {preview && (
          <div className="relative">
            {preview.startsWith('data:image') ? (
              <img
                src={preview}
                alt={`${label} preview`}
                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 truncate px-2">{preview}</p>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={() => onRemove(fileType)}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
        
        <div className="flex items-center space-x-3">
          {!preview && (
            <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
          >
            {file ? 'Change File' : 'Upload File'}
          </button>
        </div>
        
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={(e) => onUpload(fileType, e)}
          className="hidden"
        />
      </div>
    </div>
  )
);

export default PremiumRegistrationForm2;