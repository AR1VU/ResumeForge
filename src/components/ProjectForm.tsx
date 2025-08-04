import React, { useState } from 'react';
import { Save, X, Calendar, ExternalLink, Code, Github } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';

interface ProjectData {
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate: string;
  projectUrl: string;
  githubUrl: string;
  isOngoing: boolean;
}

interface ProjectFormProps {
  initialData?: ProjectData;
  onSave: (data: ProjectData) => void;
  onCancel: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ProjectData>(
    initialData || {
      name: '',
      description: '',
      technologies: [],
      startDate: '',
      endDate: '',
      projectUrl: '',
      githubUrl: '',
      isOngoing: false,
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [techInput, setTechInput] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.isOngoing && !formData.endDate) {
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

  const handleInputChange = (field: keyof ProjectData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      handleInputChange('technologies', [...formData.technologies, techInput.trim()]);
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    handleInputChange('technologies', formData.technologies.filter(t => t !== tech));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-serif font-semibold text-charcoal dark:text-off-white flex items-center">
          <Code className="w-5 h-5 mr-2 text-pastel-blue" />
          {initialData ? 'Edit Project' : 'Add Project'}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Project Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent ${
              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } dark:bg-gray-700 dark:text-white`}
            placeholder="e.g., E-commerce Platform"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
            End Date {!formData.isOngoing && '*'}
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="month"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              disabled={formData.isOngoing}
              className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent ${
                errors.endDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            />
          </div>
          {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          
          <label className="flex items-center mt-2">
            <input
              type="checkbox"
              checked={formData.isOngoing}
              onChange={(e) => handleInputChange('isOngoing', e.target.checked)}
              className="mr-2 rounded border-gray-300 text-pastel-blue focus:ring-pastel-blue"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">This is an ongoing project</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Project URL
          </label>
          <div className="relative">
            <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="url"
              value={formData.projectUrl}
              onChange={(e) => handleInputChange('projectUrl', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="https://myproject.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            GitHub URL
          </label>
          <div className="relative">
            <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="url"
              value={formData.githubUrl}
              onChange={(e) => handleInputChange('githubUrl', e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="https://github.com/username/project"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Technologies Used
        </label>
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTechnology();
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Add a technology (e.g., React, Node.js)"
          />
          <button
            type="button"
            onClick={addTechnology}
            className="px-4 py-2 bg-pastel-blue text-charcoal rounded-lg hover:scale-105 transition-transform duration-150"
          >
            Add
          </button>
        </div>
        
        {formData.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((tech, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-pastel-mint text-charcoal"
              >
                {tech}
                <button
                  type="button"
                  onClick={() => removeTechnology(tech)}
                  className="ml-2 hover:text-red-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description *
        </label>
        <RichTextEditor
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Describe the project, your role, challenges faced, and key achievements..."
          height="200px"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Tip: Highlight the problem you solved and the impact of your work. Use formatting for better readability.
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
          Save Project
        </button>
      </div>
    </form>
  );
};