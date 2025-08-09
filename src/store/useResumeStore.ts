import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  photoURI: string;
}

export interface Section {
  id: string;
  type: 'Education' | 'Experience' | 'Skills' | 'Projects' | 'Custom';
  title: string;
  content: string;
  data?: any; // Store structured data for forms
}

export interface Template {
  id: string;
  name: string;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  fontSize: {
    heading: number;
    body: number;
  };
  headingStyle: {
    weight: number;
    color: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
}

export interface UISettings {
  themeMode: 'light';
  fontScale: number;
  selectedTemplate: string;
  customColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  customFonts: {
    heading: string;
    body: string;
  };
}

interface ResumeStore {
  personal: PersonalInfo;
  sections: Section[];
  templates: Template[];
  uiSettings: UISettings;
  
  // Personal actions
  setPersonalField: (field: keyof PersonalInfo, value: string) => void;
  
  // Section actions
  addSection: (type: Section['type']) => void;
  removeSection: (id: string) => void;
  moveSection: (fromIndex: number, toIndex: number) => void;
  updateSection: (id: string, updates: Partial<Pick<Section, 'title' | 'content'>>) => void;
  
  // Template actions
  selectTemplate: (templateId: string) => void;
  setFontScale: (scale: number) => void;
  updateCustomColors: (colors: Partial<UISettings['customColors']>) => void;
  updateCustomFonts: (fonts: Partial<UISettings['customFonts']>) => void;
  updateTemplate: (templateId: string, updates: Partial<Template>) => void;
  
  // Data management
  exportData: () => string;
  importData: (data: string) => void;
  resetAll: () => void;
}

const defaultPersonal: PersonalInfo = {
  firstName: '',
  lastName: '',
  title: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  photoURI: '',
};

const defaultTemplates: Template[] = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    margins: { top: 20, bottom: 20, left: 20, right: 20 },
    fontSize: { heading: 24, body: 14 },
    headingStyle: { weight: 600, color: '#333333' },
    colors: {
      primary: '#333333',
      secondary: '#666666',
      accent: '#A3D5FF',
      text: '#333333',
      background: '#ffffff',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
  },
  {
    id: 'modern',
    name: 'Modern',
    margins: { top: 30, bottom: 30, left: 30, right: 30 },
    fontSize: { heading: 28, body: 16 },
    headingStyle: { weight: 700, color: '#A3D5FF' },
    colors: {
      primary: '#A3D5FF',
      secondary: '#B2F2BB',
      accent: '#333333',
      text: '#333333',
      background: '#ffffff',
    },
    fonts: {
      heading: 'Merriweather',
      body: 'Inter',
    },
  },
  {
    id: 'classic',
    name: 'Classic',
    margins: { top: 25, bottom: 25, left: 25, right: 25 },
    fontSize: { heading: 22, body: 12 },
    headingStyle: { weight: 400, color: '#333333' },
    colors: {
      primary: '#333333',
      secondary: '#666666',
      accent: '#8B4513',
      text: '#333333',
      background: '#ffffff',
    },
    fonts: {
      heading: 'Merriweather',
      body: 'Merriweather',
    },
  },
];

const defaultUISettings: UISettings = {
  themeMode: 'light',
  fontScale: 1,
  selectedTemplate: 'minimalist',
  customColors: {
    primary: '#A3D5FF',
    secondary: '#B2F2BB',
    accent: '#333333',
  },
  customFonts: {
    heading: 'Inter',
    body: 'Inter',
  },
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      personal: defaultPersonal,
      sections: [],
      templates: defaultTemplates,
      uiSettings: defaultUISettings,

      setPersonalField: (field, value) =>
        set((state) => ({
          personal: { ...state.personal, [field]: value },
        })),

      addSection: (type) =>
        set((state) => ({
          sections: [
            ...state.sections,
            {
              id: Date.now().toString(),
              type,
              title: type === 'Experience' ? 'Work Experience' : type,
              content: '',
              data: null,
            },
          ],
        })),

      removeSection: (id) =>
        set((state) => ({
          sections: state.sections.filter((section) => section.id !== id),
        })),

      moveSection: (fromIndex, toIndex) =>
        set((state) => {
          const sections = [...state.sections];
          const [removed] = sections.splice(fromIndex, 1);
          sections.splice(toIndex, 0, removed);
          return { sections };
        }),

      updateSection: (id, updates) =>
        set((state) => ({
          sections: state.sections.map((section) =>
            section.id === id ? { ...section, ...updates } : section
          ),
        })),

      selectTemplate: (templateId) =>
        set((state) => ({
          uiSettings: { ...state.uiSettings, selectedTemplate: templateId },
        })),

      setFontScale: (scale) =>
        set((state) => ({
          uiSettings: { ...state.uiSettings, fontScale: scale },
        })),

      updateCustomColors: (colors) =>
        set((state) => ({
          uiSettings: {
            ...state.uiSettings,
            customColors: { ...state.uiSettings.customColors, ...colors },
          },
        })),

      updateCustomFonts: (fonts) =>
        set((state) => ({
          uiSettings: {
            ...state.uiSettings,
            customFonts: { ...state.uiSettings.customFonts, ...fonts },
          },
        })),

      updateTemplate: (templateId, updates) =>
        set((state) => ({
          templates: state.templates.map((template) =>
            template.id === templateId ? { ...template, ...updates } : template
          ),
        })),

      exportData: () => {
        const state = get();
        return JSON.stringify({
          personal: state.personal,
          sections: state.sections,
          uiSettings: state.uiSettings,
        });
      },

      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          set((state) => ({
            ...state,
            personal: parsed.personal || defaultPersonal,
            sections: parsed.sections || [],
            uiSettings: { ...defaultUISettings, ...parsed.uiSettings },
            templates: parsed.templates || defaultTemplates,
          }));
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      },

      resetAll: () =>
        set({
          personal: defaultPersonal,
          sections: [],
          uiSettings: defaultUISettings,
          templates: defaultTemplates,
        }),
    }),
    {
      name: 'resume-forge-storage',
    }
  )
);