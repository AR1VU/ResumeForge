import React, { useState } from 'react';
import { Save, X, FileText } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface CustomSectionData {
  title: string;
  content: string;
}

interface CustomSectionFormProps {
  initialData?: CustomSectionData;
  onSave: (data: CustomSectionData) => void;
  onCancel: () => void;
}

export const CustomSectionForm: React.FC<CustomSectionFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CustomSectionData>(
    initialData || {
      title: '',
      content: '',
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Section title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: keyof CustomSectionData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const sectionSuggestions = [
    'Certifications',
    'Awards & Honors',
    'Publications',
    'Languages',
    'Volunteer Experience',
    'Professional Associations',
    'Interests & Hobbies',
    'References',
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif font-semibold text-charcoal dark:text-off-white flex items-center">
          <FileText className="w-5 h-5 mr-2 text-pastel-blue" />
          {initialData ? 'Edit Custom Section' : 'Add Custom Section'}
        </h3>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Section Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent ${
            errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } dark:bg-gray-700 dark:text-white`}
          placeholder="e.g., Certifications"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        
        <div className="mt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Popular section ideas:</p>
          <div className="flex flex-wrap gap-2">
            {sectionSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleInputChange('title', suggestion)}
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-pastel-blue hover:text-charcoal transition-colors duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Content *
        </label>
        <RichTextEditor
          value={formData.content}
          onChange={(value) => handleInputChange('content', value)}
          placeholder="Enter the content for this section..."
          height="250px"
        />
        {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Use the toolbar above to format your text with bold, italics, lists, and more
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
          Save Section
        </button>
      </div>
    </form>
  );
};