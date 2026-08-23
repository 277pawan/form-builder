import React, { useRef, useState } from "react";
import CustomSelect from "../customSelect/customSelect";
import { mergeClasses, ClassValue } from "../../utils/mergeClasses";

interface inputField {
  name: string;
  placeholder?: string;
  label?: string;

  default?: { label: string; value: string | string[] };
  dropdownClassName?: ClassValue;
  optionsClassName?: ClassValue;
  optionClassName?: ClassValue;
  type?: string;
  required?: boolean;
  arialabel?: string;
  maxFiles?: number;
  selectlabel?: string;
  accept?: string;
  className?: ClassValue;
  options?: { label: string; value: string }[];
  checklimit?: number;
  passwordToggle?: boolean;
  searchable?: boolean;
  maxSelect?: number;

  icon?: {
    show?: React.ComponentType;
    hide?: React.ComponentType;
  };

  labelClassName?: ClassValue;
  requiredClassName?: ClassValue;
  errorClassName?: ClassValue;
  focusClassName?: ClassValue;
  wrapperClassName?: ClassValue;
  fieldWrapperClassName?: ClassValue;
  fieldContainerClassName?: ClassValue;
  passwordToggleClassName?: ClassValue;

  addButtonText?: string;
  addBtnText?: string;
  removeButtonText?: string;
  removeBtnText?: string;

  addButtonClassName?: ClassValue;
  addBtnClassName?: ClassValue;
  removeButtonClassName?: ClassValue;
  removeBtnClassName?: ClassValue;

  itemClassName?: ClassValue;
  fields?: inputField[];

  errorPosition?: "top" | "bottom";

  style?: React.CSSProperties;
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface Props {
  textfield: inputField & {
    resolvedOptions?: { label: string; value: string }[];
  };

  value: any;

  onChange: (name: string, value: any) => void;

  className?: ClassValue;

  formErrors?: FormErrors;

  formLabelClassName?: ClassValue;
  formRequiredClassName?: ClassValue;
  formErrorClassName?: ClassValue;
  formFocusClassName?: ClassValue;
  formPasswordToggleClassName?: ClassValue;
  formInputClassName?: ClassValue;

  formErrorPosition?: "top" | "bottom";

  onAddArrayItem?: () => void;

  onRemoveArrayItem?: (index: number) => void;

  onUpdateArrayItem?: (index: number, subName: string, value: unknown) => void;
}

function Inputtag(props: Props) {
  const {
    textfield,
    value,
    onChange,
    className,
    formErrors,
    formLabelClassName,
    formRequiredClassName,
    formErrorClassName,
    formFocusClassName,
    formPasswordToggleClassName,
    formInputClassName,
    formErrorPosition,
    onAddArrayItem,
    onRemoveArrayItem,
    onUpdateArrayItem,
  } = props;

  const {
    name,
    label,
    placeholder,
    required,
    type,
    arialabel,
    maxFiles = 1,
    options = [],
    checklimit = 1,
    passwordToggle = false,
    icon,
    searchable = false,
    maxSelect = 2,
    fields: nestedFields = [],

    // Get default value
    default: defaultValue,
  } = textfield;

  const labelCls = textfield.labelClassName ?? formLabelClassName;

  const requiredCls = textfield.requiredClassName ?? formRequiredClassName;

  const errorCls = textfield.errorClassName ?? formErrorClassName;

  const focusCls = textfield.focusClassName ?? formFocusClassName;

  const passToggleCls =
    textfield.passwordToggleClassName ?? formPasswordToggleClassName;

  const errorPos = textfield.errorPosition ?? formErrorPosition ?? "top";

  /**
   * Use resolvedOptions when available.
   * Otherwise use the options directly from the field config.
   */
  const selectOptions = textfield.resolvedOptions ?? options;

  /**
   * ---------------------------------------------------------
   * DEFAULT VALUE FOR SELECT / MULTISELECT
   * ---------------------------------------------------------
   *
   * If a value is already provided by the form state,
   * use that value.
   *
   * Otherwise use the field's default value.
   *
   * Select:
   *   "india"
   *
   * Multiselect:
   *   ["react", "typescript"]
   */
  const selectValue =
    value !== undefined && value !== null
      ? value
      : type === "multiselect"
        ? Array.isArray(defaultValue?.value)
          ? defaultValue.value
          : defaultValue?.value
            ? [defaultValue.value]
            : []
        : Array.isArray(defaultValue?.value)
          ? (defaultValue.value[0] ?? "")
          : (defaultValue?.value ?? "");

  const [fileError, setFileError] = useState<string>("");

  const [showPassword, setShowPassword] = useState<boolean>(false);

  /**
   * Ref to reset the file input so the same file
   * can be selected again after removal.
   */
  const fileInputRef = useRef<HTMLInputElement>(null);

  const DefaultShowIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />

      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7z"
      />
    </svg>
  );

  const DefaultHideIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21"
      />
    </svg>
  );

  const HideIcon = icon?.hide || DefaultHideIcon;

  const ShowIcon = icon?.show || DefaultShowIcon;

  /**
   * ---------------------------------------------------------
   * NORMAL INPUT CHANGE
   * ---------------------------------------------------------
   */
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: targetVal, checked, type: targetType } = e.target;

    if (targetType === "checkbox") {
      const currentVal = Array.isArray(value) ? value : [];

      if (checked) {
        if (currentVal.length >= checklimit) {
          return;
        }

        onChange(name, [...currentVal, targetVal]);
      } else {
        onChange(
          name,
          currentVal.filter((item) => item !== targetVal),
        );
      }
    } else {
      onChange(name, targetVal);
    }
  };

  /**
   * ---------------------------------------------------------
   * FILE INPUT
   * ---------------------------------------------------------
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];

    const existing: File[] = Array.isArray(value) ? value : [];

    /**
     * maxFiles === 0 means unlimited.
     */
    if (maxFiles > 0 && existing.length + selected.length > maxFiles) {
      setFileError(
        `You can upload a maximum of ${maxFiles} file${
          maxFiles > 1 ? "s" : ""
        }`,
      );

      /**
       * Reset so the same file can be
       * selected again.
       */
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    const updated = [...existing, ...selected];

    setFileError("");

    onChange(name, updated);

    /**
     * Reset input value so selecting
     * the same file fires onChange again.
     */
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * ---------------------------------------------------------
   * REMOVE FILE
   * ---------------------------------------------------------
   */
  const removeFile = (index: number) => {
    const existing: File[] = Array.isArray(value) ? value : [];

    const updated = [...existing];

    updated.splice(index, 1);

    setFileError("");

    onChange(name, updated);

    /**
     * Reset input so removed file
     * can be selected again.
     */
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const hasError = Boolean(formErrors && formErrors[name]);

  /**
   * ---------------------------------------------------------
   * BASE INPUT CLASSES
   * ---------------------------------------------------------
   */
  const baseInputClass = mergeClasses(
    `
      ml-[1px]
      p-2
      w-full
      border
      border-gray-300
      my-1
      rounded-md
      text-black
      transition-colors
      bg-white
      focus:outline-none
      focus:border-blue-500
      [&::-ms-reveal]:block
      [&::-webkit-credentials-auto-fill-button]:visible
    `,
    mergeClasses(
      formInputClassName,
      mergeClasses(
        className,
        mergeClasses(
          focusCls,
          hasError
            ? `
              border-red-500
              focus:border-red-500
              focus:ring-1
              focus:ring-red-500
            `
            : undefined,
        ),
      ),
    ),
  );

  return (
    <>
      {/* =====================================================
          LABEL
      ===================================================== */}
      {label && (
        <div className="flex items-center justify-between mb-1 w-full">
          <label
            htmlFor={name}
            className={mergeClasses(
              "text-black text-sm font-semibold block",
              labelCls,
            )}
          >
            {label}

            {required && (
              <span className={mergeClasses("text-red-500 ml-1", requiredCls)}>
                *
              </span>
            )}
          </label>

          {errorPos === "top" && formErrors && formErrors[name] && (
            <span
              className={mergeClasses(
                "text-xs text-red-500 font-medium",
                errorCls,
              )}
            >
              {formErrors[name]}
            </span>
          )}
        </div>
      )}

      {/* =====================================================
          FILE INPUT
      ===================================================== */}
      {type === "file" && (
        <div className="w-full">
          <label
            htmlFor={name}
            className={mergeClasses(
              mergeClasses(
                `
                flex
                flex-col
                items-center
                justify-center
                w-full
                min-h-[80px]
                border-2
                border-dashed
                rounded-lg
                cursor-pointer
                transition-colors
                my-1
                `,
                maxFiles > 0 && Array.isArray(value) && value.length >= maxFiles
                  ? `
                  border-gray-300
                  bg-gray-100
                  opacity-50
                  cursor-not-allowed
                  `
                  : `
                    border-blue-400
                    bg-blue-50
                    hover:bg-blue-100
                    `,
              ),
                className,
            )}
          >
            <span className="text-sm text-blue-600 font-medium mt-1">
              {maxFiles > 0 && Array.isArray(value) && value.length >= maxFiles
                ? `Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""} reached`
                : `${textfield.selectlabel || "Click to upload"}${
                    maxFiles > 1 ? ` (up to ${maxFiles} files)` : ""
                  }`}
            </span>

            <span className="text-xs text-gray-400 mt-0.5">
              {Array.isArray(value) && value.length > 0
                ? maxFiles > 0
                  ? `${value.length} / ${maxFiles} selected`
                  : `${value.length} selected`
                : "No file chosen"}
            </span>
          </label>

          <input
            ref={fileInputRef}
            className="hidden"
            type="file"
            id={name}
            name={name}
            multiple={maxFiles === 0 || maxFiles > 1}
            onChange={handleFileChange}
            required={required && !(Array.isArray(value) && value.length > 0)}
            aria-label={arialabel}
            accept={textfield.accept || "*/*"}
            disabled={
              maxFiles > 0 && Array.isArray(value) && value.length >= maxFiles
            }
          />

          {/* File error */}
          {fileError && (
            <p className="text-xs text-red-500 mt-1">{fileError}</p>
          )}

          {/* Preview */}
          {Array.isArray(value) && value.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {value.map((file: File, index: number) => (
                <div
                  key={index}
                  className="
                        relative
                        w-24
                        h-24
                        border
                        border-gray-300
                        rounded-lg
                        overflow-hidden
                        shadow-sm
                        bg-gray-50
                        group
                      "
                >
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="
                          absolute
                          top-1
                          right-0
                          p-0
                          z-10
                          w-5
                          h-5
                          flex
                          items-center
                          justify-center
                          rounded-full
                          bg-slate-700
                          text-white
                          text-xl
                          font-bold
                          opacity-80
                          hover:opacity-100
                          transition-opacity
                          shadow
                        "
                    aria-label={`Remove ${file.name}`}
                  >
                    ×
                  </button>

                  {file.type?.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="
                            w-full
                            h-full
                            object-cover
                          "
                    />
                  ) : (
                    <div
                      className="
                            w-full
                            h-full
                            flex
                            flex-col
                            items-center
                            justify-center
                            p-1
                            gap-1
                          "
                    >
                      <span className="text-2xl">📄</span>

                      <span
                        className="
                              text-[10px]
                              text-gray-600
                              text-center
                              break-all
                              leading-tight
                              px-1
                              line-clamp-2
                            "
                      >
                        {file.name}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================
          CHECKBOX / RADIO
      ===================================================== */}
      {(type === "checkbox" || type === "radio") &&
        selectOptions?.map((option, index) => (
          <label
            key={option.value || index}
            className="flex items-center gap-2"
          >
            <input
              className={baseInputClass}
              type={type}
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={
                type === "checkbox"
                  ? Array.isArray(value) && value.includes(option.value)
                  : value === option.value
              }
              onChange={handleTextChange}
              disabled={
                type === "checkbox" &&
                Array.isArray(value) &&
                value.length >= checklimit &&
                !value.includes(option.value)
              }
            />

            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}

      {/* =====================================================
          NORMAL INPUT
      ===================================================== */}
      {type !== "file" &&
        type !== "checkbox" &&
        type !== "radio" &&
        type !== "select" &&
        type !== "multiselect" &&
        type !== "array" &&
        (type === "password" && passwordToggle ? (
          <div className="relative w-full">
            <input
              className={`${baseInputClass} pr-10`}
              style={textfield.style}
              type={showPassword ? "text" : "password"}
              id={name}
              name={name}
              placeholder={placeholder}
              value={value ?? ""}
              onChange={handleTextChange}
              required={required}
              aria-label={arialabel}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={mergeClasses(
                `
                  absolute
                  right-0
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-gray-700
                  bg-transparent
                  border-none
                  outline-none
                  focus:outline-none
                  focus:ring-0
                `,
                passToggleCls,
              )}
            >
              {showPassword ? <ShowIcon /> : <HideIcon />}
            </button>
          </div>
        ) : (
          <input
            className={baseInputClass}
            style={textfield.style}
            type={type || "text"}
            id={name}
            name={name}
            placeholder={placeholder}
            value={value ?? ""}
            onChange={handleTextChange}
            required={required}
          />
        ))}

      {/* =====================================================
          SELECT / MULTISELECT
      ===================================================== */}
      {(type === "select" || type === "multiselect") && (
        <CustomSelect
          name={name}
          options={selectOptions}
          value={selectValue}
          onChange={onChange}
          multiple={type === "multiselect"}
          placeholder={textfield.placeholder}
          searchable={searchable}
          maxSelect={maxSelect}
          className={mergeClasses(
            mergeClasses(baseInputClass, textfield.className),
            className,
          )}
          style={textfield.style}
          dropdownClassName={textfield.dropdownClassName}
          optionsClassName={textfield.optionsClassName}
          optionClassName={textfield.optionClassName}
        />
      )}

      {/* =====================================================
          ARRAY FIELD
      ===================================================== */}
      {type === "array" && (
        <div
          className={mergeClasses(
            "w-full space-y-3",
            textfield.className || className,
          )}
        >
          {(Array.isArray(value) ? value : []).map(
            (row: Record<string, unknown>, rowIndex: number) => (
              <div
                key={rowIndex}
                className={mergeClasses(
                  `
                    border
                    border-gray-200
                    rounded-lg
                    p-3
                    space-y-2
                    bg-gray-50
                  `,
                  textfield.itemClassName,
                )}
              >
                {nestedFields.map((sub: inputField) => (
                  <div key={sub.name}>
                    {sub.label && (
                      <label
                        className="
                            text-black
                            text-xs
                            font-semibold
                            mb-1
                            block
                          "
                      >
                        {sub.label}
                      </label>
                    )}

                    <input
                      className={mergeClasses(
                        `
                            p-2
                            w-full
                            border-2
                            my-1
                            rounded-md
                            text-black
                            transition-colors
                            border-gray-300
                            bg-white
                            focus:outline-none
                            focus:border-blue-500
                          `,
                        sub.className,
                      )}
                      type={sub.type === "number" ? "number" : "text"}
                      value={(row[sub.name] as string) ?? ""}
                      placeholder={sub.placeholder}
                      onChange={(e) =>
                        onUpdateArrayItem?.(
                          rowIndex,
                          sub.name,
                          sub.type === "number"
                            ? Number(e.target.value)
                            : e.target.value,
                        )
                      }
                    />
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => onRemoveArrayItem?.(rowIndex)}
                  className={mergeClasses(
                    `
                      text-xs
                      text-red-600
                      hover:text-red-700
                      font-medium
                      cursor-pointer
                      transition-colors
                    `,
                    textfield.removeButtonClassName ||
                      textfield.removeBtnClassName,
                  )}
                >
                  {textfield.removeButtonText ||
                    textfield.removeBtnText ||
                    "Remove"}
                </button>
              </div>
            ),
          )}

          <button
            type="button"
            onClick={() => onAddArrayItem?.()}
            className={mergeClasses(
              `
                text-sm
                text-blue-600
                hover:text-blue-700
                font-medium
                cursor-pointer
                transition-colors
                block
              `,
              textfield.addButtonClassName || textfield.addBtnClassName,
            )}
          >
            {textfield.addButtonText ||
              textfield.addBtnText ||
              `+ Add ${label || name}`}
          </button>
        </div>
      )}

      {/* =====================================================
          VALIDATION ERROR
      ===================================================== */}
      {(errorPos === "bottom" || !label) && formErrors && formErrors[name] && (
        <span
          className={mergeClasses(
            `
                text-xs
                text-red-500
                font-medium
                mt-1
                block
              `,
            errorCls,
          )}
        >
          {formErrors[name]}
        </span>
      )}
    </>
  );
}

export default Inputtag;
