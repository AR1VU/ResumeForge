import React, { useRef } from 'react';
import { Moon, Sun, Download, Upload, RotateCcw, AlertTriangle, Hexagon } from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const { uiSettings, setThemeMode, exportData, importData, resetAll } = useResumeStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportData = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume-forge-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully!');
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result as string;
        importData(data);
        toast.success('Data imported successfully!');
      } catch (error) {
        toast.error('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      resetAll();
      toast.success('All data has been reset.');
    }
  };

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'web3'] as const;
    const currentIndex = themes.indexOf(uiSettings.themeMode);
    const nextIndex = (currentIndex + 1) % themes.length;
    setThemeMode(themes[nextIndex]);
  };

  const SettingCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({
    title,
    description,
    children,
  }) => (
    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-serif font-semibold text-lg text-charcoal dark:text-off-white mb-2">
            {title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            {description}
          </p>
        </div>
        <div className="ml-4">
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`rounded-lg shadow-lg p-8 ${
        uiSettings.themeMode === 'web3' 
          ? 'bg-web3-dark border border-web3-border' 
          : 'bg-white dark:bg-gray-800'
      }`}>
        <h2 className={`text-2xl font-serif font-bold mb-8 ${
          uiSettings.themeMode === 'web3' ? 'text-web3-text' : 'text-charcoal dark:text-off-white'
        }`}>
          Settings
        </h2>
        
        <div className="space-y-6">
          
          {/* Export Data */}
          <SettingCard
            title="Export Resume Data"
            description="Download all your resume data as a JSON file for backup"
          >
            <button
              onClick={handleExportData}
              className="flex items-center px-4 py-2 bg-pastel-mint text-charcoal rounded-lg hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-pastel-mint focus:ring-offset-2"
            >
              <Download className="w-5 h-5 mr-2" />
              Export Data
            </button>
          </SettingCard>

          {/* Import Data */}
          <SettingCard
            title="Import Resume Data" 
            description="Restore your resume data from a previously exported JSON file"
          >
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center px-4 py-2 bg-pastel-blue text-charcoal rounded-lg hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-pastel-blue focus:ring-offset-2"
              >
                <Upload className="w-5 h-5 mr-2" />
                Import Data
              </button>
            </div>
          </SettingCard>

          {/* Reset All */}
          <SettingCard
            title="Reset All Data"
            description="Clear all resume data and return to default settings. This action cannot be undone."
          >
            <button
              onClick={handleReset}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:scale-105 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Reset All
            </button>
          </SettingCard>
        </div>

        {/* Accessibility Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
          <h3 className="text-lg font-serif font-semibold text-charcoal dark:text-off-white mb-4">
            Accessibility
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-charcoal dark:text-off-white mb-2">
                Keyboard Navigation
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Use Tab to navigate, Enter to select, and Escape to close modals.
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-charcoal dark:text-off-white mb-2">
                Screen Reader Support
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All interactive elements include proper ARIA labels and descriptions.
              </p>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8 text-center">
          <h3 className="font-serif font-semibold text-charcoal dark:text-off-white mb-2">
            Resume Forge v1.0.0
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Professional resume builder with offline support and beautiful templates.
          </p>
        </div>
      </div>
    </div>
  );
};