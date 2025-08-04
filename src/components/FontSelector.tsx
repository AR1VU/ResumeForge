import React, { useState } from 'react';
import { Type, ChevronDown } from 'lucide-react';

interface FontSelectorProps {
  label: string;
  value: string;
  onChange: (font: string) => void;
}

const availableFonts = [
  { name: 'Inter', family: 'Inter, sans-serif', category: 'Sans Serif' },
  { name: 'Merriweather', family: 'Merriweather, serif', category: 'Serif' },
  { name: 'Roboto', family: 'Roboto, sans-serif', category: 'Sans Serif' },
  { name: 'Open Sans', family: 'Open Sans, sans-serif', category: 'Sans Serif' },
  { name: 'Lato', family: 'Lato, sans-serif', category: 'Sans Serif' },
  { name: 'Montserrat', family: 'Montserrat, sans-serif', category: 'Sans Serif' },
  { name: 'Playfair Display', family: 'Playfair Display, serif', category: 'Serif' },
  { name: 'Source Sans Pro', family: 'Source Sans Pro, sans-serif', category: 'Sans Serif' },
  { name: 'Crimson Text', family: 'Crimson Text, serif', category: 'Serif' },
  { name: 'Nunito', family: 'Nunito, sans-serif', category: 'Sans Serif' },
];

export const FontSelector: React.FC<FontSelectorProps> = ({
  label,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedFont = availableFonts.find(font => font.name === value) || availableFonts[0];

  const handleFontSelect = (fontName: string) => {
    onChange(fontName);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <div className="flex items-center space-x-2">
          <Type className="w-4 h-4 text-gray-500" />
          <span 
            className="text-sm text-gray-700 dark:text-gray-300"
            style={{ fontFamily: selectedFont.family }}
          >
            {selectedFont.name}
          </span>
          <span className="text-xs text-gray-500">({selectedFont.category})</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 max-h-64 overflow-y-auto">
          {availableFonts.map((font) => (
            <button
              key={font.name}
              type="button"
              onClick={() => handleFontSelect(font.name)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                value === font.name ? 'bg-pastel-blue bg-opacity-20' : ''
              }`}
            >
              <div>
                <div 
                  className="text-sm font-medium text-gray-900 dark:text-gray-100"
                  style={{ fontFamily: font.family }}
                >
                  {font.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {font.category}
                </div>
              </div>
              <div 
                className="text-xs text-gray-600 dark:text-gray-400"
                style={{ fontFamily: font.family }}
              >
                Aa
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};