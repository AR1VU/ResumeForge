import React, { useState } from 'react';
import { Plus, GripVertical, Edit2, Trash2, BookOpen, Briefcase, Award, Code, FileText, Calendar, MapPin, ExternalLink } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useResumeStore, Section } from '../store/useResumeStore';
import { SkillsEditor } from '../components/SkillsEditor';
import { EducationForm } from '../components/EducationForm';
import { ExperienceForm } from '../components/ExperienceForm';
import { ProjectForm } from '../components/ProjectForm';
import { CustomSectionForm } from '../components/CustomSectionForm';

const sectionIcons = {
  Education: BookOpen,
  Experience: Briefcase,
  Skills: Award,
  Projects: Code,
  Custom: FileText,
};

const SectionCard: React.FC<{ section: Section; onUpdate: (id: string, updates: Partial<Section>) => void; onRemove: (id: string) => void }> = ({
  section,
  onUpdate,
  onRemove,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [localTitle, setLocalTitle] = useState(section.title);
  const [localContent, setLocalContent] = useState(section.content);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = sectionIcons[section.type];

  const handleTitleSave = () => {
    onUpdate(section.id, { title: localTitle });
    setIsEditing(false);
  };

  const handleContentChange = (content: string) => {
    setLocalContent(content);
    onUpdate(section.id, { content });
  };

  const handleFormSave = (data: any) => {
    let formattedContent = '';
    
    switch (section.type) {
      case 'Education':
        formattedContent = `<div class="education-entry">
  <div class="education-header">
    <strong>${data.degree} in ${data.fieldOfStudy}</strong>
  </div>
  <div class="education-school">${data.school}${data.location ? `, ${data.location}` : ''}</div>
  <div class="education-dates">${data.startDate} - ${data.isCurrentlyStudying ? 'Present' : data.endDate}</div>
  ${data.gpa ? `<div class="education-gpa">GPA: ${data.gpa}</div>` : ''}
  ${data.description ? `<div class="education-description">${data.description}</div>` : ''}
</div>`;
        break;
      case 'Experience':
        formattedContent = `<div class="experience-entry">
  <div class="experience-header">
    <strong>${data.position}</strong>
  </div>
  <div class="experience-company">${data.company}${data.location ? `, ${data.location}` : ''}</div>
  <div class="experience-dates">${data.startDate} - ${data.isCurrentlyWorking ? 'Present' : data.endDate} • ${data.employmentType}</div>
  ${data.description ? `<div class="experience-description">${data.description}</div>` : ''}
</div>`;
        break;
      case 'Projects':
        formattedContent = `<div class="project-entry">
  <div class="project-header">
    <strong style="color: #fff">${data.name}</strong>
  </div>
  <div class="project-dates">${data.startDate} - ${data.isOngoing ? 'Ongoing' : data.endDate}</div>
  ${data.technologies.length > 0 ? `<div class="project-technologies">Technologies: ${data.technologies.join(', ')}</div>` : ''}
  ${data.projectUrl ? `<div class="project-url">Project URL: <a href="${data.projectUrl}" target="_blank">${data.projectUrl}</a></div>` : ''}
  ${data.githubUrl ? `<div class="project-github">GitHub: <a href="${data.githubUrl}" target="_blank">${data.githubUrl}</a></div>` : ''}
  ${data.description ? `<div class="project-description">${data.description}</div>` : ''}
</div>`;
        break;
      case 'Custom':
        formattedContent = data.content;
        onUpdate(section.id, { title: data.title });
        break;
    }
    
    onUpdate(section.id, { content: formattedContent, data });
    setShowForm(false);
  };

  const renderFormOrContent = () => {
    if (showForm) {
      switch (section.type) {
        case 'Education':
          return (
            <EducationForm
              initialData={section.data}
              onSave={handleFormSave}
              onCancel={() => setShowForm(false)}
            />
          );
        case 'Experience':
          return (
            <ExperienceForm
              initialData={section.data}
              onSave={handleFormSave}
              onCancel={() => setShowForm(false)}
            />
          );
        case 'Projects':
          return (
            <ProjectForm
              initialData={section.data}
              onSave={handleFormSave}
              onCancel={() => setShowForm(false)}
            />
          );
        case 'Custom':
          return (
            <CustomSectionForm
              initialData={section.data || { title: section.title, content: section.content }}
              onSave={handleFormSave}
              onCancel={() => setShowForm(false)}
            />
          );
        default:
          return null;
      }
    }

    if (section.type === 'Skills') {
      return <SkillsEditor content={section.content} onChange={handleContentChange} />;
    }

    return (
      <div className="space-y-4">
        {section.content ? (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div 
              className="text-gray-700 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>No content added yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 text-pastel-blue hover:underline"
            >
              Add {section.type.toLowerCase()} details
            </button>
          </div>
        )}
        
        {section.content && (
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowForm(true)}
              className="text-sm text-pastel-blue hover:underline"
            >
              Edit with form
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {(() => {
                // Strip HTML tags for word counting
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = section.content;
                const plainText = tempDiv.textContent || tempDiv.innerText || '';
                return plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
              })()} words
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Drag to reorder"
          >
            <GripVertical className="w-5 h-5" />
          </button>
          <Icon className="w-5 h-5 text-pastel-blue" />
          {isEditing ? (
            <input
              type="text"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={handleTitleSave}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleTitleSave();
                }
                if (e.key === 'Escape') {
                  setLocalTitle(section.title);
                  setIsEditing(false);
                }
              }}
              className="font-serif font-semibold text-charcoal dark:text-off-white bg-transparent border-b border-pastel-blue focus:outline-none"
              autoFocus
            />
          ) : (
            <h3 
              className="font-serif font-semibold text-charcoal dark:text-off-white cursor-pointer hover:text-pastel-blue"
              onClick={() => setIsEditing(true)}
            >
              {section.title}
            </h3>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-gray-400 hover:text-pastel-blue hover:bg-pastel-mint rounded-lg transition-colors duration-200"
            aria-label="Edit section title"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onRemove(section.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
            aria-label="Delete section"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4">
        {renderFormOrContent()}
      </div>
    </div>
  );
};

export const SectionsPage: React.FC = () => {
  const { sections, addSection, removeSection, moveSection, updateSection } = useResumeStore();
  const { uiSettings } = useResumeStore();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const isWeb3Theme = uiSettings.themeMode === 'web3';

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = sections.findIndex((section) => section.id === active.id);
      const newIndex = sections.findIndex((section) => section.id === over.id);
      
      moveSection(oldIndex, newIndex);
    }
  };

  const sectionTypes: Section['type'][] = ['Education', 'Experience', 'Skills', 'Projects', 'Custom'];

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`rounded-lg shadow-lg p-8 ${
        isWeb3Theme 
          ? 'bg-web3-dark border border-web3-border' 
          : 'bg-white dark:bg-gray-800'
      }`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className={`text-2xl font-serif font-bold ${
            isWeb3Theme ? 'text-web3-text' : 'text-charcoal dark:text-off-white'
          }`}>
            Resume Sections
          </h2>
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className={`flex items-center px-4 py-2 font-medium rounded-lg hover:scale-105 transition-transform duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isWeb3Theme
                  ? 'bg-web3-accent text-white focus:ring-web3-accent hover:bg-opacity-90'
                  : 'bg-pastel-blue text-charcoal focus:ring-pastel-blue'
              }`}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Section
            </button>
            {showAddMenu && (
              <div style={{color: "#ffffff"}} className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                {sectionTypes.map((type) => {
                  const Icon = sectionIcons[type];
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        addSection(type);
                        setShowAddMenu(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg transition-colors duration-200"
                    >
                      <Icon className="w-5 h-5 mr-3 text-pastel-blue" />
                      {type}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {sections.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No sections yet. Add your first section to get started!
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {sections.map((section) => (
                  <SectionCard
                    key={section.id}
                    section={section}
                    onUpdate={updateSection}
                    onRemove={removeSection}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};