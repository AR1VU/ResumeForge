import React, { useState } from 'react';
import { Save, X, Calendar, MapPin, Briefcase } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface ExperienceData {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrentlyWorking: boolean;
  employmentType: string;
}

interface ExperienceFormProps {
  initialData?: ExperienceData;
  onSave: (data: ExperienceData) => void;
  onCancel: () => void;
}

const employmentTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Freelance',
  'Volunteer',
];

export const ExperienceForm: React.FC<ExperienceFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ExperienceData>(
    initialData || {
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      description: '',
      isCurrentlyWorking: false,
      employmentType: 'Full-time',
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.isCurrentlyWorking && !formData.endDate) {
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

  const handleInputChange = (field: keyof ExperienceData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif font-semibold text-charcoal dark:text-off-white flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-pastel-blue" />
          {initialData ? 'Edit Experience' : 'Add Experience'}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Company *
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent ${
              errors.company ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white`}
            placeholder="e.g., Google"
          />
          {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Position *
          </label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent ${
              errors.position ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white`}
            placeholder="e.g., Software Engineer"
          />
          {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Employment Type
          </label>
          <select
            value={formData.employmentType}
            onChange={(e) => handleInputChange('employmentType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            {employmentTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="e.g., San Francisco, CA"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Start Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="month"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent ${
                errors.startDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:bg-gray-700 dark:text-white`}
            />
          </div>
          {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            End Date {!formData.isCurrentlyWorking && '*'}
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="month"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              disabled={formData.isCurrentlyWorking}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent ${
                errors.endDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            />
          </div>
          {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          
          <label className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={formData.isCurrentlyWorking}
              onChange={(e) => handleInputChange('isCurrentlyWorking', e.target.checked)}
              className="mr-2 rounded border-gray-300 text-pastel-blue focus:ring-pastel-blue"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">I am currently working here</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <RichTextEditor
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe your responsibilities, achievements, and key accomplishments in this role..."
          height="200px"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Tip: Use bullet points and quantify your achievements. Format with the toolbar above.
        </p>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
        >
          <X className="w-4 h-4 mr-2 inline" />
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center px-6 py-2 bg-pastel-blue text-charcoal font-medium rounded-lg hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:ring-offset-2"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Experience
        </button>
      </div>
    </form>
  );
};