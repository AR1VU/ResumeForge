import React, { useState, useEffect } from 'react';
import { Plus, X, GripVertical, Palette } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useResumeStore } from '../store/useResumeStore';

interface Skill {
  id: string;
  name: string;
  color: string;
}

const colorPalette = [
  '#A3D5FF', // pastel-blue
  '#B2F2BB', // pastel-mint
  '#FFB3BA', // pastel-pink
  '#FFFFBA', // pastel-yellow
  '#BAE1FF', // light-blue
  '#FFDFBA', // pastel-orange
  '#6366f1', // web3-accent
  '#8b5cf6', // web3-secondary
  '#10b981', // web3-success
];

const SkillPill: React.FC<{
  skill: Skill;
  onUpdate: (skill: Skill) => void;
  onRemove: (id: string) => void;
}> = ({ skill, onUpdate, onRemove }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: skill.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative inline-flex items-center"
    >
      <div
        className="flex items-center px-3 py-1 rounded-full text-sm font-medium text-charcoal shadow-sm"
        style={{ backgroundColor: skill.color }}
      >
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing mr-2"
          aria-label="Drag to reorder skill"
        >
          <GripVertical className="w-3 h-3" />
        </button>
        
        <span className="mr-2">{skill.name}</span>
        
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-1 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors duration-150"
          aria-label="Change color"
        >
          <Palette className="w-3 h-3" />
        </button>
        
        <button
          onClick={() => onRemove(skill.id)}
          className="ml-1 p-1 hover:bg-black hover:bg-opacity-10 rounded-full transition-colors duration-150"
          aria-label="Remove skill"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      
      {showColorPicker && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
          <div className="grid grid-cols-3 gap-2">
            {colorPalette.map((color) => (
              <button
                key={color}
                onClick={() => {
                  onUpdate({ ...skill, color });
                  setShowColorPicker(false);
                }}
                className="w-6 h-6 rounded-full border border-gray-300 hover:scale-110 transition-transform duration-150"
                style={{ backgroundColor: color }}
                aria-label={`Change color to ${color}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const SkillsEditor: React.FC<{
  content: string;
  onChange: (content: string) => void;
}> = ({ content, onChange }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const { uiSettings } = useResumeStore();
  const isWeb3Theme = uiSettings.themeMode === 'web3';

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Parse skills from content string
  useEffect(() => {
    try {
      const parsed = content ? JSON.parse(content) : [];
      setSkills(Array.isArray(parsed) ? parsed : []);
    } catch {
      // If content is not JSON, treat as comma-separated string
      const skillNames = content.split(',').map(s => s.trim()).filter(Boolean);
      const skillObjects = skillNames.map((name, index) => ({
        id: `skill-${index}`,
        name,
        color: colorPalette[index % colorPalette.length],
      }));
      setSkills(skillObjects);
    }
  }, [content]);

  const addSkill = () => {
    if (newSkillName.trim()) {
      const newSkill: Skill = {
        id: `skill-${Date.now()}`,
        name: newSkillName.trim(),
        color: colorPalette[skills.length % colorPalette.length],
      };
      const updatedSkills = [...skills, newSkill];
      setSkills(updatedSkills);
      onChange(JSON.stringify(updatedSkills));
      setNewSkillName('');
    }
  };

  const updateSkill = (updatedSkill: Skill) => {
    const updatedSkills = skills.map(skill => 
      skill.id === updatedSkill.id ? updatedSkill : skill
    );
    setSkills(updatedSkills);
    onChange(JSON.stringify(updatedSkills));
  };

  const removeSkill = (id: string) => {
    const updatedSkills = skills.filter(skill => skill.id !== id);
    setSkills(updatedSkills);
    onChange(JSON.stringify(updatedSkills));
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = skills.findIndex((skill) => skill.id === active.id);
      const newIndex = skills.findIndex((skill) => skill.id === over.id);
      
      const updatedSkills = arrayMove(skills, oldIndex, newIndex);
      setSkills(updatedSkills);
      onChange(JSON.stringify(updatedSkills));
    }
  };

  return (
    <div className="space-y-4">
      {/* Add skill input */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addSkill();
            }
          }}
          placeholder="Add a skill..."
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-pastel-blue focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={addSkill}
          disabled={!newSkillName.trim()}
          className={`p-2 rounded-lg hover:scale-105 transition-transform duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
            isWeb3Theme
              ? 'bg-web3-accent text-white hover:bg-opacity-90'
              : 'bg-pastel-blue text-charcoal'
          }`}
          aria-label="Add skill"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Skills list */}
      {skills.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={skills.map(s => s.id)} strategy={horizontalListSortingStrategy}>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <SkillPill
                  key={skill.id}
                  skill={skill}
                  onUpdate={updateSkill}
                  onRemove={removeSkill}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {skills.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-sm italic">
          Add skills by typing them above and pressing Enter
        </p>
      )}
    </div>
  );
};