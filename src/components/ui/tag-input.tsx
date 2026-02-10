"use client";

import { useState } from "react";

type TagInputProps = {
  label: string;
  value: string[];
  placeholder?: string;
  helperText?: string;
  onChange: (next: string[]) => void;
};

export function TagInput({
  label,
  value,
  placeholder,
  helperText = "Press Enter or comma to add",
  onChange,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (rawValue: string) => {
    const nextValue = rawValue.trim();
    if (!nextValue) return;
    if (value.some((item) => item.toLowerCase() === nextValue.toLowerCase())) {
      setInputValue("");
      return;
    }
    onChange([...value, nextValue]);
    setInputValue("");
  };

  return (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="mt-2 space-y-2">
        {value.length > 0 ? (
          <div className="flex flex-wrap gap-2 rounded-lg border bg-background px-3 py-2">
            {value.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground"
              >
                {item}
                <button
                  type="button"
                  className="text-muted-foreground transition hover:text-foreground"
                  onClick={() => onChange(value.filter((entry) => entry !== item))}
                  aria-label={`Remove ${item}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : null}
        <div className="flex items-center rounded-lg border bg-background px-3 py-2">
          <input
            type="text"
            className="w-full bg-transparent text-sm outline-none"
            placeholder={placeholder}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();
                addTag(inputValue.replace(",", ""));
              }
            if (event.key === "Backspace" && !inputValue && value.length > 0) {
              event.preventDefault();
            }
            }}
            onBlur={() => addTag(inputValue)}
          />
        </div>
      </div>
      {helperText ? (
        <p className="mt-2 text-xs text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}
