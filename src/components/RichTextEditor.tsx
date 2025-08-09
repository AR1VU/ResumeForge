import React, { useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Enter your content...",
  height = "200px"
}) => {
  const quillRef = useRef<ReactQuill>(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'list', 'bullet',
    'link'
  ];

  return (
    <div className="rich-text-editor">
      <style>{`
        .rich-text-editor .ql-editor {
          min-height: ${height};
          font-family: 'Inter', sans-serif;
          color: #111827;
          background-color: #ffffff;
        }
        .rich-text-editor .ql-toolbar {
          border-top: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-radius: 0.5rem 0.5rem 0 0;
          background-color: #ffffff;
        }
        .rich-text-editor .ql-container {
          border-bottom: 1px solid #e5e7eb;
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
          border-radius: 0 0 0.5rem 0.5rem;
          background-color: #ffffff;
        }
        .rich-text-editor .ql-stroke {
          stroke: #6b7280;
        }
        .rich-text-editor .ql-fill {
          fill: #6b7280;
        }
        .rich-text-editor .ql-picker-label {
          color: #111827;
        }
        .rich-text-editor .ql-picker-options {
          background-color: #ffffff;
          border: 1px solid #e5e7eb;
        }
        .rich-text-editor .ql-picker-item {
          color: #111827;
        }
        .rich-text-editor .ql-picker-item:hover {
          background-color: #f3f4f6;
        }
      `}</style>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
    </div>
  );
};