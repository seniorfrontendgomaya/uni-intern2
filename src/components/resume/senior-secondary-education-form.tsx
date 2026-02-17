"use client";

import { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { isValidYearOfCompletion, restrictToFourDigits } from "@/lib/resume-utils";
import { toast } from "react-hot-toast";

const SCORE_TYPES = [
  { value: "percentage", label: "Percentage", outOf: 100 },
  { value: "cgpa", label: "CGPA", outOf: 10 },
] as const;

type Props = {
  onSave: (data: {
    year_of_completion: string;
    board: string;
    stream: string;
    school_name: string;
    score_type: string;
    score_value: string;
    score_out_of: number;
  }) => Promise<void>;
  onClose: () => void;
  initialValues?: {
    year_of_completion?: string;
    board?: string;
    stream?: string;
    school_name?: string;
    cgpa?: number | string;
    cgpa2?: string;
  };
};

export function SeniorSecondaryEducationForm({ onSave, onClose, initialValues }: Props) {
  const [yearOfCompletion, setYearOfCompletion] = useState(
    initialValues?.year_of_completion != null ? String(initialValues.year_of_completion) : ""
  );
  const [board, setBoard] = useState(initialValues?.board || "");
  const [stream, setStream] = useState(initialValues?.stream || "");
  const [schoolName, setSchoolName] = useState(initialValues?.school_name || "");
  // Determine score type from cgpa (100 = percentage, 10 = cgpa)
  const initialScoreType = initialValues?.cgpa 
    ? (Number(initialValues.cgpa) === 100 ? "percentage" : "cgpa")
    : "percentage";
  const [scoreType, setScoreType] = useState<typeof SCORE_TYPES[number]["value"]>(initialScoreType);
  const [scoreValue, setScoreValue] = useState(initialValues?.cgpa2 || "");
  const [scoreDropdownOpen, setScoreDropdownOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const scoreDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (scoreDropdownRef.current && !scoreDropdownRef.current.contains(e.target as Node)) {
        setScoreDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentScoreType = SCORE_TYPES.find((t) => t.value === scoreType) ?? SCORE_TYPES[0];
  const scoreOutOf = currentScoreType.outOf;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName?.trim()) return;
    const yearTrimmed = String(yearOfCompletion ?? "").trim();
    if (yearTrimmed && !isValidYearOfCompletion(yearTrimmed)) {
      toast.error("Year of completion must be a 4-digit number (e.g. 2022)");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        year_of_completion: yearTrimmed,
        board: board.trim(),
        stream: stream.trim(),
        school_name: schoolName.trim(),
        score_type: scoreType,
        score_value: scoreValue.trim(),
        score_out_of: scoreOutOf,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-3 border-2 border-dashed border-gray-300 rounded max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-900">Senior secondary (XII) details</h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year of completion</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={4}
            value={yearOfCompletion}
            onChange={(e) => setYearOfCompletion(restrictToFourDigits(e.target.value))}
            placeholder="Eg. 2022"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-describedby="year-hint-sr"
          />
          <p id="year-hint-sr" className="mt-0.5 text-xs text-gray-500">4-digit year (e.g. 2022)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Board</label>
          <input
            type="text"
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            placeholder="Eg. CBSE"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
          <input
            type="text"
            value={stream}
            onChange={(e) => setStream(e.target.value)}
            placeholder="Eg. PCM"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">School name</label>
          <input
            type="text"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            placeholder="Eg. Delhi Public School"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Performance Score (Recommended)
          </label>
          <div className="flex gap-2" ref={scoreDropdownRef}>
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setScoreDropdownOpen((o) => !o)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span>{currentScoreType.label}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              {scoreDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
                  {SCORE_TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => {
                        setScoreType(t.value);
                        setScoreDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <input
              type="text"
              value={scoreValue}
              onChange={(e) => setScoreValue(e.target.value)}
              placeholder={`Out of ${scoreOutOf}`}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button
            type="submit"
            disabled={saving || !schoolName?.trim()}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
