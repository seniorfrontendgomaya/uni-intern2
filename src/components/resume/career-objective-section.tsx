"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import {
  getCareerObjectives,
  createCareerObjective,
  updateCareerObjective,
  deleteCareerObjective,
} from "@/services/resume-builder.service";
import type { CareerObjective } from "@/types/resume-builder";
import { toast } from "react-hot-toast";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

export function CareerObjectiveSection() {
  const [objectives, setObjectives] = useState<CareerObjective[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [editText, setEditText] = useState("");
  const [newText, setNewText] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchObjectives();
  }, []);

  const fetchObjectives = async () => {
    try {
      const response = await getCareerObjectives();
      if (response.data) {
        setObjectives(response.data);
        if (response.data.length === 0) {
          setAddingNew(true);
        }
      }
    } catch (error) {
      // console.error("Failed to fetch career objectives:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load career objectives");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (objective: CareerObjective) => {
    setEditingId(objective.id);
    setEditText(objective.description);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await updateCareerObjective(id, { description: editText });
      toast.success("Career objective updated");
      setEditingId(null);
      fetchObjectives();
    } catch (error) {
      // console.error("Failed to update career objective:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update career objective");
    }
  };

  const handleAdd = () => {
    setAddingNew(true);
  };

  const handleCancelAdd = () => {
    setAddingNew(false);
    setNewText("");
  };

  const handleSaveNew = async () => {
    if (!newText.trim()) {
      toast.error("Please enter a career objective");
      return;
    }

    try {
      await createCareerObjective({ description: newText });
      toast.success("Career objective added");
      setAddingNew(false);
      setNewText("");
      fetchObjectives();
    } catch (error) {
      // console.error("Failed to create career objective:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add career objective");
    }
  };

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete === null) return;

    try {
      await deleteCareerObjective(itemToDelete);
      setObjectives(objectives.filter((obj) => obj.id !== itemToDelete));
      toast.success("Career objective deleted");
    } catch (error) {
      // console.error("Failed to delete career objective:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete career objective");
    } finally {
      setItemToDelete(null);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="h-6 w-48 bg-gray-200 rounded mb-3 animate-pulse" />
        <div className="space-y-3">
          <div className="h-20 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
        Career Objective
      </h2>
      <div className="space-y-3">
        {objectives.map((objective) => (
          <div
            key={objective.id}
            className="group relative hover:bg-gray-50 transition p-3 rounded"
          >
            {editingId === objective.id ? (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Enter your career objective..."
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveEdit(objective.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-white text-xs rounded hover:bg-gray-900"
                  >
                    <Save className="h-3 w-3" />
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50"
                  >
                    <X className="h-3 w-3" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {objective.description}
                </p>
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleEdit(objective)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Pencil className="h-3.5 w-3.5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(objective.id)}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-600" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
        
        {addingNew && (
          <div className="p-3 border-2 border-dashed border-gray-300 rounded">
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 mb-2"
              placeholder="Enter your career objective..."
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveNew}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 text-white text-xs rounded hover:bg-gray-900"
              >
                <Save className="h-3 w-3" />
                Save
              </button>
              <button
                onClick={handleCancelAdd}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50"
              >
                <X className="h-3 w-3" />
                Cancel
              </button>
            </div>
          </div>
        )}

        {!addingNew && (
          <button
            onClick={handleAdd}
            className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1 mt-2"
          >
            <Plus className="h-3 w-3" />
            Add your career objective
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
        title="Delete Career Objective"
        message="Are you sure you want to delete this career objective?"
      />
    </div>
  );
}
