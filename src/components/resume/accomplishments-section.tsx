"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import {
  getUserAccomplishments,
  createUserAccomplishment,
  updateUserAccomplishment,
  deleteUserAccomplishment,
} from "@/services/resume-builder.service";
import type { Accomplishment } from "@/types/resume-builder";
import { toast } from "react-hot-toast";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

export function AccomplishmentsSection() {
  const [accomplishments, setAccomplishments] = useState<Accomplishment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [editText, setEditText] = useState("");
  const [newText, setNewText] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchAccomplishments();
  }, []);

  const fetchAccomplishments = async () => {
    try {
      const response = await getUserAccomplishments();
      if (response.data) {
        setAccomplishments(response.data);
        if (response.data.length === 0) {
          setAddingNew(true);
        }
      }
    } catch (error) {
      // console.error("Failed to fetch accomplishments:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load accomplishments");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (accomplishment: Accomplishment) => {
    setEditingId(accomplishment.id);
    setEditText(accomplishment.description);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await updateUserAccomplishment(id, { description: editText });
      toast.success("Accomplishment updated");
      setEditingId(null);
      fetchAccomplishments();
    } catch (error) {
      // console.error("Failed to update accomplishment:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update accomplishment");
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
      toast.error("Please enter an accomplishment");
      return;
    }

    try {
      await createUserAccomplishment({ description: newText });
      toast.success("Accomplishment added");
      setAddingNew(false);
      setNewText("");
      fetchAccomplishments();
    } catch (error) {
      // console.error("Failed to create accomplishment:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add accomplishment");
    }
  };

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete === null) return;

    try {
      await deleteUserAccomplishment(itemToDelete);
      setAccomplishments(accomplishments.filter((acc) => acc.id !== itemToDelete));
      toast.success("Accomplishment deleted");
    } catch (error) {
      // console.error("Failed to delete accomplishment:", error);
      toast.error("Failed to delete accomplishment");
    } finally {
      setItemToDelete(null);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="h-6 w-40 bg-gray-200 rounded mb-3 animate-pulse" />
        <div className="space-y-3">
          <div className="h-16 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide mb-3 border-b border-gray-300 pb-1">
        Accomplishments
      </h2>
      <div className="space-y-3">
        {accomplishments.map((accomplishment) => (
          <div
            key={accomplishment.id}
            className="group relative hover:bg-gray-50 transition p-3 rounded"
          >
            {editingId === accomplishment.id ? (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="Enter accomplishment..."
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveEdit(accomplishment.id)}
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
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm text-gray-700 leading-relaxed flex-1">
                  • {accomplishment.description}
                </p>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleEdit(accomplishment)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Pencil className="h-3.5 w-3.5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(accomplishment.id)}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-600" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {addingNew && (
          <div className="p-3 border-2 border-dashed border-gray-300 rounded">
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 mb-2"
              placeholder="Enter accomplishment..."
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
            Add accomplishments
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
        title="Delete Accomplishment"
        message="Are you sure you want to delete this accomplishment?"
      />
    </div>
  );
}
