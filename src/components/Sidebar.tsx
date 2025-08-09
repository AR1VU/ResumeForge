import React, { useState } from 'react';
import { Menu, X, FileText, User, Folder, Palette, Eye, Settings, Hexagon } from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navigationItems = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'sections', label: 'Sections', icon: Folder },
  { id: 'preview', label: 'Preview', icon: Eye },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { uiSettings } = useResumeStore();
  const isWeb3Theme = uiSettings.themeMode === 'web3';

  const toggleSidebar = () => setIsOpen(!isOpen);

  const NavContent = () => (
    <div className={`flex flex-col h-full ${isWeb3Theme ? 'bg-web3-dark border-web3-border' : ''}`}>
      {/* Logo */}
      <div className={`p-6 border-b ${isWeb3Theme ? 'border-web3-border' : 'border-gray-200 dark:border-gray-700'}`}>
        <div className="flex items-center">
          {isWeb3Theme ? (
            <Hexagon className="w-8 h-8 text-web3-accent mr-3" />
          ) : (
            <FileText className="w-8 h-8 text-pastel-blue mr-3" />
          )}
          <h1 className={`text-xl font-serif font-bold ${
            isWeb3Theme ? 'text-web3-text' : 'text-charcoal dark:text-off-white'
          }`}>
            Resume <span className={`border-b-2 ${
              isWeb3Theme ? 'border-web3-accent' : 'border-pastel-blue'
            }`}>Forge</span>
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    onNavigate(item.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? isWeb3Theme 
                        ? 'bg-web3-accent bg-opacity-20 text-web3-accent font-medium border border-web3-accent border-opacity-30'
                        : 'bg-pastel-mint text-charcoal font-medium'
                      : isWeb3Theme
                        ? 'text-web3-text-muted hover:bg-web3-gray hover:text-web3-text'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-80 lg:flex-col lg:fixed lg:inset-y-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <NavContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          <aside className="relative flex flex-col w-80 bg-white dark:bg-gray-900 animate-slide-in">
            <NavContent />
          </aside>
        </div>
      )}
    </>
  );
};
