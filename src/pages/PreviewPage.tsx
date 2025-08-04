import React from 'react';
import { ArrowLeft, Download } from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

export const PreviewPage: React.FC = () => {
  const { personal, sections, templates, uiSettings } = useResumeStore();
  const selectedTemplate = templates.find(t => t.id === uiSettings.selectedTemplate);
  const isWeb3Theme = uiSettings.themeMode === 'web3';

  const exportToPDF = async () => {
    const loadingToast = toast.loading('Generating PDF...');
    
    try {
      const element = document.getElementById('resume-preview');
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const fileName = `ResumeForge_${personal.lastName || 'Resume'}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast.dismiss(loadingToast);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Failed to generate PDF');
      console.error('PDF generation error:', error);
    }
  };

  const formatSkills = (content: string) => {
    try {
      const skills = JSON.parse(content);
      return Array.isArray(skills) ? skills.map(skill => skill.name).join(', ') : content;
    } catch {
      return content;
    }
  };

  const stripHtmlTags = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const formatRichText = (content: string) => {
    // Convert HTML to plain text for PDF, but preserve some basic formatting
    return content
      .replace(/<strong>/g, '')
      .replace(/<\/strong>/g, '')
      .replace(/<em>/g, '')
      .replace(/<\/em>/g, '')
      .replace(/<ul>/g, '')
      .replace(/<\/ul>/g, '')
      .replace(/<li>/g, '• ')
      .replace(/<\/li>/g, '\n')
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '\n')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/&nbsp;/g, ' ')
      .trim();
  };
  return (
    <div className="max-w-6xl mx-auto">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <button
          onClick={() => window.history.back()}
          className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-charcoal dark:hover:text-off-white transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Edit
        </button>
        
        <button
          onClick={exportToPDF}
          className={`flex items-center px-6 py-2 font-medium rounded-lg hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isWeb3Theme
              ? 'bg-web3-accent text-white focus:ring-web3-accent hover:bg-opacity-90'
              : 'bg-pastel-blue text-charcoal focus:ring-pastel-blue'
          }`}
        >
          <Download className="w-5 h-5 mr-2" />
          Export as PDF
        </button>
      </div>

      {/* Resume preview */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
        <div
          id="resume-preview"
          className="print:p-0"
          style={{
            fontSize: `${selectedTemplate?.fontSize.body * uiSettings.fontScale}px`,
            maxWidth: '8.5in',
            margin: '0 auto',
            minHeight: '11in',
          }}
        >
          {/* Two-column layout */}
          <div className="flex min-h-full">
            {/* Left sidebar - Dark */}
            <div className="w-1/3 bg-gray-800 text-white p-8">
              {/* Profile Photo */}
              {personal.photoURI && (
                <div className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white">
                  <img
                    src={personal.photoURI}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {/* About Me Section */}
              {sections.find(s => s.type === 'Custom' && s.title.toLowerCase().includes('about')) && (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-6 h-6 mr-3 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-bold">About Me</h2>
                  </div>
                  <div className="text-sm leading-relaxed text-gray-300">
                    {sections.find(s => s.type === 'Custom' && s.title.toLowerCase().includes('about'))?.content}
                  </div>
                </div>
              )}
              
              {/* Contact Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 mr-3 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold">Contact</h2>
                </div>
                <div className="space-y-3 text-sm">
                  {personal.phone && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <span>{personal.phone}</span>
                    </div>
                  )}
                  {personal.email && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span>{personal.email}</span>
                    </div>
                  )}
                  {personal.address && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{personal.address}</span>
                    </div>
                  )}
                  {personal.website && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.499-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.499.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.497-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                      </svg>
                      <span>{personal.website}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Skills Section */}
              {sections.find(s => s.type === 'Skills') && (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-6 h-6 mr-3 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-bold">Skills</h2>
                  </div>
                  <div className="text-sm">
                    <ul className="space-y-2">
                      {formatSkills(sections.find(s => s.type === 'Skills')?.content || '').split(', ').map((skill, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Languages Section */}
              {sections.find(s => s.title.toLowerCase().includes('language')) && (
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="w-6 h-6 mr-3 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 2a1 1 0 011 1v1h3a1 1 0 110 2H9.578a18.87 18.87 0 01-1.724 4.78c.29.354.596.696.914 1.026a1 1 0 11-1.44 1.389c-.188-.196-.373-.396-.554-.6a19.098 19.098 0 01-3.107 3.567 1 1 0 01-1.334-1.49 17.087 17.087 0 003.13-3.733 18.992 18.992 0 01-1.487-2.494 1 1 0 111.79-.89c.234.47.489.928.764 1.372.417-.934.752-1.913.997-2.927H3a1 1 0 110-2h3V3a1 1 0 011-1zm6 6a1 1 0 01.894.553l2.991 5.982a.869.869 0 01.02.037l.99 1.98a1 1 0 11-1.79.895L15.383 16h-4.764l-.724 1.447a1 1 0 11-1.788-.894l.99-1.98.019-.038 2.99-5.982A1 1 0 0113 8zm-1.382 6h2.764L13 11.236 11.618 14z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-bold">Language</h2>
                  </div>
                  <div className="text-sm space-y-2">
                    {sections.find(s => s.title.toLowerCase().includes('language'))?.content.split('\n').map((lang, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                        {lang.trim()}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Right content area - White */}
            <div className="w-2/3 p-8 bg-white">
              {/* Header with name and title */}
              <header className="mb-8">
                <h1 
                  className="font-bold text-gray-900 mb-2"
                  style={{
                    fontSize: `${(selectedTemplate?.fontSize.heading + 8) * uiSettings.fontScale}px`,
                    fontWeight: 700,
                  }}
                >
                  {personal.firstName} {personal.lastName}
                </h1>
                
                {personal.title && (
                  <p className="text-xl text-gray-600 font-medium">{personal.title}</p>
                )}
              </header>

              {/* Main content sections */}
              <div className="space-y-8">
                {/* Education Section */}
                {sections.filter(s => s.type === 'Education').length > 0 && (
                  <section className="print:break-inside-avoid">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 mr-4 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                    </div>
                    
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                      
                      <div className="space-y-8">
                        {sections.filter(s => s.type === 'Education').map((section, index) => (
                          <div key={section.id} className="relative pl-12">
                            {/* Timeline dot */}
                            <div className="absolute left-2.5 w-3 h-3 bg-gray-700 rounded-full"></div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                               <div dangerouslySetInnerHTML={{ __html: section.content }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}
                
                {/* Experience Section */}
                {sections.filter(s => s.type === 'Experience').length > 0 && (
                  <section className="print:break-inside-avoid">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 mr-4 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h2zm4-3a1 1 0 00-1 1v1h2V4a1 1 0 00-1-1zM4 9v5h12V9H4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
                    </div>
                    
                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                      
                      <div className="space-y-8">
                        {sections.filter(s => s.type === 'Experience').map((section, index) => (
                          <div key={section.id} className="relative pl-12">
                            {/* Timeline dot */}
                            <div className="absolute left-2.5 w-3 h-3 bg-gray-700 rounded-full"></div>
                            
                            <div>
                              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                               <div dangerouslySetInnerHTML={{ __html: section.content }} />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}
                
                {/* Other sections (Projects, Custom, etc.) */}
                {sections.filter(s => !['Skills', 'Education', 'Experience'].includes(s.type) && !s.title.toLowerCase().includes('about') && !s.title.toLowerCase().includes('language')).map((section) => (
                  <section key={section.id} className="print:break-inside-avoid">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <div className="w-8 h-8 mr-4 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      {section.title}
                    </h2>
                    
                    <div className="text-gray-700 leading-relaxed pl-12">
                      <div dangerouslySetInnerHTML={{ __html: section.content }} />
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
          
          {/* Page number */}
          <div className="text-center text-xs text-gray-400 mt-8 print:fixed print:bottom-4 print:right-4">
            Page 1
          </div>
        </div>
      </div>
    </div>
  );
};