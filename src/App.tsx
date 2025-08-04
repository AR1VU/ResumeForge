import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Sidebar } from './components/Sidebar';
import { PersonalInfoPage } from './pages/PersonalInfoPage';
import { SectionsPage } from './pages/SectionsPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { PreviewPage } from './pages/PreviewPage';
import { SettingsPage } from './pages/SettingsPage';
import { useResumeStore } from './store/useResumeStore';

function App() {
  const [currentPage, setCurrentPage] = useState('personal');
  const { uiSettings } = useResumeStore();

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'web3');
    if (uiSettings.themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (uiSettings.themeMode === 'web3') {
      document.documentElement.classList.add('web3');
    }
  }, [uiSettings.themeMode]);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'personal':
        return <PersonalInfoPage />;
      case 'sections':
        return <SectionsPage />;
      case 'templates':
        return <TemplatesPage />;
      case 'preview':
        return <PreviewPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <PersonalInfoPage />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      uiSettings.themeMode === 'web3' 
        ? 'bg-web3-darker' 
        : 'bg-off-white dark:bg-gray-900'
    }`}>
      <div className="flex">
        <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        
        <main className="flex-1 lg:ml-80">
          <div className="container mx-auto px-6 py-8 pt-16 lg:pt-8">
            <a
              href="#main-content"
              className={`sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 px-4 py-2 rounded-lg z-50 ${
                uiSettings.themeMode === 'web3'
                  ? 'bg-web3-accent text-white'
                  : 'bg-pastel-blue text-charcoal'
              }`}
            >
              Skip to main content
            </a>
            
            <div id="main-content" role="main" aria-live="polite">
              {renderCurrentPage()}
            </div>
          </div>
        </main>
      </div>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: uiSettings.themeMode === 'web3' ? '#2a2d3a' : uiSettings.themeMode === 'dark' ? '#374151' : '#ffffff',
            color: uiSettings.themeMode === 'web3' ? '#e2e8f0' : uiSettings.themeMode === 'dark' ? '#f9fafb' : '#111827',
            border: '1px solid #e5e7eb',
          },
          success: {
            iconTheme: {
              primary: uiSettings.themeMode === 'web3' ? '#10b981' : '#B2F2BB',
              secondary: uiSettings.themeMode === 'web3' ? '#1a1b23' : '#333333',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: uiSettings.themeMode === 'web3' ? '#1a1b23' : '#ffffff',
            },
          },
        }}
      />
    </div>
  );
}

export default App;