import React, { useEffect, useRef, useState } from "react";
import { mergeClasses } from "../../utils/mergeClasses";

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  name: string;
  options: Option[];
  value: string | string[];
  onChange: (
    name: string,
    value: string | string[] | ((prev: any) => any),
  ) => void;
  multiple?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  searchable?: boolean;
  maxSelect?: number;
}

export function CustomSelect({
  name,
  options,
  value,
  onChange,
  multiple = false,
  placeholder = "Select...",
  disabled = false,
  className = "",
  searchable = false,
  maxSelect,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const baseInputClass = mergeClasses(
    `p-2 w-full border-2 my-1 rounded-md text-black transition-colors border-gray-400 bg-white flex items-center gap-2 cursor-pointer select-none ${
      open ? "border-blue-500" : "hover:border-gray-500"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`,
    className,
  );

  const selected = multiple
    ? Array.isArray(value)
      ? value
      : []
    : ((value as string) ?? "");

  // ✅ max limit check
  const isMaxReached =
    multiple &&
    Array.isArray(selected) &&
    maxSelect !== undefined &&
    selected.length >= maxSelect;

  // ✅ filtering
  const filtered = searchable
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase()),
      )
    : options;

  const isSelected = (val: string) =>
    multiple ? (selected as string[]).includes(val) : selected === val;

  const isDisabledOption = (val: string) => {
    if (!multiple || maxSelect === undefined) return false;
    if (!isMaxReached) return false;
    return !isSelected(val); // allow unselect
  };

  const toggle = (val: string) => {
    if (multiple) {
      const arr = selected as string[];

      // ❌ block new selection if limit reached
      if (!arr.includes(val) && isMaxReached) return;
      onChange(name, (prev: string[] = []) => {
        const safePrev = Array.isArray(prev) ? prev : [];

        if (safePrev.includes(val)) {
          return safePrev.filter((v) => v !== val);
        } else {
          if (maxSelect && safePrev.length >= maxSelect) {
            return safePrev; // block
          }
          return [...safePrev, val];
        }
      });
    } else {
      onChange(name, () => val);
      setOpen(false);
    }
  };

  const removeTag = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(
      name,
      (selected as string[]).filter((v) => v !== val),
    );
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open && searchable) {
      searchRef.current?.focus();
    }
  }, [open, searchable]);

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        onClick={() => !disabled && setOpen((o) => !o)}
        className={baseInputClass}
      >
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {multiple ? (
            (selected as string[]).length === 0 ? (
              <span className="text-[13px] text-gray-400">{placeholder}</span>
            ) : (
              (selected as string[]).map((val) => {
                const opt = options.find((o) => o.value === val);
                return (
                  <span
                    key={val}
                    className="inline-flex items-center gap-1 px-2 py-0.5
                      bg-gray-100 border border-gray-500 rounded-md text-[12px] text-gray-700"
                  >
                    {opt?.label ?? val}
                    <span
                      onClick={(e) => removeTag(val, e)}
                      className="cursor-pointer text-gray-600 hover:text-gray-600"
                    >
                      ✕
                    </span>
                  </span>
                );
              })
            )
          ) : (
            <span
              className={`text-[15px] ${
                selected ? "text-gray-800" : "text-gray-400"
              }`}
            >
              {selected
                ? options.find((o) => o.value === selected)?.label
                : placeholder}
            </span>
          )}
        </div>
        {/* count + max */}
        {multiple && (
          <span className="text-[11px] text-gray-400 flex-shrink-0">
            {(selected as string[]).length}
            {maxSelect ? `/${maxSelect}` : ""}
          </span>
        )}
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* 🔹 Dropdown */}
      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 z-50 bg-white border border-gray-400 shadow-md rounded-lg overflow-hidden">
          {searchable && (
            <div className="p-2">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="w-full px-2.5 py-1.5 text-[13px] border border-gray-200 rounded-md
                  bg-gray-50 text-gray-800 outline-none focus:border-gray-400"
              />
            </div>
          )}

          <div className="max-h-52 overflow-y-auto pb-1">
            {filtered.length === 0 ? (
              <p className="py-3 text-center text-[13px] text-gray-400">
                No results
              </p>
            ) : (
              filtered.map((opt) => {
                const disabledOpt = isDisabledOption(opt.value);

                return (
                  <div
                    key={opt.value}
                    onClick={() => !disabledOpt && toggle(opt.value)}
                    className={`
                      flex items-center gap-2.5 px-3 py-2 text-[13px]
                      transition-colors
                      ${
                        disabledOpt
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-700 cursor-pointer hover:bg-gray-50"
                      }
                    `}
                  >
                    {multiple ? (
                      <div
                        className={`w-[15px] h-[15px] rounded border flex items-center justify-center
                        ${
                          isSelected(opt.value)
                            ? "bg-blue-500 border-blue-500"
                            : "border-gray-300 bg-white hover:border-blue-400"
                        }`}
                      >
                        {isSelected(opt.value) && (
                          <svg
                            className="w-3 h-3 text-white"
                            viewBox="0 0 12 12"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path
                              d="M2 6l2.5 2.5L10 3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`w-[15px] h-[15px] rounded-full border flex items-center justify-center
                        ${
                          isSelected(opt.value)
                            ? "border-gray-800"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected(opt.value) && (
                          <div className="w-[7px] h-[7px] rounded-full bg-gray-800" />
                        )}
                      </div>
                    )}
                    {opt.label}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomSelect;
