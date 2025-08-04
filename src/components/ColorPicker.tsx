import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presetColors?: string[];
}

const defaultPresetColors = [
  '#A3D5FF', // pastel-blue
  '#B2F2BB', // pastel-mint
  '#FFB3BA', // pastel-pink
  '#FFFFBA', // pastel-yellow
  '#BAE1FF', // light-blue
  '#FFDFBA', // pastel-orange
  '#6366f1', // indigo
  '#8b5cf6', // purple
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#333333', // dark gray
  '#666666', // medium gray
  '#8B4513', // saddle brown
  '#2563eb', // blue
  '#dc2626', // red
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  value,
  onChange,
  presetColors = defaultPresetColors,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);

  const handlePresetColorSelect = (color: string) => {
    onChange(color);
    setCustomColor(color);
    setIsOpen(false);
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    onChange(color);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <div
          className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
          style={{ backgroundColor: value }}
        />
        <Palette className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-700 dark:text-gray-300">{value}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 min-w-64">
          <div className="space-y-4">
            {/* Preset Colors */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preset Colors
              </h4>
              <div className="grid grid-cols-8 gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handlePresetColorSelect(color)}
                    className="relative w-8 h-8 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform duration-150"
                    style={{ backgroundColor: color }}
                  >
                    {value === color && (
                      <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-sm" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Color Input */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Color
              </h4>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="w-12 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-pastel-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="#000000"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};