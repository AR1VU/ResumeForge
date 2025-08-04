import React, { useState } from 'react';
import { Camera, Save } from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import toast from 'react-hot-toast';
interface InputFieldProps {
  label: string;
  field: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  field,
  type = 'text',
  required = false,
  value,
  onChange,
  onBlur,
  error
}) => {
  const { uiSettings } = useResumeStore();
  const isWeb3Theme = uiSettings.themeMode === 'web3';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
      <label className={`text-right font-medium pt-2 ${
        isWeb3Theme ? 'text-web3-text' : 'text-gray-700 dark:text-gray-300'
      }`}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="md:col-span-2">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur?.(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : isWeb3Theme
              ? 'border-web3-border bg-web3-dark text-web3-text focus:ring-web3-accent'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-pastel-mint'
          }`}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
};

export const PersonalInfoPage: React.FC = () => {
  const { personal, setPersonalField } = useResumeStore();
  const { uiSettings } = useResumeStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isWeb3Theme = uiSettings.themeMode === 'web3';

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'firstName':
      case 'lastName':
      case 'title':
        if (!value.trim()) {
          newErrors[field] = 'This field is required';
        } else {
          delete newErrors[field];
        }
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[field] = 'Please enter a valid email address';
        } else if (!value.trim()) {
          newErrors[field] = 'This field is required';
        } else {
          delete newErrors[field];
        }
        break;
      case 'phone':
        if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
          newErrors[field] = 'Please enter a valid phone number';
        } else {
          delete newErrors[field];
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof typeof personal, value: string) => {
    setPersonalField(field, value);
  };

  const handleInputBlur = (field: keyof typeof personal, value: string) => {
    validateField(field, value);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPersonalField('photoURI', e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const requiredFields = ['firstName', 'lastName', 'title', 'email'];
    const newErrors: Record<string, string> = {};
    
    requiredFields.forEach(field => {
      if (!personal[field as keyof typeof personal].trim()) {
        newErrors[field] = 'This field is required';
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields');
      return;
    }
    
    toast.success('Personal info saved!');
  };


  return (
    <div className="max-w-4xl mx-auto">
      <div className={`rounded-lg shadow-lg p-8 ${
        isWeb3Theme 
          ? 'bg-web3-dark border border-web3-border' 
          : 'bg-white dark:bg-gray-800'
      }`}>
        <h2 className={`text-2xl font-serif font-bold mb-8 ${
          isWeb3Theme ? 'text-web3-text' : 'text-charcoal dark:text-off-white'
        }`}>
          Personal Information
        </h2>
        
        <div className="space-y-6">
          {/* Photo Upload */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <label className="text-right font-medium text-gray-700 dark:text-gray-300 pt-2">
              Profile Photo
            </label>
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-pastel-mint rounded-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    {personal.photoURI ? (
                      <img
                        src={personal.photoURI}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <Camera className="w-8 h-8 text-gray-400" />
                    )}
                  </label>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Click to upload</p>
                  <p>Max 2MB, JPG/PNG</p>
                </div>
              </div>
            </div>
          </div>

          <InputField 
            label="First Name" 
            field="firstName" 
            required 
            value={personal.firstName}
            onChange={(value) => handleInputChange('firstName', value)}
            onBlur={(value) => handleInputBlur('firstName', value)}
            error={errors.firstName}
          />
          <InputField 
            label="Last Name" 
            field="lastName" 
            required 
            value={personal.lastName}
            onChange={(value) => handleInputChange('lastName', value)}
            onBlur={(value) => handleInputBlur('lastName', value)}
            error={errors.lastName}
          />
          <InputField 
            label="Professional Title" 
            field="title" 
            required 
            value={personal.title}
            onChange={(value) => handleInputChange('title', value)}
            onBlur={(value) => handleInputBlur('title', value)}
            error={errors.title}
          />
          <InputField 
            label="Email" 
            field="email" 
            type="email" 
            required 
            value={personal.email}
            onChange={(value) => handleInputChange('email', value)}
            onBlur={(value) => handleInputBlur('email', value)}
            error={errors.email}
          />
          <InputField 
            label="Phone" 
            field="phone" 
            type="tel" 
            value={personal.phone}
            onChange={(value) => handleInputChange('phone', value)}
            onBlur={(value) => handleInputBlur('phone', value)}
            error={errors.phone}
          />
          <InputField 
            label="Website" 
            field="website" 
            type="url" 
            value={personal.website}
            onChange={(value) => handleInputChange('website', value)}
          />
          <InputField 
            label="Address" 
            field="address" 
            value={personal.address}
            onChange={(value) => handleInputChange('address', value)}
          />
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSave}
            className={`flex items-center px-6 py-2 font-medium rounded-lg hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isWeb3Theme
                ? 'bg-web3-accent text-white focus:ring-web3-accent hover:bg-opacity-90'
                : 'bg-pastel-mint text-charcoal focus:ring-pastel-mint'
            }`}
          >
            <Save className="w-5 h-5 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};