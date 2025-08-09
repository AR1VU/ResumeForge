import React, { useState } from 'react';
import { Save, X, Calendar, MapPin, GraduationCap } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface EducationData {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  location: string;
  gpa: string;
  description: string;
  isCurrentlyStudying: boolean;
}

interface EducationFormProps {
  initialData?: EducationData;
  onSave: (data: EducationData) => void;
  onCancel: () => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<EducationData>(
    initialData || {
      school: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      location: '',
      gpa: '',
      description: '',
      isCurrentlyStudying: false,
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.school.trim()) newErrors.school = 'School name is required';
    if (!formData.degree.trim()) newErrors.degree = 'Degree is required';
    if (!formData.fieldOfStudy.trim()) newErrors.fieldOfStudy = 'Field of study is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.isCurrentlyStudying && !formData.endDate) {
      newErrors.endDate = 'End date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: keyof EducationData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif font-semibold text-charcoal flex items-center">
          <GraduationCap className="w-5 h-5 mr-2 text-pastel-blue" />
          {initialData ? 'Edit Education' : 'Add Education'}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${
            isWeb3Theme ? 'text-web3-text' : 'text-gray-700 dark:text-gray-300'
          }`}>
            School/University *
          </label>
          <input
            type="text"
            value={formData.school}
            onChange={(e) => handleInputChange('school', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent ${
              errors.school ? 'border-red-500' : isWeb3Theme 
                ? 'border-web3-border bg-web3-gray text-web3-text' 
                : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            }`}
            placeholder="e.g., Harvard University"
          />
          {errors.school && <p className="text-red-500 text-sm mt-1">{errors.school}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${
            isWeb3Theme ? 'text-web3-text' : 'text-gray-700 dark:text-gray-300'
          }`}>
            Degree *
          </label>
          <input
            type="text"
            value={formData.degree}
            onChange={(e) => handleInputChange('degree', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent ${
              errors.degree ? 'border-red-500' : isWeb3Theme 
                ? 'border-web3-border bg-web3-gray text-web3-text' 
                : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            }`}
            placeholder="e.g., Bachelor of Science"
          />
          {errors.degree && <p className="text-red-500 text-sm mt-1">{errors.degree}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${
            isWeb3Theme ? 'text-web3-text' : 'text-gray-700 dark:text-gray-300'
          }`}>
            Field of Study *
          </label>
          <input
            type="text"
            value={formData.fieldOfStudy}
            onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent ${
              errors.fieldOfStudy ? 'border-red-500' : isWeb3Theme 
                ? 'border-web3-border bg-web3-gray text-web3-text' 
                : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            }`}
            placeholder="e.g., Computer Science"
          />
          {errors.fieldOfStudy && <p className="text-red-500 text-sm mt-1">{errors.fieldOfStudy}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${
            isWeb3Theme ? 'text-web3-text' : 'text-gray-700 dark:text-gray-300'
          }`}>
            Location
          </label>
          <div className="relative">
            <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isWeb3Theme ? 'text-web3-text-muted' : 'text-gray-400'
            }`} />
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent ${
                isWeb3Theme 
                  ? 'border-web3-border bg-web3-gray text-web3-text' 
                  : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              }`}
              placeholder="e.g., Boston, MA"
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${
            isWeb3Theme ? 'text-web3-text' : 'text-gray-700 dark:text-gray-300'
          }`}>
            Start Date *
          </label>
          <div className="relative">
            <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isWeb3Theme ? 'text-web3-text-muted' : 'text-gray-400'
            }`} />
            <input
              type="month"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent ${
                errors.startDate ? 'border-red-500' : isWeb3Theme 
                  ? 'border-web3-border bg-web3-gray text-web3-text' 
                  : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              }`}
            />
          </div>
          {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${
            isWeb3Theme ? 'text-web3-text' : 'text-gray-700 dark:text-gray-300'
          }`}>
            End Date {!formData.isCurrentlyStudying && '*'}
          </label>
          <div className="relative">
            <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isWeb3Theme ? 'text-web3-text-muted' : 'text-gray-400'
            }`} />
            <input
              type="month"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              disabled={formData.isCurrentlyStudying}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${
                errors.endDate ? 'border-red-500' : isWeb3Theme 
                  ? 'border-web3-border bg-web3-gray text-web3-text' 
                  : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
              }`}
            />
          </div>
          {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          
          <label className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={formData.isCurrentlyStudying}
              onChange={(e) => handleInputChange('isCurrentlyStudying', e.target.checked)}
              className="mr-2 rounded border-gray-300 text-pastel-blue focus:ring-pastel-blue"
            />
            <span className={`text-sm ${
              isWeb3Theme ? 'text-web3-text-muted' : 'text-gray-600 dark:text-gray-400'
            }`}>I am currently studying here</span>
          </label>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${
            isWeb3Theme ? 'text-web3-text' : 'text-gray-700 dark:text-gray-300'
          }`}>
            GPA (Optional)
          </label>
          <input
            type="text"
            value={formData.gpa}
            onChange={(e) => handleInputChange('gpa', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent ${
              isWeb3Theme 
                ? 'border-web3-border bg-web3-gray text-web3-text' 
                : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
            }`}
            placeholder="e.g., 3.8/4.0"
          />
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${
          isWeb3Theme ? 'text-web3-text' : 'text-gray-700 dark:text-gray-300'
        }`}>
          Description (Optional)
        </label>
        <RichTextEditor
          value={formData.description}
          onChange={(value) => handleInputChange('description', value)}
          placeholder="Describe your achievements, relevant coursework, activities, etc."
          height="150px"
        />
      </div>

      <div className={`flex justify-end space-x-3 pt-4 border-t ${
        isWeb3Theme ? 'border-web3-border' : 'border-gray-200 dark:border-gray-700'
      }`}>
        <button
          type="button"
          onClick={onCancel}
          className={`px-4 py-2 transition-colors duration-200 ${
            isWeb3Theme 
              ? 'text-web3-text-muted hover:text-web3-text' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <X className="w-4 h-4 mr-2 inline" />
          Cancel
        </button>
        <button
          type="submit"
          className={`flex items-center px-6 py-2 font-medium rounded-lg hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isWeb3Theme 
              ? 'bg-web3-accent text-white focus:ring-web3-accent' 
              : 'bg-pastel-blue text-charcoal focus:ring-pastel-blue'
          }`}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Education
        </button>
      </div>
    </form>
  );
};