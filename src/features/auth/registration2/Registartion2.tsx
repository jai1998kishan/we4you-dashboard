import React, { useState, useRef } from 'react';
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

const PremiumRegistrationForm2: React.FC = () => {
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
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof FormData, value: string) => {
    if (field === 'pincode' || field === 'no_of_vehicles') {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData((prev) => ({
        ...prev,
        [field]: numericValue,
      }));
    } else if (field === 'lat' || field === 'long') {
      const coordinateValue = value.replace(/[^0-9.-]/g, '');
      setFormData((prev) => ({
        ...prev,
        [field]: coordinateValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getCurrentLocation = () => {
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
  };

  const isFormValid = (): boolean => {
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
      profileImage !== null
    );
  };

  const handleSubmit = () => {
    if (isFormValid()) {

      // Handle form submission here
    }
  };

  interface InputFieldProps {
    label: string;
    field: keyof FormData;
    type?: string;
    icon: React.ElementType;
    placeholder?: string;
    inputMode?:
      | 'none'
      | 'text'
      | 'decimal'
      | 'numeric'
      | 'tel'
      | 'search'
      | 'email'
      | 'url';
  }

  const InputField: React.FC<InputFieldProps> = ({
    label,
    field,
    type = 'text',
    icon: Icon,
    placeholder,
    inputMode = 'text',
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 flex items-center space-x-2">
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </label>
      <input
        type={type}
        inputMode={inputMode}
        value={formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value)}
        onFocus={() => setFocusedField(field)}
        onBlur={() => setFocusedField('')}
        placeholder={placeholder}
        className={`
          w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ease-out
          ${focusedField === field ? 'border-gray-900 bg-white shadow-lg' : 'border-gray-200 bg-gray-50'}
          hover:border-gray-300 focus:outline-none text-gray-900 placeholder-gray-500
        `}
      />
    </div>
  );

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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Company Registration</h1>
            <p className="text-gray-600 text-sm">Fill in your details to create your company account</p>
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
              />
              <InputField
                label="Email Address"
                field="email"
                type="email"
                icon={Mail}
                placeholder="your@email.com"
              />
            </div>

            {/* Address */}
            <InputField
              label="Address"
              field="address"
              icon={MapPin}
              placeholder="Enter your complete address"
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
                <input
                  type="number"
                  step="any"
                  value={formData.lat}
                  onChange={(e) => handleInputChange('lat', e.target.value)}
                  onFocus={() => setFocusedField('lat')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Latitude"
                  className={`
                    w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ease-out
                    ${focusedField === 'lat'
                      ? 'border-gray-900 bg-white shadow-lg'
                      : 'border-gray-200 bg-gray-50'
                    }
                    hover:border-gray-300 focus:outline-none text-gray-900 placeholder-gray-500
                  `}
                />
                <input
                  type="number"
                  step="any"
                  value={formData.long}
                  onChange={(e) => handleInputChange('long', e.target.value)}
                  onFocus={() => setFocusedField('long')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Longitude"
                  className={`
                    w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ease-out
                    ${focusedField === 'long'
                      ? 'border-gray-900 bg-white shadow-lg'
                      : 'border-gray-200 bg-gray-50'
                    }
                    hover:border-gray-300 focus:outline-none text-gray-900 placeholder-gray-500
                  `}
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
              />
              <InputField
                label="State"
                field="state"
                icon={MapPin}
                placeholder="Uttar Pradesh"
              />
              <InputField
                label="City"
                field="city"
                icon={MapPin}
                placeholder="Ghaziabad"
              />
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Pincode"
                field="pincode"
                type="text"
                inputMode="numeric"
                icon={MapPin}
                placeholder="201001"
              />
              <InputField
                label="Number of Vehicles"
                field="no_of_vehicles"
                type="text"
                inputMode="numeric"
                icon={Car}
                placeholder="2"
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

export default PremiumRegistrationForm2;