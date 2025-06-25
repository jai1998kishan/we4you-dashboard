/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useCallback, memo } from 'react';
import {
  User,
  Mail,
  MapPin,
  Globe,
  Image as LucideImage,
  Car,
  ArrowRight,
  Upload,
  X,
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import axios from 'axios';

// Define form data structure
interface FormData {
  fullname: string;
  email: string;
  address: string;
  lat: string;
  long: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  no_of_vehicles: string;
}

const PremiumRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullname: '',
    email: '',
    address: '',
    lat: '',
    long: '',
    country: '',
    state: '',
    city: '',
    pincode: '',
    no_of_vehicles: '',
  });
  const [profile_image, setprofile_image] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<keyof FormData | 'lat' | 'long' | ''>(
    ''
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
const navigate = useNavigate()
  // Unified handler with useCallback
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

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setprofile_image(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const removeImage = useCallback(() => {
    setprofile_image(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

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

  const isFormValid = useCallback((): boolean => {
    const requiredFields: Array<keyof FormData> = [
      'fullname',
      'email',
      'address',
      'lat',
      'long',
      'country',
      'state',
      'city',
      'pincode',
      'no_of_vehicles',
    ];
    return (
      requiredFields.every((field) => formData[field].trim() !== '') &&
      profile_image !== null
    );
  }, [formData, profile_image]);

const storedData = localStorage.getItem('authData')

if (storedData) {
  const authData = JSON.parse(storedData)
  const sessionKey: string = authData.sessionkey
  console.log('Session Key:', sessionKey)
} else {
  console.warn('No authData in localStorage')
}





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

  // Append all form fields
  Object.entries(formData).forEach(([key, value]) => {
    formDataToSend.append(key, value);
  });

  // Append profile image if exists
  if (profile_image) {
    formDataToSend.append('profile_image', profile_image); // Adjust backend field name as needed
  }

  try {
    const response = await axios.post(
      'https://aeba-2401-4900-8846-d79b-acbb-808c-1b4c-3cb.ngrok-free.app/vendors/profile', 
      formDataToSend,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${sessionKey}`, // Send session key as Bearer token
        },
      }
    );

    console.log('Profile created successfully:', response.data);
if(response.status==200){
    navigate({to: "/registration-vendor-company"})
}
    // Optionally redirect or reset form
  } catch (error: any) {
    console.error('Error submitting form:', error);
    const errorMessage =
      error.response?.data?.message || 'Failed to submit registration. Please try again.';
    alert(errorMessage);
  }
}, [formData, profile_image, isFormValid]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Premium container */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl shadow-gray-200/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-4 shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Registration</h1>
            <p className="text-gray-600 text-sm">Fill in your details to create your account</p>
          </div>
          {/* Form */}
          <div className="space-y-6">
            {/* Profile Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
                <LucideImage className="w-4 h-4" />
                <span>Profile Image</span>
              </label>
              <div className="flex items-center space-x-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
                    <Upload className="w-6 h-6 text-gray-400" />
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                >
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Full Name"
                field="fullname"
                icon={User}
                placeholder="Enter your full name"
                value={formData.fullname}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('fullname')}
                onBlur={() => setFocusedField('')}
              />
              <InputField
                label="Email Address"
                field="email"
                type="email"
                icon={Mail}
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
              />
            </div>

            {/* Address */}
            <InputField
              label="Address"
              field="address"
              icon={MapPin}
              placeholder="Enter your complete address"
              value={formData.address}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('address')}
              onBlur={() => setFocusedField('')}
            />

            {/* Location Coordinates */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>Location Coordinates</span>
                </div>
                <button
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

            {/* Location Details */}
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

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <InputField
                label="Number of Vehicles"
                field="no_of_vehicles"
                type="number"
                icon={Car}
                placeholder="2"
                value={formData.no_of_vehicles}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('no_of_vehicles')}
                onBlur={() => setFocusedField('')}
              />
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
                <span>Complete Registration</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          </div>

          {/* Bottom text */}
          <p className="text-center text-xs text-gray-500 mt-6">
            By registering, you agree to our{' '}
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

// InputField moved outside and memoized
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
        className={`
          w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ease-out
         'border-gray-900 bg-white shadow-lg' : 'border-gray-200 bg-gray-50'}
          hover:border-gray-300 focus:outline-none text-gray-900 placeholder-gray-500
        `}
      />
    </div>
  )
);

export default PremiumRegistrationForm;