"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";
import {
  getUserProjects,
  createUserProject,
  updateUserProject,
  deleteUserProject,
} from "@/services/resume-builder.service";
import type { Project } from "@/types/resume-builder";
import { formatDateRange } from "@/lib/resume-utils";
import { toast } from "react-hot-toast";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    project_link: "",
    start_date: "",
    end_date: "",
    is_ongoing: false,
  });
  const [newForm, setNewForm] = useState({
    title: "",
    description: "",
    project_link: "",
    start_date: "",
    end_date: "",
    is_ongoing: false,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await getUserProjects();
      if (response.data) {
        setProjects(response.data);
        if (response.data.length === 0) {
          setAddingNew(true);
        }
      }
    } catch (error) {
      // console.error("Failed to fetch projects:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setEditForm({
      title: project.title || "",
      description: project.description || "",
      project_link: project.project_link || "",
      start_date: project.start_date || "",
      end_date: project.end_date || "",
      is_ongoing: project.is_ongoing,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      title: "",
      description: "",
      project_link: "",
      start_date: "",
      end_date: "",
      is_ongoing: false,
    });
  };

  const handleSaveEdit = async (id: number) => {
    try {
      const updateData: any = {};
      if (editForm.title) updateData.title = editForm.title;
      if (editForm.description) updateData.description = editForm.description;
      if (editForm.project_link) updateData.project_link = editForm.project_link;
      if (editForm.start_date) updateData.start_date = editForm.start_date;
      if (editForm.end_date || editForm.is_ongoing) {
        updateData.end_date = editForm.is_ongoing ? "" : editForm.end_date;
      }
      updateData.is_ongoing = editForm.is_ongoing;

      await updateUserProject(id, updateData);
      toast.success("Project updated");
      setEditingId(null);
      fetchProjects();
    } catch (error) {
      // console.error("Failed to update project:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update project");
    }
  };

  const handleAdd = () => {
    setAddingNew(true);
  };

  const handleCancelAdd = () => {
    setAddingNew(false);
    setNewForm({
      title: "",
      description: "",
      project_link: "",
      start_date: "",
      end_date: "",
      is_ongoing: false,
    });
  };

  const handleSaveNew = async () => {
    if (!newForm.title) {
      toast.error("Please enter project title");
      return;
    }

    try {
      await createUserProject({
        title: newForm.title,
        description: newForm.description,
        project_link: newForm.project_link,
        start_date: newForm.start_date,
        end_date: newForm.is_ongoing ? "" : newForm.end_date,
        is_ongoing: newForm.is_ongoing,
      });
      toast.success("Project added");
      setAddingNew(false);
      setNewForm({
        title: "",
        description: "",
        project_link: "",
        start_date: "",
        end_date: "",
        is_ongoing: false,
      });
      fetchProjects();
    } catch (error) {
      // console.error("Failed to create project:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add project");
    }
  };

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete === null) return;

    try {
      await deleteUserProject(itemToDelete);
      setProjects(projects.filter((project) => project.id !== itemToDelete));
      toast.success("Project deleted");
    } catch (error) {
      // console.error("Failed to delete project:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete project");
    } finally {
      setItemToDelete(null);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="h-6 w-64 bg-gray-200 rounded mb-3 animate-pulse" />
        <div className="space-y-3">
          <div className="h-24 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const renderProjectForm = (
    form: typeof editForm,
    setForm: React.Dispatch<React.SetStateAction<typeof editForm>>,
    isEdit: boolean,
    id?: number
  ) => (
    <div className="space-y-3 p-3 border-2 border-dashed border-gray-300 rounded">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Project Title *
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
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
            onChange={(e) => {
              const nextStart = e.target.value;
              const nextEnd =
                form.end_date && nextStart && form.end_date < nextStart ? "" : form.end_date;
              setForm({ ...form, start_date: nextStart, end_date: nextEnd });
            }}
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
            min={form.start_date || undefined}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:bg-gray-100"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
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
          Project Link
        </label>
        <input
          type="url"
          value={form.project_link}
          onChange={(e) => setForm({ ...form, project_link: e.target.value })}
          placeholder="https://..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={4}
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
        Academics/Personal Projects
      </h2>
      <div className="space-y-3">
        {projects.map((project) => {
          const dateRange = formatDateRange(project.start_date, project.end_date, project.is_ongoing);

          return (
            <div
              key={project.id}
              className="group relative hover:bg-gray-50 transition p-3 rounded"
            >
              {editingId === project.id ? (
                renderProjectForm(editForm, setEditForm, true, project.id)
              ) : (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-base mb-1">
                        {project.title}
                      </h3>
                      <div className="text-sm text-gray-700 space-y-0.5">
                        {dateRange && (
                          <p className="text-xs text-gray-600">{dateRange}</p>
                        )}
                        {project.description && (
                          <p className="text-xs text-gray-600 mt-1">
                            {project.description}
                          </p>
                        )}
                        <p className="text-xs">
                          <span className="text-gray-600">Project Link: </span>
                          {project.project_link ? (
                            <a
                              href={project.project_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline break-all"
                            >
                              {project.project_link}
                            </a>
                          ) : (
                            <span className="text-gray-400">Not provided</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Pencil className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(project.id)}
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
        
        {addingNew && renderProjectForm(newForm, setNewForm, false)}

        {!addingNew && (
          <button
            onClick={handleAdd}
            className="text-blue-600 hover:text-blue-700 text-xs font-medium flex items-center gap-1 mt-2"
          >
            <Plus className="h-3 w-3" />
            Add academic/personal project
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
        title="Delete Project"
        message="Are you sure you want to delete this project?"
      />
    </div>
  );
}
