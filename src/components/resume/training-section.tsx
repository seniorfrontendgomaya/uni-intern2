"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import {
  getUserTraining,
  createUserTraining,
  updateUserTraining,
  deleteUserTraining,
} from "@/services/resume-builder.service";
import type { Training } from "@/types/resume-builder";
import { formatDateRange } from "@/lib/resume-utils";
import { toast } from "react-hot-toast";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

export function TrainingSection() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [editForm, setEditForm] = useState({
    training_program: "",
    organisation: "",
    location: "",
    is_online: true,
    is_ongoing: false,
    start_date: "",
    end_date: "",
    description: "",
  });
  const [newForm, setNewForm] = useState({
    training_program: "",
    organisation: "",
    location: "",
    is_online: true,
    is_ongoing: false,
    start_date: "",
    end_date: "",
    description: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    try {
      const response = await getUserTraining();
      if (response.data) {
        setTrainings(response.data);
        if (response.data.length === 0) {
          setAddingNew(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch trainings:", error);
      toast.error("Failed to load trainings");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (training: Training) => {
    setEditingId(training.id);
    setEditForm({
      training_program: training.training_program || "",
      organisation: training.organisation || "",
      location: training.location || "",
      is_online: training.is_online,
      is_ongoing: training.is_ongoing,
      start_date: training.start_date || "",
      end_date: training.end_date || "",
      description: training.description || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      training_program: "",
      organisation: "",
      location: "",
      is_online: true,
      is_ongoing: false,
      start_date: "",
      end_date: "",
      description: "",
    });
  };

  const handleSaveEdit = async (id: number) => {
    try {
      const updateData: any = {};
      if (editForm.training_program) updateData.training_program = editForm.training_program;
      if (editForm.organisation) updateData.organisation = editForm.organisation;
      if (editForm.location) updateData.location = editForm.location;
      if (editForm.start_date) updateData.start_date = editForm.start_date;
      if (editForm.end_date || editForm.is_ongoing) {
        updateData.end_date = editForm.is_ongoing ? "" : editForm.end_date;
      }
      updateData.is_online = editForm.is_online;
      updateData.is_ongoing = editForm.is_ongoing;
      if (editForm.description) updateData.description = editForm.description;

      await updateUserTraining(id, updateData);
      toast.success("Training updated");
      setEditingId(null);
      fetchTrainings();
    } catch (error) {
      console.error("Failed to update training:", error);
      toast.error("Failed to update training");
    }
  };

  const handleAdd = () => {
    setAddingNew(true);
  };

  const handleCancelAdd = () => {
    setAddingNew(false);
    setNewForm({
      training_program: "",
      organisation: "",
      location: "",
      is_online: true,
      is_ongoing: false,
      start_date: "",
      end_date: "",
      description: "",
    });
  };

  const handleSaveNew = async () => {
    if (!newForm.training_program || !newForm.organisation) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      await createUserTraining({
        training_program: newForm.training_program,
        organisation: newForm.organisation,
        location: newForm.location,
        is_online: newForm.is_online,
        is_ongoing: newForm.is_ongoing,
        start_date: newForm.start_date,
        end_date: newForm.is_ongoing ? "" : newForm.end_date,
        description: newForm.description,
      });
      toast.success("Training added");
      setAddingNew(false);
      setNewForm({
        training_program: "",
        organisation: "",
        location: "",
        is_online: true,
        is_ongoing: false,
        start_date: "",
        end_date: "",
        description: "",
      });
      fetchTrainings();
    } catch (error) {
      console.error("Failed to create training:", error);
      toast.error("Failed to add training");
    }
  };

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete === null) return;

    try {
      await deleteUserTraining(itemToDelete);
      setTrainings(trainings.filter((training) => training.id !== itemToDelete));
      toast.success("Training deleted");
    } catch (error) {
      console.error("Failed to delete training:", error);
      toast.error("Failed to delete training");
    } finally {
      setItemToDelete(null);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="h-6 w-40 bg-gray-200 rounded mb-3 animate-pulse" />
        <div className="space-y-3">
          <div className="h-20 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const renderTrainingForm = (
    form: typeof editForm,
    setForm: React.Dispatch<React.SetStateAction<typeof editForm>>,
    isEdit: boolean,
    id?: number
  ) => (
    <div className="space-y-3 p-3 border-2 border-dashed border-gray-300 rounded">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Training Program *
          </label>
          <input
            type="text"
            value={form.training_program}
            onChange={(e) => setForm({ ...form, training_program: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Organisation *
          </label>
          <input
            type="text"
            value={form.organisation}
            onChange={(e) => setForm({ ...form, organisation: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            disabled={form.is_ongoing}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-100"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_online}
            onChange={(e) => setForm({ ...form, is_online: e.target.checked })}
            className="rounded border-gray-300"
          />
          <span className="text-xs text-gray-700">Online</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_ongoing}
            onChange={(e) => setForm({ ...form, is_ongoing: e.target.checked, end_date: e.target.checked ? "" : form.end_date })}
            className="rounded border-gray-300"
          />
          <span className="text-xs text-gray-700">Ongoing</span>
        </label>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
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
        Training/Courses
      </h2>
      <div className="space-y-3">
        {trainings.map((training) => {
          const dateRange = formatDateRange(training.start_date, training.end_date, training.is_ongoing);
          const provider = `${training.organisation}${training.location ? `, ${training.location}` : ""}, ${training.is_online ? "Online" : "Offline"}`;

          return (
            <div
              key={training.id}
              className="group relative hover:bg-gray-50 transition p-3 rounded"
            >
              {editingId === training.id ? (
                renderTrainingForm(editForm, setEditForm, true, training.id)
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base mb-1">
                        {training.training_program}
                      </h3>
                      <div className="text-sm text-gray-700 space-y-0.5">
                        <p>{provider}</p>
                        {dateRange && (
                          <p className="text-xs text-gray-600">{dateRange}</p>
                        )}
                        {training.description && (
                          <p className="text-xs text-gray-600 mt-1">
                            {training.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleEdit(training)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Pencil className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(training.id)}
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
        
        {addingNew && renderTrainingForm(newForm, setNewForm, false)}

        {!addingNew && (
          <button
            onClick={handleAdd}
            className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1 mt-2"
          >
            <Plus className="h-3 w-3" />
            Add training/courses
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
        title="Delete Training"
        message="Are you sure you want to delete this training/course?"
      />
    </div>
  );
}
