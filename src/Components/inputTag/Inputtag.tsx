import React, { useState, useEffect, useRef } from "react";

interface inputField<T> {
  name: keyof T;
  placeholder?: string;
  label?: string;
  type?: string;
  required?: boolean;
  arialabel?: string;
  number?: number;
  preview?: "name" | "image";
  previewClassName?: string[];
  icon?: React.ReactNode;
}

interface Props<T> {
  textfield: inputField<T>;
  value: any;
  onChange: <K extends keyof T>(name: K, value: T[K]) => void;
  className?: string[];
  formErrors?: Partial<Record<keyof T, string>>;
  arialabel?: string;
}

function Inputtag<T>(props: Props<T>) {
  const { textfield, value, onChange, className, formErrors } = props;
  const {
    name,
    number = 1,
    icon,
    preview,
    previewClassName,
    label,
    required,
    placeholder,
    type,
    arialabel,
  } = textfield;

  // Track files locally but ensure form data is updated properly
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize files from value if it's an array
  useEffect(() => {
    if (type === "file") {
      if (Array.isArray(value) && value.length > 0) {
        setFiles(value);
      } else if (
        Array.isArray(value) &&
        value.length === 0 &&
        files.length > 0
      ) {
        // Reset the file input when value is an empty array but files has items
        setFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  }, [value, type, files.length]);

  // Function for Uploading Files
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: keyof T,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const newFiles = [...files, ...selectedFiles].slice(0, number);

      setFiles(newFiles);
      // Update the form data with the new files array
      onChange(name, newFiles as unknown as T[keyof T]);
    }
  };

  const handleDeleteFunc = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);

    // If all files are deleted, reset the file input element
    if (newFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onChange(name, newFiles as unknown as T[keyof T]);
  };

  // Function for changing the input type of the element
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue: any = event.target.value;

    switch (textfield.type) {
      case "number":
        inputValue =
          event.target.value === "" ? "" : Number(event.target.value);
        break;
      case "date":
        inputValue = event.target.value ? new Date(event.target.value) : "";
        break;
      case "time":
        inputValue = event.target.value;
        break;
      case "checkbox":
        inputValue = event.target.checked;
        break;
      case "file":
        // File handling is done in handleFileChange
        handleFileChange(event as React.ChangeEvent<HTMLInputElement>, name);
        return; // Return early to avoid the onChange call at the end
      default:
        inputValue = event.target.value;
        break;
    }
    onChange(name, inputValue);
  };

  return (
    <>
      {label && (
        <label
          className="text-black text-md font-semibold"
          htmlFor={name as string}
        >
          {label}
        </label>
      )}

      {type !== "file" && (
        <input
          className={`autofill-input p-2 w-full border-2 border-gray-500 my-1 rounded bg-gray-200 text-black ${className?.join(" ") ?? ""}`}
          type={type || "text"}
          id={name as string}
          name={name as string}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required={required ?? true}
          aria-label={arialabel}
          aria-required={required ?? true}
          style={{
            backgroundColor: "#d7d7d7",
            WebkitTextFillColor: "black",
            transition: "background-color 0s, color 0s",
          }}
        />
      )}

      {type === "file" && (
        <>
          <input
            ref={fileInputRef}
            className={`autofill-input p-2 w-full border-2 border-gray-500 my-1 rounded bg-gray-200 text-black ${className?.join(" ") ?? ""}`}
            type="file"
            id={name as string}
            name={name as string}
            placeholder={placeholder}
            onChange={handleChange}
            required={required ?? true}
            aria-label={arialabel}
            aria-required={required ?? true}
            multiple={number > 1}
            disabled={files.length >= number}
            style={{
              backgroundColor: "#d7d7d7",
              WebkitTextFillColor: "black",
              transition: "background-color 0s, color 0s",
            }}
          />
          {preview === "image" ? (
            <div className="flex justify-start flex-wrap gap-2 items-center mt-2">
              {files?.length > 0 &&
                files.map((file, index) => (
                  <div
                    key={index}
                    className={`relative flex justify-center items-center bg-gray-200 w-auto p-2 rounded-lg`}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      className={`h-24 w-24 ${previewClassName ? previewClassName.join("") : ""}`}
                      aria-label={file.name}
                      alt={file.name}
                    />
                    <span
                      className="absolute right-2 top-2 text-xl inline-block font-bold cursor-pointer"
                      onClick={() => handleDeleteFunc(index)}
                    >
                      {icon ? icon : "X"}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex justify-start flex-wrap gap-2 items-center mt-2">
              {files?.length > 0 &&
                files.map((file, index) => (
                  <div
                    key={index}
                    className={`flex justify-center items-center bg-gray-200 w-auto p-2 rounded-lg`}
                  >
                    {file.name}
                    <span
                      className="ml-2 text-xl inline-block font-bold cursor-pointer"
                      onClick={() => handleDeleteFunc(index)}
                    >
                      {icon ? icon : "X"}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </>
      )}

      {formErrors && formErrors[name] && (
        <span className="text-sm font-medium text-red-400">
          {formErrors[name]}
        </span>
      )}
    </>
  );
}

export default Inputtag;
