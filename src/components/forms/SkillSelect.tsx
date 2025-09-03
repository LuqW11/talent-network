"use client";

import { useMemo, useState } from "react";
import { rankSkills } from "~/lib/skills";
import TagSearch from "~/components/inputs/TagSearch";
import Snackbar from "~/components/ui/Snackbar";

type RoleType = 'Backend SWE' | 'ML Platform' | 'Data Eng' | 'Platform-SRE' | 'Solutions Eng';

interface SkillSelectProps {
  selectedRoles: RoleType[];
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
}

export default function SkillSelect({
  selectedRoles,
  value,
  onChange,
  max = 10
}: SkillSelectProps) {
  const [snackbar, setSnackbar] = useState({ message: "", isVisible: false, showUndo: false, undoSkill: "" });

  // Get ranked suggestions based on selected roles
  const suggestions = useMemo(() => {
    return rankSkills(selectedRoles);
  }, [selectedRoles]);

  const handleAddSkill = (skill: string) => {
    if (value.includes(skill)) {
      return; // Prevent duplicates
    }
    
    if (value.length >= max) {
      setSnackbar({
        message: `Up to ${max} skills maximum`,
        isVisible: true,
        showUndo: false,
        undoSkill: ""
      });
      return;
    }

    onChange([...value, skill]);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const newValue = value.filter(skill => skill !== skillToRemove);
    onChange(newValue);
    
    // Show undo snackbar
    setSnackbar({
      message: `Removed "${skillToRemove}"`,
      isVisible: true,
      showUndo: true,
      undoSkill: skillToRemove
    });
  };

  const handleUndoRemove = () => {
    if (snackbar.undoSkill && !value.includes(snackbar.undoSkill) && value.length < max) {
      onChange([...value, snackbar.undoSkill]);
    }
    setSnackbar(prev => ({ ...prev, isVisible: false }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-900">
            Skills
          </label>
          <span className="text-xs text-gray-500">
            {value.length}/{max}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Search and select tools you're comfortable shipping with. Suggestions are tailored to your roles.
        </p>

        <TagSearch
          suggestions={suggestions}
          value={value}
          onAdd={handleAddSkill}
          placeholder="Search skills or type to add..."
          disabled={value.length >= max}
        />
      </div>

      {/* Selected Skills */}
      {value.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Selected Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {value.map((skill) => (
              <div
                key={skill}
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-3 py-1.5 rounded-full text-sm"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:bg-gray-700 rounded-full p-0.5 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
                  aria-label={`Remove ${skill}`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Snackbar
        message={snackbar.message}
        isVisible={snackbar.isVisible}
        onClose={handleCloseSnackbar}
        showUndo={snackbar.showUndo}
        onUndo={handleUndoRemove}
      />
    </div>
  );
}