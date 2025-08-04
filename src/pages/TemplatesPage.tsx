import React from 'react';
import { Check, Palette, Type, Layout } from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import { ColorPicker } from '../components/ColorPicker';
import { FontSelector } from '../components/FontSelector';

export const TemplatesPage: React.FC = () => {
  const { 
    templates, 
    uiSettings, 
    selectTemplate, 
    setFontScale, 
    updateCustomColors, 
    updateCustomFonts,
    updateTemplate 
  } = useResumeStore();
  const isWeb3Theme = uiSettings.themeMode === 'web3';
  const selectedTemplate = templates.find(t => t.id === uiSettings.selectedTemplate);

  const TemplateThumbnail: React.FC<{ template: any; isSelected: boolean }> = ({
    template,
    isSelected,
  }) => (
    <div
      className={`relative p-4 border-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected
          ? 'border-pastel-mint shadow-lg'
          : 'border-gray-200 dark:border-gray-600 hover:border-pastel-blue'
      }`}
      onClick={() => selectTemplate(template.id)}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-pastel-mint rounded-full flex items-center justify-center">
          <Check className="w-4 h-4 text-charcoal" />
        </div>
      )}
      
      {/* Template preview SVG */}
      <div className="w-full h-48 bg-gray-50 dark:bg-gray-700 rounded border mb-4">
        <svg viewBox="0 0 200 240" className="w-full h-full">
          {/* Header */}
          <rect x="20" y="20" width="160" height="30" fill="#A3D5FF" rx="4" />
          <rect x="30" y="30" width="40" height="10" fill="white" rx="2" />
          
          {/* Content sections */}
          <rect x="20" y="70" width="160" height="8" fill="#333333" rx="2" />
          <rect x="20" y="85" width="120" height="4" fill="#666666" rx="1" />
          <rect x="20" y="95" width="140" height="4" fill="#666666" rx="1" />
          
          <rect x="20" y="115" width="160" height="8" fill="#333333" rx="2" />
          <rect x="20" y="130" width="100" height="4" fill="#666666" rx="1" />
          <rect x="20" y="140" width="130" height="4" fill="#666666" rx="1" />
          
          <rect x="20" y="160" width="160" height="8" fill="#333333" rx="2" />
          <rect x="20" y="175" width="80" height="4" fill="#666666" rx="1" />
          <rect x="20" y="185" width="110" height="4" fill="#666666" rx="1" />
        </svg>
      </div>
      
      <h3 className="font-serif font-semibold text-lg text-charcoal dark:text-off-white">
        {template.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {template.fontSize?.heading || 'N/A'}px headings, {template.fontSize?.body || 'N/A'}px body
      </p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className={`rounded-lg shadow-lg p-8 ${
        isWeb3Theme 
          ? 'bg-web3-dark border border-web3-border' 
          : 'bg-white dark:bg-gray-800'
      }`}>
        <h2 className={`text-2xl font-serif font-bold mb-8 ${
          isWeb3Theme ? 'text-web3-text' : 'text-charcoal dark:text-off-white'
        }`}>
          Choose Template
        </h2>
        
        {/* Template grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {templates.map((template) => (
            <TemplateThumbnail
              key={template.id}
              template={template}
              isSelected={uiSettings.selectedTemplate === template.id}
            />
          ))}
        </div>
        
        {/* Style controls */}
        <div className={`border-t pt-8 ${
          isWeb3Theme ? 'border-web3-border' : 'border-gray-200 dark:border-gray-700'
        }`}>
          <h3 className={`text-lg font-serif font-semibold mb-8 ${
            isWeb3Theme ? 'text-web3-text' : 'text-charcoal dark:text-off-white'
          }`}>
            Customize Style
          </h3>
          
          <div className="space-y-8">
            {/* Typography Section */}
            <div className={`p-6 rounded-lg ${
              isWeb3Theme ? 'bg-web3-gray' : 'bg-gray-50 dark:bg-gray-700'
            }`}>
              <h4 className={`text-md font-semibold mb-4 flex items-center ${
                isWeb3Theme ? 'text-web3-text' : 'text-charcoal dark:text-off-white'
              }`}>
                <Type className="w-5 h-5 mr-2" />
                Typography
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Font scale slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Font Size Scale: {Math.round(uiSettings.fontScale * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.8"
                    max="1.4"
                    step="0.1"
                    value={uiSettings.fontScale}
                    onChange={(e) => setFontScale(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>80%</span>
                    <span>140%</span>
                  </div>
                </div>
                
                {/* Heading Font */}
                <FontSelector
                  label="Heading Font"
                  value={uiSettings.customFonts.heading}
                  onChange={(font) => updateCustomFonts({ heading: font })}
                />
                
                {/* Body Font */}
                <FontSelector
                  label="Body Font"
                  value={uiSettings.customFonts.body}
                  onChange={(font) => updateCustomFonts({ body: font })}
                />
              </div>
            </div>
            
            {/* Colors Section */}
            <div className={`p-6 rounded-lg ${
              isWeb3Theme ? 'bg-web3-gray' : 'bg-gray-50 dark:bg-gray-700'
            }`}>
              <h4 className={`text-md font-semibold mb-4 flex items-center ${
                isWeb3Theme ? 'text-web3-text' : 'text-charcoal dark:text-off-white'
              }`}>
                <Palette className="w-5 h-5 mr-2" />
                Color Scheme
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ColorPicker
                  label="Primary Color"
                  value={uiSettings.customColors.primary}
                  onChange={(color) => updateCustomColors({ primary: color })}
                />
                
                <ColorPicker
                  label="Secondary Color"
                  value={uiSettings.customColors.secondary}
                  onChange={(color) => updateCustomColors({ secondary: color })}
                />
                
                <ColorPicker
                  label="Accent Color"
                  value={uiSettings.customColors.accent}
                  onChange={(color) => updateCustomColors({ accent: color })}
                />
              </div>
            </div>
            
            {/* Layout Section */}
            {selectedTemplate && (
              <div className={`p-6 rounded-lg ${
                isWeb3Theme ? 'bg-web3-gray' : 'bg-gray-50 dark:bg-gray-700'
              }`}>
                <h4 className={`text-md font-semibold mb-4 flex items-center ${
                  isWeb3Theme ? 'text-web3-text' : 'text-charcoal dark:text-off-white'
                }`}>
                  <Layout className="w-5 h-5 mr-2" />
                  Layout & Spacing
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Top Margin
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="50"
                      value={selectedTemplate.margins.top}
                      onChange={(e) => updateTemplate(selectedTemplate.id, {
                        margins: { ...selectedTemplate.margins, top: parseInt(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-pastel-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Bottom Margin
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="50"
                      value={selectedTemplate.margins.bottom}
                      onChange={(e) => updateTemplate(selectedTemplate.id, {
                        margins: { ...selectedTemplate.margins, bottom: parseInt(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-pastel-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Left Margin
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="50"
                      value={selectedTemplate.margins.left}
                      onChange={(e) => updateTemplate(selectedTemplate.id, {
                        margins: { ...selectedTemplate.margins, left: parseInt(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-pastel-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Right Margin
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="50"
                      value={selectedTemplate.margins.right}
                      onChange={(e) => updateTemplate(selectedTemplate.id, {
                        margins: { ...selectedTemplate.margins, right: parseInt(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-pastel-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Heading Font Size
                    </label>
                    <input
                      type="number"
                      min="16"
                      max="36"
                      value={selectedTemplate.fontSize?.heading || 24}
                      onChange={(e) => updateTemplate(selectedTemplate.id, {
                        fontSize: { ...selectedTemplate.fontSize || {}, heading: parseInt(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-pastel-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Body Font Size
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="18"
                      value={selectedTemplate.fontSize?.body || 12}
                      onChange={(e) => updateTemplate(selectedTemplate.id, {
                        fontSize: { ...selectedTemplate.fontSize || {}, body: parseInt(e.target.value) }
                      })}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-pastel-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};