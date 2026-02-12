"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import {
  getUserEducation,
  createUserEducation,
  updateUserEducation,
  deleteUserEducation,
} from "@/services/resume-builder.service";
import type { Education } from "@/types/resume-builder";
import { formatDateRange, formatEducationType, formatScore } from "@/lib/resume-utils";
import { toast } from "react-hot-toast";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

export function EducationSection() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [editForm, setEditForm] = useState({
    school_name: "",
    name: "",
    degree: "",
    stream: "",
    start_year: "",
    end_year: "",
    is_ongoing: false,
    cgpa: "",
    cgpa2: "",
    board: "",
    education: "" as Education["education"],
  });
  const [newForm, setNewForm] = useState({
    school_name: "",
    name: "",
    degree: "",
    stream: "",
    start_year: "",
    end_year: "",
    is_ongoing: false,
    cgpa: "",
    cgpa2: "",
    board: "",
    education: "" as Education["education"],
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await getUserEducation();
      if (response.data) {
        setEducation(response.data);
        if (response.data.length === 0) {
          setAddingNew(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch education:", error);
      toast.error("Failed to load education");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    // Convert year strings to date format for date picker (YYYY -> YYYY-01-01)
    const startYear = edu.start_year ? `${edu.start_year}-01-01` : "";
    const endYear = edu.end_year ? `${edu.end_year}-01-01` : "";
    setEditForm({
      school_name: edu.school_name || "",
      name: edu.name || "",
      degree: edu.degree || "",
      stream: edu.stream || "",
      start_year: startYear,
      end_year: endYear,
      is_ongoing: edu.is_ongoing,
      cgpa: edu.cgpa?.toString() || "",
      cgpa2: edu.cgpa2 || "",
      board: edu.board || "",
      education: edu.education,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      school_name: "",
      name: "",
      degree: "",
      stream: "",
      start_year: "",
      end_year: "",
      is_ongoing: false,
      cgpa: "",
      cgpa2: "",
      board: "",
      education: "" as Education["education"],
    });
  };

  const handleSaveEdit = async (id: number) => {
    try {
      const updateData: any = {};
      if (editForm.school_name) updateData.school_name = editForm.school_name;
      if (editForm.name) updateData.name = editForm.name;
      if (editForm.stream) updateData.stream = editForm.stream;
      if (editForm.start_year) {
        // Extract year from date string (YYYY-MM-DD -> YYYY)
        updateData.start_year = editForm.start_year.split('-')[0];
      }
      if (editForm.end_year || editForm.is_ongoing) {
        updateData.end_year = editForm.is_ongoing ? null : editForm.end_year.split('-')[0];
      }
      if (editForm.cgpa) updateData.cgpa = parseFloat(editForm.cgpa);
      if (editForm.cgpa2) updateData.cgpa2 = editForm.cgpa2;
      updateData.is_ongoing = editForm.is_ongoing;

      await updateUserEducation(id, updateData);
      toast.success("Education updated");
      setEditingId(null);
      fetchEducation();
    } catch (error) {
      console.error("Failed to update education:", error);
      toast.error("Failed to update education");
    }
  };

  const handleAdd = () => {
    setAddingNew(true);
  };

  const handleCancelAdd = () => {
    setAddingNew(false);
    setNewForm({
      school_name: "",
      name: "",
      degree: "",
      stream: "",
      start_year: "",
      end_year: "",
      is_ongoing: false,
      cgpa: "",
      cgpa2: "",
      board: "",
      education: "" as Education["education"],
    });
  };

  const handleSaveNew = async () => {
    if (!newForm.name || !newForm.school_name || !newForm.education) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      await createUserEducation({
        name: newForm.name,
        start_year: newForm.start_year ? newForm.start_year.split('-')[0] : "",
        end_year: newForm.is_ongoing ? null : (newForm.end_year ? newForm.end_year.split('-')[0] : ""),
        degree: newForm.degree,
        stream: newForm.stream,
        cgpa: newForm.cgpa ? parseFloat(newForm.cgpa) : 100,
        cgpa2: newForm.cgpa2 || "0",
        education: newForm.education,
        school_name: newForm.school_name,
        is_ongoing: newForm.is_ongoing,
      });
      toast.success("Education added");
      setAddingNew(false);
      setNewForm({
        school_name: "",
        name: "",
        degree: "",
        stream: "",
        start_year: "",
        end_year: "",
        is_ongoing: false,
        cgpa: "",
        cgpa2: "",
        board: "",
        education: "" as Education["education"],
      });
      fetchEducation();
    } catch (error) {
      console.error("Failed to create education:", error);
      toast.error("Failed to add education");
    }
  };

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete === null) return;

    try {
      await deleteUserEducation(itemToDelete);
      setEducation(education.filter((edu) => edu.id !== itemToDelete));
      toast.success("Education entry deleted");
    } catch (error) {
      console.error("Failed to delete education:", error);
      toast.error("Failed to delete education entry");
    } finally {
      setItemToDelete(null);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="h-6 w-32 bg-gray-200 rounded mb-3 animate-pulse" />
        <div className="space-y-4">
          <div className="h-24 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const renderEducationForm = (
    form: typeof editForm,
    setForm: React.Dispatch<React.SetStateAction<typeof editForm>>,
    isEdit: boolean,
    id?: number
  ) => (
    <div className="space-y-3 p-3 border-2 border-dashed border-gray-300 rounded">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Education Type *
          </label>
          <select
            value={form.education}
            onChange={(e) => setForm({ ...form, education: e.target.value as Education["education"] })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="">Select Type</option>
            <option value="secondary">Secondary</option>
            <option value="senior secondary">Senior Secondary</option>
            <option value="diploma">Diploma</option>
            <option value="graduation/ post graduation">Graduation/ Post Graduation</option>
            <option value="Phd">PhD</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            School/Institution Name *
          </label>
          <input
            type="text"
            value={form.school_name}
            onChange={(e) => setForm({ ...form, school_name: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Degree Name *
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Stream
          </label>
          <input
            type="text"
            value={form.stream}
            onChange={(e) => setForm({ ...form, stream: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Degree
          </label>
          <input
            type="text"
            value={form.degree}
            onChange={(e) => setForm({ ...form, degree: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Board
          </label>
          <input
            type="text"
            value={form.board}
            onChange={(e) => setForm({ ...form, board: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Start Year *
          </label>
          <input
            type="date"
            value={form.start_year}
            onChange={(e) => setForm({ ...form, start_year: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            End Year
          </label>
          <input
            type="date"
            value={form.end_year}
            onChange={(e) => setForm({ ...form, end_year: e.target.value })}
            disabled={form.is_ongoing}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-100"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_ongoing}
            onChange={(e) => setForm({ ...form, is_ongoing: e.target.checked, end_year: e.target.checked ? "" : form.end_year })}
            className="rounded border-gray-300"
          />
          <span className="text-xs text-gray-700">Currently pursuing</span>
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Total Score (CGPA)
          </label>
          <input
            type="number"
            value={form.cgpa}
            onChange={(e) => setForm({ ...form, cgpa: e.target.value })}
            placeholder="100, 10, or 4"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Actual Score
          </label>
          <input
            type="text"
            value={form.cgpa2}
            onChange={(e) => setForm({ ...form, cgpa2: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => isEdit && id ? handleSaveEdit(id) : handleSaveNew()}
          className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-white text-xs rounded hover:bg-gray-900"
        >
          <Save className="h-3 w-3" />
          Save
        </button>
        <button
          onClick={() => isEdit ? handleCancelEdit() : handleCancelAdd()}
          className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50"
        >
          <X className="h-3 w-3" />
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
        Education
      </h2>
      <div className="space-y-4">
        {education.map((edu) => {
          const dateRange = formatDateRange(edu.start_year, edu.end_year, edu.is_ongoing);
          const score = edu.cgpa && edu.cgpa2 ? formatScore(edu.cgpa2, edu.cgpa) : null;

          return (
            <div
              key={edu.id}
              className="group relative hover:bg-gray-50 transition p-3 rounded"
            >
              {editingId === edu.id ? (
                renderEducationForm(editForm, setEditForm, true, edu.id)
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-base">
                          {edu.name || formatEducationType(edu.education)}
                        </h3>
                        {edu.is_ongoing && (
                          <span className="text-xs text-gray-500 italic">
                            (Currently pursuing)
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-700 space-y-0.5">
                        <p className="font-medium">{edu.school_name}</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-600">
                          {edu.stream && <span>{edu.stream}</span>}
                          {edu.degree && <span>• {edu.degree}</span>}
                          {dateRange && <span>• {dateRange}</span>}
                          {score && <span>• Score: {score}</span>}
                          {edu.board && <span>• {edu.board}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleEdit(edu)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Pencil className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(edu.id)}
                        className="p-1 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-600" />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
        
        {addingNew && renderEducationForm(newForm, setNewForm, false)}

        {!addingNew && (
          <button
            onClick={handleAdd}
            className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1 mt-2"
          >
            <Plus className="h-3 w-3" />
            Add education
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
        title="Delete Education Entry"
        message="Are you sure you want to delete this education entry?"
      />
    </div>
  );
}
