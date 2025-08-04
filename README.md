# Resume Forge

A modern, offline-capable resume builder built with React, TypeScript, and Tailwind CSS. Create beautiful, professional resumes with drag-and-drop functionality, multiple templates, and PDF export capabilities.

## Features

### 🎨 **Beautiful Templates**
- Three professionally designed templates (Minimalist, Modern, Classic)
- Customizable typography and color schemes
- Real-time preview with live editing

### 📱 **Progressive Web App (PWA)**
- Offline functionality with service worker caching
- Installable on desktop and mobile devices
- Works without internet connection

### 🎯 **Intuitive Interface**
- Drag-and-drop section reordering
- Rich skills editor with color-coded tags
- Responsive design for all screen sizes
- Dark/light theme support

### 📄 **Professional Output**
- High-quality PDF export with multi-page support
- Print-optimized layouts
- Customizable font sizes and spacing

### 💾 **Data Management**
- Automatic localStorage persistence
- Export/import resume data as JSON
- Real-time validation and error handling

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/resume-forge.git
cd resume-forge
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## Usage

### 📝 **Personal Information**
- Fill in your basic details (name, email, phone, etc.)
- Upload a profile photo (max 2MB, JPG/PNG)
- Real-time validation ensures data accuracy

### 📚 **Managing Sections**
- Add sections for Education, Experience, Skills, Projects, or Custom content
- Drag and drop to reorder sections
- Rich text editing with word count tracking

### 🏷️ **Skills Management**
- Specialized skills editor with tag-based input
- Color-coded skill pills with drag-and-drop reordering
- Choose from predefined color palette

### 🎨 **Template Selection**
- Choose from three professional templates
- Adjust font scale (80%-140%)
- Customize heading styles and colors

### 📋 **Preview & Export**
- Real-time preview of your resume
- Multi-page layout support
- Export as high-quality PDF
- Print-optimized styling

### ⚙️ **Settings**
- Toggle between light/dark themes
- Export/import resume data for backup
- Reset all data with confirmation
- Accessibility features and keyboard navigation

## Technology Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS with custom theme
- **State Management**: Zustand with persistence
- **Drag & Drop**: @dnd-kit
- **PDF Generation**: html2canvas + jsPDF
- **Build Tool**: Vite
- **PWA**: Service Worker with caching strategy

## Accessibility

Resume Forge is built with accessibility in mind:

- ✅ Full keyboard navigation support
- ✅ ARIA labels and semantic HTML
- ✅ High contrast color schemes
- ✅ Screen reader compatibility
- ✅ Focus management and skip links

## Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Icons by [Lucide React](https://lucide.dev/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- UI inspiration from modern design systems

---

Built with ❤️ using React, TypeScript, and Tailwind CSS