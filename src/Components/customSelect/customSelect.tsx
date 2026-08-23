import React, { useEffect, useRef, useState } from "react";
import { mergeClasses, ClassValue } from "../../utils/mergeClasses";

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

  /**
   * Styles the closed select trigger.
   */
  className?: ClassValue;

  /**
   * Styles the opened dropdown container.
   *
   * This includes the search area and options wrapper.
   */
  dropdownClassName?: ClassValue;
  optionsClassName?: ClassValue;
  /** @deprecated Use optionsClassName instead */
  optionClassName?: ClassValue;
  style?: React.CSSProperties;

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
  dropdownClassName = "",
  optionsClassName,
  optionClassName,
  style,
  searchable = false,
  maxSelect,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const optionClasses = optionsClassName ?? optionClassName;

  const containerRef = useRef<HTMLDivElement>(null);

  const searchRef = useRef<HTMLInputElement>(null);

  /**
   * ---------------------------------------------------------
   * SELECT TRIGGER
   * ---------------------------------------------------------
   */
  const baseInputClass = mergeClasses(
    `p-2 w-full border-2 my-1 rounded-md text-black transition-colors border-gray-400 bg-white flex items-center gap-2 cursor-pointer select-none ${
      open ? "border-blue-500" : "hover:border-gray-500"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`,
    className,
  );

  /**
   * ---------------------------------------------------------
   * NORMALIZE SELECTED VALUE
   * ---------------------------------------------------------
   */
  const selected = multiple
    ? Array.isArray(value)
      ? value
      : []
    : ((value as string) ?? "");

  /**
   * ---------------------------------------------------------
   * MAX SELECTION
   * ---------------------------------------------------------
   */
  const isMaxReached =
    multiple &&
    Array.isArray(selected) &&
    maxSelect !== undefined &&
    selected.length >= maxSelect;

  /**
   * ---------------------------------------------------------
   * SEARCH / FILTER
   * ---------------------------------------------------------
   */
  const filtered = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(search.toLowerCase()),
      )
    : options;

  /**
   * ---------------------------------------------------------
   * CHECK WHETHER OPTION IS SELECTED
   * ---------------------------------------------------------
   */
  const isSelected = (val: string) =>
    multiple ? (selected as string[]).includes(val) : selected === val;

  /**
   * ---------------------------------------------------------
   * CHECK WHETHER OPTION IS DISABLED
   * ---------------------------------------------------------
   */
  const isDisabledOption = (val: string) => {
    if (!multiple || maxSelect === undefined) {
      return false;
    }

    if (!isMaxReached) {
      return false;
    }

    /**
     * Already selected options must remain
     * clickable so users can remove them.
     */
    return !isSelected(val);
  };

  /**
   * ---------------------------------------------------------
   * SELECT / UNSELECT OPTION
   * ---------------------------------------------------------
   */
  const toggle = (val: string) => {
    if (multiple) {
      const arr = Array.isArray(selected) ? selected : [];

      /**
       * Remove selected value.
       */
      if (arr.includes(val)) {
        onChange(
          name,
          arr.filter((current) => current !== val),
        );

        return;
      }

      /**
       * Don't allow more selections than
       * maxSelect.
       */
      if (maxSelect !== undefined && arr.length >= maxSelect) {
        return;
      }

      /**
       * Add new value.
       */
      onChange(name, [...arr, val]);
    } else {
      /**
       * Normal select only has one value.
       */
      onChange(name, val);

      /**
       * Close dropdown after selection.
       */
      setOpen(false);
      setSearch("");
    }
  };

  /**
   * ---------------------------------------------------------
   * REMOVE MULTISELECT TAG
   * ---------------------------------------------------------
   */
  const removeTag = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const arr = Array.isArray(selected) ? selected : [];

    onChange(
      name,
      arr.filter((current) => current !== val),
    );
  };

  /**
   * ---------------------------------------------------------
   * CLOSE DROPDOWN WHEN CLICKING OUTSIDE
   * ---------------------------------------------------------
   */
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

  /**
   * ---------------------------------------------------------
   * AUTO FOCUS SEARCH
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (open && searchable) {
      searchRef.current?.focus();
    }
  }, [open, searchable]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* =====================================================
          SELECT TRIGGER
      ===================================================== */}
      <div
        onClick={() => !disabled && setOpen((current) => !current)}
        className={baseInputClass}
        style={style}
      >
        {/* Selected values */}
        <div className="flex flex-wrap gap-1 flex-1 min-w-0">
          {multiple ? (
            (selected as string[]).length === 0 ? (
              <span className="text-[13px] text-gray-400">{placeholder}</span>
            ) : (
              (selected as string[]).map((val) => {
                const opt = options.find((option) => option.value === val);

                return (
                  <span
                    key={val}
                    className={mergeClasses(
                      `
                        inline-flex
                        items-center
                        gap-1
                        px-2
                        py-0.5
                        bg-gray-100
                        border
                        border-gray-500
                        rounded-md
                        text-[12px]
                        text-gray-700
                      `,
                      optionClasses,
                    )}
                  >
                    {opt?.label ?? val}

                    <span
                      onClick={(e) => removeTag(val, e)}
                      className="cursor-pointer text-inherit opacity-70 hover:opacity-100"
                    >
                      ✕
                    </span>
                  </span>
                );
              })
            )
          ) : (
            <span
              className={mergeClasses(
                `text-[15px] ${selected ? "text-gray-800" : "text-gray-400"}`,
                optionClasses,
              )}
            >
              {selected
                ? options.find((option) => option.value === selected)?.label
                : placeholder}
            </span>
          )}
        </div>

        {/* Count */}
        {multiple && (
          <span className="text-[11px] text-gray-400 flex-shrink-0">
            {(selected as string[]).length}
            {maxSelect ? `/${maxSelect}` : ""}
          </span>
        )}

        {/* Chevron */}
        <svg
          className={`
            w-4
            h-4
            text-gray-500
            transition-transform
            ${open ? "rotate-180" : ""}
          `}
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* =====================================================
          DROPDOWN
      ===================================================== */}
      {open && (
        <div
          className={mergeClasses(
            `
              absolute
              top-full
              mt-1
              left-0
              right-0
              z-50
              bg-white
              border
              border-gray-400
              shadow-md
              rounded-lg
              overflow-hidden
            `,
            dropdownClassName,
          )}
        >
          {/* =================================================
              SEARCH
          ================================================= */}
          {searchable && (
            <div className="p-2">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="Search…"
                className="
                  w-full
                  px-2.5
                  py-1.5
                  text-[13px]
                  border
                  border-gray-200
                  rounded-md
                  bg-inherit
                  text-inherit
                  placeholder:text-current/50
                  outline-none
                  focus:border-gray-400
                "
              />
            </div>
          )}

          {/* =================================================
              OPTIONS
          ================================================= */}
          <div className="max-h-52 overflow-y-auto pb-1">
            {filtered.length === 0 ? (
              <p className="py-3 text-center text-[13px] text-gray-400">
                No results
              </p>
            ) : (
              filtered.map((opt) => {
                const disabledOpt = isDisabledOption(opt.value);

                const selectedOption = isSelected(opt.value);

                return (
                  <div
                    key={opt.value}
                    onClick={() => !disabledOpt && toggle(opt.value)}
                    className={mergeClasses(
                      `
                      flex
                      items-center
                      gap-2.5
                      px-3
                      py-2
                      text-[13px]
                      transition-colors

                      ${
                        disabledOpt
                          ? `
                            text-gray-300
                            cursor-not-allowed
                          `
                          : `
                            text-gray-700
                            cursor-pointer
                            hover:bg-gray-50
                          `
                      }
                      `,
                      optionClasses,
                    )}
                  >
                    {/* Checkbox */}
                    {multiple ? (
                      <div
                        className={`
                          w-[15px]
                          h-[15px]
                          rounded
                          border
                          flex
                          items-center
                          justify-center

                          ${
                            selectedOption
                              ? `
                                bg-blue-500
                                border-blue-500
                              `
                              : `
                                border-current/30
                                bg-transparent
                                hover:border-current
                              `
                          }
                        `}
                      >
                        {selectedOption && (
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
                      /* Radio */
                      <div
                        className={`
                          w-[15px]
                          h-[15px]
                          rounded-full
                          border
                          flex
                          items-center
                          justify-center

                          ${
                            selectedOption
                              ? "border-current"
                              : "border-current/30"
                          }
                        `}
                      >
                        {selectedOption && (
                          <div className="w-[7px] h-[7px] rounded-full bg-current" />
                        )}
                      </div>
                    )}

                    {/* Label */}
                    <span>{opt.label}</span>
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
