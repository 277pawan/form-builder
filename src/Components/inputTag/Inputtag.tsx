import React, { useRef, useState } from "react";

interface inputField {
  name: string;
  placeholder?: string;
  label?: string;
  type?: string;
  required?: boolean;
  arialabel?: string;
  maxFiles?: number;
  selectlabel?: string;
  accept?: string;
  className?: string[];
  options?: { label: string; value: string }[];
  checklimit?: number;
}

interface FormErrors {
  [key: string]: string | undefined;
}

interface Props {
  textfield: inputField;
  value: any;
  onChange: (name: string, value: any) => void;
  className?: string[];
  formErrors?: FormErrors;
}

function Inputtag(props: Props) {
  const { textfield, value, onChange, className, formErrors } = props;
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
  } = textfield;

  const [fileError, setFileError] = useState<string>("");
  // ✅ Ref to reset the file input so re-adding the same file works
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ Dedicated handler for normal inputs
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked, type } = e.target;

    if (type === "checkbox") {
      onChange(name, (prev: string[] = []) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        console.log(checklimit, safePrev.length);

        if (checked) {
          // limit check
          if (safePrev.length >= checklimit) {
            return safePrev; //  ignore extra selection
          }
          return [...safePrev, value]; //  add
        } else {
          return safePrev.filter((item) => item !== value); // remove
        }
      });
    } else {
      onChange(name, value);
    }
  };

  // ✅ Dedicated handler for file inputs
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files ? Array.from(e.target.files) : [];
    const existing: File[] = Array.isArray(value) ? value : [];

    if (existing.length + selected.length > maxFiles) {
      setFileError(
        `You can upload a maximum of ${maxFiles} file${maxFiles > 1 ? "s" : ""}`,
      );
      // Reset so the same file can be tried again
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const updated = [...existing, ...selected];
    setFileError("");
    onChange(name, updated);
    // ✅ Reset input value so re-selecting the same file fires onChange
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    const existing: File[] = Array.isArray(value) ? value : [];
    const updated = [...existing];
    updated.splice(index, 1);
    setFileError("");
    onChange(name, updated);
    // ✅ Always reset so the removed file can be re-added
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const baseInputClass = `p-2 w-full border-2 my-1 rounded text-black transition-colors
    border-gray-300 bg-gray-100 focus:outline-none focus:border-blue-500 focus:bg-white
    ${className ? className.join(" ") : ""}`;

  return (
    <>
      {label && (
        <label
          htmlFor={name}
          className="text-black text-sm font-semibold mb-1 block"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* ───── FILE INPUT ───── */}
      {type === "file" && (
        <div className="w-full">
          {/* Drop-zone style upload button */}
          <label
            htmlFor={name}
            className={`flex flex-col items-center justify-center w-full min-h-[80px] border-2 border-dashed rounded-lg cursor-pointer transition-colors my-1
    ${className ? className.join(" ") : ""}
    ${
      Array.isArray(value) && value.length >= maxFiles
        ? "border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed"
        : "border-blue-400 bg-blue-50 hover:bg-blue-100"
    }`}
          >
            <span className="text-sm text-blue-600 font-medium mt-1">
              {Array.isArray(value) && value.length >= maxFiles
                ? `Maximum ${maxFiles} file${maxFiles > 1 ? "s" : ""} reached`
                : `${textfield.selectlabel || "Click to upload"}${maxFiles > 1 ? ` (up to ${maxFiles} files)` : ""}`}
            </span>
            <span className="text-xs text-gray-400 mt-0.5">
              {Array.isArray(value) && value.length > 0
                ? `${value.length} / ${maxFiles} selected`
                : "No file chosen"}
            </span>
          </label>

          <input
            ref={fileInputRef}
            className="hidden"
            type="file"
            id={name}
            name={name}
            multiple={maxFiles > 1}
            onChange={handleFileChange}
            required={required && !(Array.isArray(value) && value.length > 0)}
            aria-label={arialabel}
            accept={textfield.accept || "*/*"}
            disabled={Array.isArray(value) && value.length >= maxFiles}
          />

          {/* File error */}
          {fileError && (
            <p className="text-xs text-red-500 mt-1">{fileError}</p>
          )}

          {/* Preview grid */}
          {Array.isArray(value) && value.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-2">
              {value.map((file: File, index: number) => (
                <div
                  key={index}
                  className="relative w-24 h-24 border border-gray-300 rounded-lg overflow-hidden shadow-sm bg-gray-50 group"
                >
                  {/*  Remove button */}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-1 right-0 p-0 z-10 w-5 h-5 flex items-center justify-center
                      rounded-full bg-slate-700 text-white text-xl font-bold
                      opacity-80 hover:opacity-100 transition-opacity shadow"
                    aria-label={`Remove ${file.name}`}
                  >
                    ×
                  </button>

                  {/* Image preview */}
                  {file.type?.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-1 gap-1">
                      <span className="text-2xl">📄</span>
                      <span className="text-[10px] text-gray-600 text-center break-all leading-tight px-1 line-clamp-2">
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

      {(type === "checkbox" || type === "radio") &&
        options?.map((option, index) => (
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
                !value.includes(option.value) // allow unchecking
              }
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}

      {/* ───── NORMAL INPUT ───── */}
      {type !== "file" && type !== "checkbox" && type !== "radio" && (
        <input
          className={baseInputClass}
          type={type || "text"}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={handleTextChange} // ✅ correct handler
          required={required ?? true}
          aria-label={arialabel}
          onWheel={(e) => {
            if (type === "number") e.currentTarget.blur();
          }}
          aria-required={required ?? true}
          style={{
            backgroundColor: "#d7d7d7",
            WebkitTextFillColor: "black",
            transition: "background-color 0s, color 0s",
          }}
        />
      )}

      {/* Validation errors */}
      {formErrors && formErrors[name] && (
        <span className="text-sm text-red-600 mt-0.5 block">
          {formErrors[name]}
        </span>
      )}
    </>
  );
}

export default Inputtag;
