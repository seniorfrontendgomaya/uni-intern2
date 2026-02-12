"use client";

import { useState, useEffect, useRef } from "react";
import { Trash2, Plus, ChevronDown, Search } from "lucide-react";
import { getUserSkills, createUserSkill, deleteUserSkill } from "@/services/resume-builder.service";
import { getAllSkills } from "@/services/skill.service";
import type { Skill } from "@/types/resume-builder";
import type { ISkill } from "@/types/skill";
import { toast } from "react-hot-toast";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

export function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingNew, setAddingNew] = useState(false);
  const [newForm, setNewForm] = useState({ skill: "" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  // Searchable dropdown state
  const [availableSkills, setAvailableSkills] = useState<ISkill[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchSkills();
    fetchAvailableSkills();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchAvailableSkills(searchTerm.trim());
      } else {
        fetchAvailableSkills();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchSkills = async () => {
    try {
      const response = await getUserSkills();
      if (response.data?.skill) {
        setSkills(response.data.skill);
        if (response.data.skill.length === 0) {
          setAddingNew(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch skills:", error);
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSkills = async (search?: string) => {
    try {
      setIsSearching(true);
      const response = await getAllSkills(search);
      if (response.data) {
        setAvailableSkills(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch available skills:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdd = () => {
    setAddingNew(true);
  };

  const handleCancelAdd = () => {
    setAddingNew(false);
    setNewForm({ skill: "" });
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  const handleSelectSkill = (skill: ISkill) => {
    setNewForm({ skill: skill.name });
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  const handleSaveNew = async () => {
    if (!newForm.skill.trim()) {
      toast.error("Please select a skill");
      return;
    }

    try {
      await createUserSkill({
        skill: newForm.skill,
        description: "",
      });
      toast.success("Skill added");
      setAddingNew(false);
      setNewForm({ skill: "" });
      setSearchTerm("");
      fetchSkills();
    } catch (error) {
      console.error("Failed to create skill:", error);
      toast.error("Failed to add skill");
    }
  };

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete === null) return;

    try {
      await deleteUserSkill(itemToDelete);
      setSkills(skills.filter((skill) => skill.id !== itemToDelete));
      toast.success("Skill deleted");
    } catch (error) {
      console.error("Failed to delete skill:", error);
      toast.error("Failed to delete skill");
    } finally {
      setItemToDelete(null);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="h-6 w-24 bg-gray-200 rounded mb-3 animate-pulse" />
        <div className="flex flex-wrap gap-2 mb-2">
          <div className="h-8 w-20 bg-gray-100 rounded animate-pulse" />
          <div className="h-8 w-20 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
        Skills
      </h2>
      <div className="space-y-3">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="group mr-4 relative inline-flex items-center gap-2 rounded-full bg-gray-50 border border-gray-200 px-3 py-1.5 hover:bg-gray-100 transition"
          >
            <span className="text-sm text-gray-800">{skill.name}</span>
            <button
              onClick={() => handleDeleteClick(skill.id)}
              className="p-0.5 hover:bg-red-50 rounded-full transition"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-600" />
            </button>
          </div>
        ))}

        {addingNew && (
          <div className="p-3 border-2 border-dashed border-gray-300 rounded max-w-md">
            <div className="space-y-2" ref={dropdownRef}>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Skill Name *
              </label>
              <div className="relative">
                <div className="flex items-center border border-gray-300 rounded bg-white">
                  <Search className="h-4 w-4 text-gray-400 ml-3" />
                  <input
                    type="text"
                    value={searchTerm || newForm.skill}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setIsDropdownOpen(true);
                      if (!e.target.value) {
                        setNewForm({ skill: "" });
                      }
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Search and select a skill..."
                    className="w-full px-3 py-2 text-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="px-3 py-2 text-gray-400 hover:text-gray-600"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                    {isSearching ? (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Searching...
                      </div>
                    ) : availableSkills.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No skills found
                      </div>
                    ) : (
                      availableSkills.map((skill) => (
                        <button
                          key={skill.id}
                          type="button"
                          onClick={() => handleSelectSkill(skill)}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        >
                          <div className="font-medium text-gray-900">
                            {skill.name}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
              {newForm.skill && !searchTerm && (
                <div className="mt-1 text-xs text-gray-600">
                  Selected: <span className="font-medium">{newForm.skill}</span>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleSaveNew}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-white text-xs rounded hover:bg-gray-900"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelAdd}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {!addingNew && (
          <button
            onClick={handleAdd}
            className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1"
          >
            <Plus className="h-3 w-3" />
            Add skills
          </button>
        )}
      </div>

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Skill"
        message="Are you sure you want to delete this skill?"
      />
    </div>
  );
}
