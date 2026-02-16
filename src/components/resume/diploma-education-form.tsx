"use client";

import { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Calendar } from "lucide-react";

const SCORE_TYPES = [
  { value: "percentage", label: "Percentage", outOf: 100 },
  { value: "cgpa", label: "CGPA", outOf: 10 },
] as const;

type Props = {
  onSave: (data: {
    college: string;
    start_date: string;
    end_date: string;
    is_ongoing: boolean;
    stream: string;
    score_type: string;
    score_value: string;
    score_out_of: number;
  }) => Promise<void>;
  onClose: () => void;
  initialValues?: {
    college?: string;
    start_date?: string;
    end_date?: string;
    is_ongoing?: boolean;
    stream?: string;
    cgpa?: number | string;
    cgpa2?: string;
  };
};

export function DiplomaEducationForm({ onSave, onClose, initialValues }: Props) {
  const [college, setCollege] = useState(initialValues?.college || "");
  const [startDate, setStartDate] = useState(initialValues?.start_date || "");
  const [endDate, setEndDate] = useState(initialValues?.end_date || "");
  const [isOngoing, setIsOngoing] = useState(initialValues?.is_ongoing || false);
  const [stream, setStream] = useState(initialValues?.stream || "");
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
    if (!college?.trim()) return;
    setSaving(true);
    try {
      await onSave({
        college: college.trim(),
        start_date: startDate,
        end_date: endDate,
        is_ongoing: isOngoing,
        stream: stream.trim(),
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
        <h3 className="text-base font-bold text-gray-900">Diploma details</h3>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
          <input
            type="text"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            placeholder="Eg. IGNOU"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-9"
              />
              <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={isOngoing}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 pr-9"
              />
              <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isOngoing}
            onChange={(e) => {
              setIsOngoing(e.target.checked);
              if (e.target.checked) setEndDate("");
            }}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Currently ongoing</span>
        </label>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Stream</label>
          <input
            type="text"
            value={stream}
            onChange={(e) => setStream(e.target.value)}
            placeholder="Eg. UI/UX Designing"
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
            disabled={saving || !college?.trim()}
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
