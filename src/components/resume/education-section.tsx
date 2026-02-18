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
import { SecondaryEducationForm } from "@/components/resume/secondary-education-form";
import { SeniorSecondaryEducationForm } from "@/components/resume/senior-secondary-education-form";
import { DiplomaEducationForm } from "@/components/resume/diploma-education-form";
import { GraduationEducationForm } from "@/components/resume/graduation-education-form";
import { PhdEducationForm } from "@/components/resume/phd-education-form";

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
  const [chooseTypeOpen, setChooseTypeOpen] = useState(false);

  /** Normalize API date/year to YYYY-MM-DD for date inputs (handles "2020-01-01T00:00:00" or 2020) */
  const toDateInputValue = (value: string | number | null | undefined): string => {
    if (value == null || value === "") return "";
    const s = String(value).trim();
    if (!s) return "";
    if (s.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
    const year = s.slice(0, 4);
    if (/^\d{4}$/.test(year)) return `${year}-01-01`;
    return s.slice(0, 10) || "";
  };

  /** Build patch with only keys whose values have changed (normalize for comparison) */
  const onlyChanged = <T extends Record<string, unknown>>(
    initial: T,
    current: T
  ): Partial<T> => {
    const patch: Partial<T> = {};
    for (const key of Object.keys(current) as (keyof T)[]) {
      const a = initial[key];
      const b = current[key];
      const normA = a == null ? "" : String(a).trim();
      const normB = b == null ? "" : String(b).trim();
      if (normA !== normB) (patch as Record<string, unknown>)[key as string] = b;
    }
    return patch;
  };

  const EDUCATION_TYPE_OPTIONS: { value: Education["education"]; label: string }[] = [
    { value: "secondary", label: "Add secondary (X)" },
    { value: "senior secondary", label: "Add senior secondary (XII)" },
    { value: "diploma", label: "Add Diploma" },
    { value: "graduation/ post graduation", label: "Add graduation/ Post-graduation" },
    { value: "Phd", label: "Add PhD" },
  ];

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const response = await getUserEducation();
      if (response.data) {
        setEducation(response.data);
        if (response.data.length === 0) {
          setChooseTypeOpen(true);
        }
      }
    } catch (error) {
      // console.error("Failed to fetch education:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load education");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (edu: Education) => {
    setEditingId(edu.id);
    const startYear = toDateInputValue(edu.start_year);
    const endYearValue = (edu.education === "secondary" || edu.education === "senior secondary")
      ? toDateInputValue(edu.year_of_completion)
      : (edu.is_ongoing ? "" : toDateInputValue(edu.end_year));
    setEditForm({
      school_name: edu.school_name || "",
      name: edu.name || "",
      degree: edu.degree || "",
      stream: edu.stream || "",
      start_year: startYear,
      end_year: endYearValue,
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

  const handleUpdateSecondary = async (id: number, data: {
    year_of_completion: string;
    board: string;
    school_name: string;
    score_type: string;
    score_value: string;
    score_out_of: number;
  }) => {
    const edu = education.find((e) => e.id === id);
    if (!edu) return;
    const current = {
      school_name: data.school_name,
      board: data.board,
      cgpa: String(data.score_out_of ?? ""),
      cgpa2: data.score_value || "0",
      year_of_completion: data.year_of_completion,
    };
    const initial = {
      school_name: edu.school_name ?? "",
      board: edu.board ?? "",
      cgpa: String(edu.cgpa ?? ""),
      cgpa2: String(edu.cgpa2 ?? ""),
      year_of_completion: edu.year_of_completion != null ? String(edu.year_of_completion) : "",
    };
    const updateData = onlyChanged(initial, current) as Record<string, string | number>;
    if (Object.keys(updateData).length === 0) {
      toast.success("No changes to save");
      setEditingId(null);
      return;
    }
    try {
      await updateUserEducation(id, updateData);
      toast.success("Education updated");
      setEditingId(null);
      fetchEducation();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update education");
    }
  };

  const handleUpdateSeniorSecondary = async (id: number, data: {
    year_of_completion: string;
    board: string;
    stream: string;
    school_name: string;
    score_type: string;
    score_value: string;
    score_out_of: number;
  }) => {
    const edu = education.find((e) => e.id === id);
    if (!edu) return;
    const current = {
      school_name: data.school_name,
      board: data.board,
      stream: data.stream,
      cgpa: String(data.score_out_of ?? ""),
      cgpa2: data.score_value || "0",
      year_of_completion: data.year_of_completion,
    };
    const initial = {
      school_name: edu.school_name ?? "",
      board: edu.board ?? "",
      stream: edu.stream ?? "",
      cgpa: String(edu.cgpa ?? ""),
      cgpa2: String(edu.cgpa2 ?? ""),
      year_of_completion: edu.year_of_completion != null ? String(edu.year_of_completion) : "",
    };
    const updateData = onlyChanged(initial, current) as Record<string, string | number>;
    if (Object.keys(updateData).length === 0) {
      toast.success("No changes to save");
      setEditingId(null);
      return;
    }
    try {
      await updateUserEducation(id, updateData);
      toast.success("Education updated");
      setEditingId(null);
      fetchEducation();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update education");
    }
  };

  const handleUpdateDiploma = async (id: number, data: {
    college: string;
    start_date: string;
    end_date: string;
    is_ongoing: boolean;
    stream: string;
    score_type: string;
    score_value: string;
    score_out_of: number;
  }) => {
    const edu = education.find((e) => e.id === id);
    if (!edu) return;
    const startYear = data.start_date ? `${data.start_date}T00:00:00` : "";
    const endYear = data.is_ongoing ? null : (data.end_date ? `${data.end_date}T00:00:00` : null);
    const current = {
      school_name: data.college,
      stream: data.stream || "",
      cgpa: String(data.score_out_of ?? ""),
      cgpa2: data.score_value || "0",
      start_year: startYear,
      end_year: endYear,
      is_ongoing: data.is_ongoing,
    };
    const initial = {
      school_name: edu.school_name ?? "",
      stream: edu.stream ?? "",
      cgpa: String(edu.cgpa ?? ""),
      cgpa2: String(edu.cgpa2 ?? ""),
      start_year: edu.start_year ? `${String(edu.start_year).slice(0, 10)}T00:00:00` : "",
      end_year: edu.is_ongoing ? null : (edu.end_year != null ? `${String(edu.end_year).slice(0, 10)}T00:00:00` : null),
      is_ongoing: edu.is_ongoing ?? false,
    };
    const updateData = onlyChanged(initial, current as Record<string, unknown>) as Record<string, string | number | null | boolean>;
    if (Object.keys(updateData).length === 0) {
      toast.success("No changes to save");
      setEditingId(null);
      return;
    }
    try {
      await updateUserEducation(id, updateData);
      toast.success("Education updated");
      setEditingId(null);
      fetchEducation();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update education");
    }
  };

  const handleUpdateGraduation = async (id: number, data: {
    college: string;
    start_date: string;
    end_date: string;
    is_ongoing: boolean;
    degree: string;
    stream: string;
    score_type: string;
    score_value: string;
    score_out_of: number;
  }) => {
    const edu = education.find((e) => e.id === id);
    if (!edu) return;
    const startYear = data.start_date ? `${data.start_date}T00:00:00` : "";
    const endYear = data.is_ongoing ? null : (data.end_date ? `${data.end_date}T00:00:00` : null);
    const current = {
      name: data.degree || "B.Tech",
      degree: data.degree || "B.Tech",
      school_name: data.college,
      start_year: startYear,
      end_year: endYear,
      stream: data.stream || "",
      cgpa: String(data.score_out_of ?? ""),
      cgpa2: data.score_value || "0",
      is_ongoing: data.is_ongoing,
    };
    const initial = {
      name: edu.name ?? "B.Tech",
      degree: edu.degree ?? "B.Tech",
      school_name: edu.school_name ?? "",
      start_year: edu.start_year ? `${String(edu.start_year).slice(0, 10)}T00:00:00` : "",
      end_year: edu.is_ongoing ? null : (edu.end_year != null ? `${String(edu.end_year).slice(0, 10)}T00:00:00` : null),
      stream: edu.stream ?? "",
      cgpa: String(edu.cgpa ?? ""),
      cgpa2: String(edu.cgpa2 ?? ""),
      is_ongoing: edu.is_ongoing ?? false,
    };
    const updateData = onlyChanged(initial, current as Record<string, unknown>) as Record<string, string | number | null | boolean>;
    if (Object.keys(updateData).length === 0) {
      toast.success("No changes to save");
      setEditingId(null);
      return;
    }
    try {
      await updateUserEducation(id, updateData);
      toast.success("Education updated");
      setEditingId(null);
      fetchEducation();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update education");
    }
  };

  const handleUpdatePhd = async (id: number, data: {
    college: string;
    start_date: string;
    end_date: string;
    is_ongoing: boolean;
    stream: string;
    score_type: string;
    score_value: string;
    score_out_of: number;
  }) => {
    const edu = education.find((e) => e.id === id);
    if (!edu) return;
    const startYear = data.start_date ? `${data.start_date}T00:00:00` : "";
    const endYear = data.is_ongoing ? null : (data.end_date ? `${data.end_date}T00:00:00` : null);
    const current = {
      school_name: data.college,
      stream: data.stream || "",
      cgpa: String(data.score_out_of ?? ""),
      cgpa2: data.score_value || "0",
      start_year: startYear,
      end_year: endYear,
      is_ongoing: data.is_ongoing,
    };
    const initial = {
      school_name: edu.school_name ?? "",
      stream: edu.stream ?? "",
      cgpa: String(edu.cgpa ?? ""),
      cgpa2: String(edu.cgpa2 ?? ""),
      start_year: edu.start_year ? `${String(edu.start_year).slice(0, 10)}T00:00:00` : "",
      end_year: edu.is_ongoing ? null : (edu.end_year != null ? `${String(edu.end_year).slice(0, 10)}T00:00:00` : null),
      is_ongoing: edu.is_ongoing ?? false,
    };
    const updateData = onlyChanged(initial, current as Record<string, unknown>) as Record<string, string | number | null | boolean>;
    if (Object.keys(updateData).length === 0) {
      toast.success("No changes to save");
      setEditingId(null);
      return;
    }
    try {
      await updateUserEducation(id, updateData);
      toast.success("Education updated");
      setEditingId(null);
      fetchEducation();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update education");
    }
  };

  const handleAdd = () => {
    setChooseTypeOpen(true);
  };

  const handleChooseType = (educationType: Education["education"]) => {
    setNewForm((prev) => ({ ...prev, education: educationType }));
    setChooseTypeOpen(false);
    setAddingNew(true);
  };

  const handleCancelChooseType = () => {
    setChooseTypeOpen(false);
  };

  const handleSaveSecondary = async (data: {
    year_of_completion: string;
    board: string;
    school_name: string;
    score_type: string;
    score_value: string;
    score_out_of: number;
  }) => {
    await createUserEducation({
      education: "secondary",
      school_name: data.school_name,
      board: data.board,
      cgpa: String(data.score_out_of),
      cgpa2: data.score_value || "0",
      year_of_completion: data.year_of_completion,
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
  };

  const handleSaveSeniorSecondary = async (data: {
    year_of_completion: string;
    board: string;
    stream: string;
    school_name: string;
    score_type: string;
    score_value: string;
    score_out_of: number;
  }) => {
    await createUserEducation({
      education: "senior secondary",
      school_name: data.school_name,
      board: data.board,
      cgpa: String(data.score_out_of),
      cgpa2: data.score_value || "0",
      year_of_completion: data.year_of_completion,
      stream: data.stream,
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
  };

  const handleSaveDiploma = async (data: {
    college: string;
    start_date: string;
    end_date: string;
    is_ongoing: boolean;
    stream: string;
    score_type: string;
    score_value: string;
    score_out_of: number;
  }) => {
    // Convert date strings to datetime format (YYYY-MM-DD -> YYYY-MM-DDTHH:mm:ss)
    const startYear = data.start_date ? `${data.start_date}T00:00:00` : "";
    const endYear = data.is_ongoing ? null : (data.end_date ? `${data.end_date}T00:00:00` : null);
    await createUserEducation({
      education: "diploma",
      name: "Diploma",
      degree: "Diploma",
      school_name: data.college,
      start_year: startYear,
      end_year: endYear,
      stream: data.stream || "",
      cgpa: String(data.score_out_of),
      cgpa2: data.score_value || "0",
      is_ongoing: data.is_ongoing,
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
  };

  const handleSaveGraduation = async (data: {
    college: string;
    start_date: string;
    end_date: string;
    is_ongoing: boolean;
    degree: string;
    stream: string;
    score_type: string;
    score_value: string;
    score_out_of: number;
  }) => {
    // Convert date strings to datetime format (YYYY-MM-DD -> YYYY-MM-DDTHH:mm:ss)
    const startYear = data.start_date ? `${data.start_date}T00:00:00` : "";
    const endYear = data.is_ongoing ? null : (data.end_date ? `${data.end_date}T00:00:00` : null);
    await createUserEducation({
      education: "graduation/ post graduation",
      name: data.degree || "B.Tech",
      degree: data.degree || "B.Tech",
      school_name: data.college,
      start_year: startYear,
      end_year: endYear,
      stream: data.stream || "",
      cgpa: String(data.score_out_of),
      cgpa2: data.score_value || "0",
      is_ongoing: data.is_ongoing,
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
  };

  const handleSavePhd = async (data: {
    college: string;
    start_date: string;
    end_date: string;
    is_ongoing: boolean;
    stream: string;
    score_type: string;
    score_value: string;
    score_out_of: number;
  }) => {
    const startYear = data.start_date ? `${data.start_date}T00:00:00` : "";
    const endYear = data.is_ongoing ? null : (data.end_date ? `${data.end_date}T00:00:00` : null);
    await createUserEducation({
      education: "Phd",
      name: "PhD",
      school_name: data.college,
      start_year: startYear,
      end_year: endYear,
      stream: data.stream || "",
      cgpa: String(data.score_out_of),
      cgpa2: data.score_value || "0",
      is_ongoing: data.is_ongoing,
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
  };

  const handleCancelAdd = () => {
    setAddingNew(false);
    setChooseTypeOpen(false);
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
    if (!newForm.school_name || !newForm.education) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      let payload: any;

      if (newForm.education === "secondary") {
        if (!newForm.end_year) {
          toast.error("Year of completion is required");
          return;
        }
        payload = {
          education: "secondary",
          school_name: newForm.school_name,
          board: newForm.board || "",
          cgpa: newForm.cgpa || "10",
          cgpa2: newForm.cgpa2 || "0",
          year_of_completion: newForm.end_year.split('-')[0],
        };
      } else if (newForm.education === "senior secondary") {
        if (!newForm.end_year) {
          toast.error("Year of completion is required");
          return;
        }
        payload = {
          education: "senior secondary",
          school_name: newForm.school_name,
          board: newForm.board || "",
          cgpa: newForm.cgpa || "10",
          cgpa2: newForm.cgpa2 || "0",
          year_of_completion: newForm.end_year.split('-')[0],
          stream: newForm.stream || "",
        };
      } else if (newForm.education === "diploma") {
        // Convert date strings to datetime format (YYYY-MM-DD -> YYYY-MM-DDTHH:mm:ss)
        const startYear = newForm.start_year ? `${newForm.start_year}T00:00:00` : "";
        const endYear = newForm.is_ongoing ? null : (newForm.end_year ? `${newForm.end_year}T00:00:00` : null);
        payload = {
          education: "diploma",
          name: newForm.name || "Diploma",
          degree: newForm.degree || "Diploma",
          school_name: newForm.school_name,
          start_year: startYear,
          end_year: endYear,
          stream: newForm.stream || "",
          cgpa: newForm.cgpa || "10",
          cgpa2: newForm.cgpa2 || "0",
          is_ongoing: newForm.is_ongoing,
        };
      } else if (newForm.education === "graduation/ post graduation") {
        // Convert date strings to datetime format (YYYY-MM-DD -> YYYY-MM-DDTHH:mm:ss)
        const startYear = newForm.start_year ? `${newForm.start_year}T00:00:00` : "";
        const endYear = newForm.is_ongoing ? null : (newForm.end_year ? `${newForm.end_year}T00:00:00` : null);
        payload = {
          education: "graduation/ post graduation",
          name: newForm.name || "B.Tech",
          degree: newForm.degree || "B.Tech",
          school_name: newForm.school_name,
          start_year: startYear,
          end_year: endYear,
          stream: newForm.stream || "",
          cgpa: newForm.cgpa || "10",
          cgpa2: newForm.cgpa2 || "0",
          is_ongoing: newForm.is_ongoing,
        };
      } else if (newForm.education === "Phd") {
        // Convert date strings to datetime format (YYYY-MM-DD -> YYYY-MM-DDTHH:mm:ss)
        const startYear = newForm.start_year ? `${newForm.start_year}T00:00:00` : "";
        const endYear = newForm.is_ongoing ? null : (newForm.end_year ? `${newForm.end_year}T00:00:00` : null);
        payload = {
          education: "Phd",
          name: newForm.name || "PhD",
          school_name: newForm.school_name,
          start_year: startYear,
          end_year: endYear,
          stream: newForm.stream || "",
          cgpa: newForm.cgpa || "10",
          cgpa2: newForm.cgpa2 || "0",
          is_ongoing: newForm.is_ongoing,
        };
      } else {
        toast.error("Invalid education type");
        return;
      }

      await createUserEducation(payload);
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
      // console.error("Failed to create education:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add education");
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
      // console.error("Failed to delete education:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete education entry");
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
            onChange={(e) => {
              const nextStart = e.target.value;
              const nextEnd =
                form.end_year && nextStart && form.end_year < nextStart ? "" : form.end_year;
              setForm({ ...form, start_year: nextStart, end_year: nextEnd });
            }}
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
            min={form.start_year || undefined}
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
          onClick={() => {
            if (isEdit && id) {
              const currentEdu = education.find((e) => e.id === id);
              if (currentEdu) {
                const current = {
                  school_name: form.school_name ?? "",
                  name: form.name ?? "",
                  degree: form.degree ?? "",
                  stream: form.stream ?? "",
                  start_year: form.start_year ? `${form.start_year}T00:00:00` : "",
                  end_year: form.is_ongoing ? null : (form.end_year ? `${form.end_year}T00:00:00` : null),
                  is_ongoing: form.is_ongoing,
                  cgpa: String(form.cgpa ?? ""),
                  cgpa2: form.cgpa2 ?? "",
                };
                const initial = {
                  school_name: currentEdu.school_name ?? "",
                  name: currentEdu.name ?? "",
                  degree: currentEdu.degree ?? "",
                  stream: currentEdu.stream ?? "",
                  start_year: currentEdu.start_year ? `${String(currentEdu.start_year).slice(0, 10)}T00:00:00` : "",
                  end_year: currentEdu.is_ongoing ? null : (currentEdu.end_year != null ? `${String(currentEdu.end_year).slice(0, 10)}T00:00:00` : null),
                  is_ongoing: currentEdu.is_ongoing ?? false,
                  cgpa: String(currentEdu.cgpa ?? ""),
                  cgpa2: String(currentEdu.cgpa2 ?? ""),
                };
                const updateData = onlyChanged(initial, current as Record<string, unknown>) as Record<string, string | number | null | boolean>;
                if (Object.keys(updateData).length === 0) {
                  toast.success("No changes to save");
                  setEditingId(null);
                  return;
                }
                updateUserEducation(id, updateData)
                  .then(() => {
                    toast.success("Education updated");
                    setEditingId(null);
                    fetchEducation();
                  })
                  .catch((error) => {
                    toast.error(error instanceof Error ? error.message : "Failed to update education");
                  });
              }
            } else {
              handleSaveNew();
            }
          }}
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
                <>
                  {edu.education === "secondary" && (
                    <SecondaryEducationForm
                      onSave={(data) => handleUpdateSecondary(edu.id, data)}
                      onClose={handleCancelEdit}
                      initialValues={{
                        year_of_completion: edu.year_of_completion != null
                          ? (String(edu.year_of_completion).length > 4 ? String(edu.year_of_completion).slice(0, 4) : String(edu.year_of_completion))
                          : "",
                        board: edu.board || "",
                        school_name: edu.school_name || "",
                        cgpa: edu.cgpa,
                        cgpa2: edu.cgpa2 || "",
                      }}
                    />
                  )}
                  {edu.education === "senior secondary" && (
                    <SeniorSecondaryEducationForm
                      onSave={(data) => handleUpdateSeniorSecondary(edu.id, data)}
                      onClose={handleCancelEdit}
                      initialValues={{
                        year_of_completion: edu.year_of_completion != null
                          ? (String(edu.year_of_completion).length > 4 ? String(edu.year_of_completion).slice(0, 4) : String(edu.year_of_completion))
                          : "",
                        board: edu.board || "",
                        stream: edu.stream || "",
                        school_name: edu.school_name || "",
                        cgpa: edu.cgpa,
                        cgpa2: edu.cgpa2 || "",
                      }}
                    />
                  )}
                  {edu.education === "diploma" && (
                    <DiplomaEducationForm
                      onSave={(data) => handleUpdateDiploma(edu.id, data)}
                      onClose={handleCancelEdit}
                      initialValues={{
                        college: edu.school_name || "",
                        start_date: toDateInputValue(edu.start_year),
                        end_date: edu.is_ongoing ? "" : toDateInputValue(edu.end_year),
                        is_ongoing: edu.is_ongoing,
                        stream: edu.stream || "",
                        cgpa: edu.cgpa,
                        cgpa2: edu.cgpa2 || "",
                      }}
                    />
                  )}
                  {edu.education === "graduation/ post graduation" && (
                    <GraduationEducationForm
                      onSave={(data) => handleUpdateGraduation(edu.id, data)}
                      onClose={handleCancelEdit}
                      initialValues={{
                        college: edu.school_name || "",
                        start_date: toDateInputValue(edu.start_year),
                        end_date: edu.is_ongoing ? "" : toDateInputValue(edu.end_year),
                        is_ongoing: edu.is_ongoing,
                        degree: edu.degree || "",
                        stream: edu.stream || "",
                        cgpa: edu.cgpa,
                        cgpa2: edu.cgpa2 || "",
                      }}
                    />
                  )}
                  {edu.education === "Phd" && (
                    <PhdEducationForm
                      onSave={(data) => handleUpdatePhd(edu.id, data)}
                      onClose={handleCancelEdit}
                      initialValues={{
                        college: edu.school_name || "",
                        start_date: toDateInputValue(edu.start_year),
                        end_date: edu.is_ongoing ? "" : toDateInputValue(edu.end_year),
                        is_ongoing: edu.is_ongoing,
                        stream: edu.stream || "",
                        cgpa: edu.cgpa,
                        cgpa2: edu.cgpa2 || "",
                      }}
                    />
                  )}
                  {(edu.education !== "secondary" &&
                    edu.education !== "senior secondary" &&
                    edu.education !== "diploma" &&
                    edu.education !== "graduation/ post graduation" &&
                    edu.education !== "Phd") && (
                    renderEducationForm(editForm, setEditForm, true, edu.id)
                  )}
                </>
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
                    <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
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
        
        {chooseTypeOpen && (
          <div className="space-y-1 p-3 border-2 border-dashed border-gray-300 rounded">
            <p className="text-xs font-medium text-gray-700 mb-2">Choose education level to add</p>
            {EDUCATION_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleChooseType(opt.value)}
                className="w-full text-left text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2 py-2 px-2 rounded hover:bg-blue-50 transition"
              >
                <Plus className="h-4 w-4 shrink-0" />
                {opt.label}
              </button>
            ))}
            <button
              type="button"
              onClick={handleCancelChooseType}
              className="mt-2 flex items-center gap-1 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50"
            >
              <X className="h-3 w-3" />
              Cancel
            </button>
          </div>
        )}

        {addingNew && newForm.education === "secondary" && (
          <SecondaryEducationForm
            onSave={handleSaveSecondary}
            onClose={handleCancelAdd}
          />
        )}

        {addingNew && newForm.education === "senior secondary" && (
          <SeniorSecondaryEducationForm
            onSave={handleSaveSeniorSecondary}
            onClose={handleCancelAdd}
          />
        )}

        {addingNew && newForm.education === "diploma" && (
          <DiplomaEducationForm
            onSave={handleSaveDiploma}
            onClose={handleCancelAdd}
          />
        )}

        {addingNew && newForm.education === "graduation/ post graduation" && (
          <GraduationEducationForm
            onSave={handleSaveGraduation}
            onClose={handleCancelAdd}
          />
        )}

        {addingNew && newForm.education === "Phd" && (
          <PhdEducationForm
            onSave={handleSavePhd}
            onClose={handleCancelAdd}
          />
        )}

        {addingNew &&
          newForm.education !== "secondary" &&
          newForm.education !== "senior secondary" &&
          newForm.education !== "diploma" &&
          newForm.education !== "graduation/ post graduation" &&
          newForm.education !== "Phd" &&
          renderEducationForm(newForm, setNewForm, false)}

        {!addingNew && !chooseTypeOpen && (
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
