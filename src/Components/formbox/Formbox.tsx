import React, { SetStateAction, useEffect, useRef, useState } from "react";
import Inputtag from "../inputTag/Inputtag";
import Buttontag from "../button/Buttontag";
import { z } from "zod";
import { mergeClasses } from "../../utils/mergeClasses";

interface inputField {
  name: string;
  placeholder?: string;
  label?: string;
  type?: string;
  required?: boolean;
  className?: string[];
  arialabel?: string;
  maxFiles?: number;
  selectlabel?: string;
  accept?: string;
  options?: { label: string; value: string }[];
  checklimit?: number;
  passwordToggle?: boolean;
  searchable?: boolean;
  maxSelect?: number;
  icon?: { show: React.ComponentType; hide: React.ComponentType };
}

interface LoaderType {
  loader: boolean;
  className?: string[];
}
interface Button {
  name: string;
  type: "submit" | "reset" | "cancel" | "ok" | "button";
  className?: string[];
  function?: (data: unknown, e: React.MouseEvent) => void;
  arialabel?: string;
  tooltip?: string;
  disabled?: boolean;
  loader?: LoaderType;
}

interface FormTitle {
  title: string;
  className?: string[];
}
interface Message {
  message: string;
  className?: string[];
}
interface Props {
  className?: string[];
  textfield?: inputField[]; // Make this prop optional
  buttons?: Button[];
  formtitle?: FormTitle[];
  formtoogle: React.Dispatch<SetStateAction<boolean>>;
  message?: Message[];
  validationSchema?: z.ZodObject<any>;
}

function Formbox(props: Props) {
  const {
    className,
    formtoogle,
    message,
    textfield,
    buttons,
    formtitle,
    validationSchema,
  } = props;
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: any }>({});
  const [initialFormData, setInitialFormData] = useState<{
    [key: string]: unknown;
  }>({});
  const formref = useRef<HTMLDivElement>(null);
  const submitLoader = buttons?.find((b) => b.type === "submit")?.loader
    ?.loader;
  const prevLoaderRef = useRef<boolean>(false);

  useEffect(() => {
    // Trigger reset only when loader goes from true → false
    if (prevLoaderRef.current === true && submitLoader === false) {
      setFormData(initialFormData);
      setFormErrors({});
    }
    prevLoaderRef.current = submitLoader ?? false;
  }, [submitLoader, initialFormData]);

  useEffect(() => {
    if (textfield && textfield.length > 0) {
      const initialData: { [key: string]: unknown } = {};
      textfield.forEach((field) => {
        initialData[field.name] = "";
      });
      setInitialFormData(initialData);
      // 👇 Only set formData on first mount, not on every re-render
      setFormData((prev) => {
        const hasData = Object.keys(prev).length > 0;
        return hasData ? prev : initialData;
      });
    }
  }, []); // 👈 empty dependency — run only once on mount

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formref.current && !formref.current.contains(e.target as Node)) {
        formtoogle(false); // Assuming this closes the form
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formtoogle]);

  const handleInputChange = (name: string, value: unknown) => {
    setFormData((prevFormData) => {
      const currentValue = prevFormData[name];

      const newValue =
        typeof value === "function" ? value(currentValue) : value;

      return {
        ...prevFormData,
        [name]: newValue,
      };
    });

    // Clear error for this field when user updates it
    if (formErrors[name]) {
      setFormErrors((prevErrors) => {
        const updated = { ...prevErrors };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmitFn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitButton = buttons?.find((button) => button.type === "submit");
    if (!submitButton) return;

    const errors: { [key: string]: string } = {};

    // 1. Prepare processed data for validation
    const processedData: { [key: string]: unknown } = { ...formData };

    textfield?.forEach((field) => {
      const val = processedData[field.name];

      // Handle number conversion: empty string/null/undefined -> undefined
      if (field.type === "number") {
        if (val === "" || val === null || val === undefined) {
          processedData[field.name] = undefined;
        } else if (typeof val === "string") {
          const num = Number(val);
          processedData[field.name] = isNaN(num) ? val : num;
        }
      }
    });

    // 2. Validate required fields defined in `textfield`
    textfield?.forEach((field) => {
      if (field.required) {
        const val = processedData[field.name];
        const isEmpty =
          val === undefined ||
          val === null ||
          val === "" ||
          (Array.isArray(val) && val.length === 0);

        if (isEmpty) {
          const labelText = field.label || field.name;

          console.log("label text:-", labelText);
          errors[field.name] = `${labelText} is required`;
          console.log(errors);
        }
      }
    });

    // 3. Validate using Zod schema if provided
    if (validationSchema) {
      const validationResult = validationSchema.safeParse(processedData);

      if (!validationResult.success) {
        validationResult.error.errors.forEach((err) => {
          const fieldName = String(err.path[0]);
          if (fieldName) {
            // Do not let generic "Required" from Zod overwrite a custom label required message
            if (err.message === "Required" && errors[fieldName]) {
              return;
            }
            errors[fieldName] = err.message;
          }
        });
      }
    }

    // 4. If any errors exist, block submission and set errors
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // No errors -> submit form
    setFormErrors({});
    submitButton.function?.(formData, e as any);
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-screen bg-gray-50 flex bg-opacity-5 backdrop-blur-[2px] items-center justify-center">
      <div className="absolute top-0 left-0 h-full w-full bg-gray-700 bg-opacity-10 backdrop-blur-sm"></div>
      <div
        ref={formref}
        className={mergeClasses("max-h-[90vh] flex flex-col relative z-10 bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-xl mx-auto border border-gray-200", className)}
      >
        <form onSubmit={handleSubmitFn} noValidate className="flex flex-col h-full min-h-0">
          {/* Header */}
          {formtitle && (
            <div className="flex-shrink-0 mb-4">
              {formtitle.map((data, index) => (
                <div
                  key={index}
                  className={
                    data.className
                      ? data.className.join(" ")
                      : "text-gray-800 text-3xl font-semibold"
                  }
                >
                  {data.title}
                </div>
              ))}
            </div>
          )}

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {textfield &&
              textfield.length > 0 &&
              textfield.map((field, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-start items-start w-full"
                >
                  <Inputtag
                    textfield={field}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    className={field.className}
                    formErrors={formErrors}
                  />
                </div>
              ))}

            {message &&
              message.length > 0 &&
              message.map((data, index) => (
                <dd
                  key={index}
                  className={
                    data.className
                      ? data.className.join(" ")
                      : "text-sm text-gray-600"
                  }
                >
                  {data.message}
                </dd>
              ))}
          </div>

          {/* Fixed Footer Buttons */}
          {buttons && (
            <div className="flex-shrink-0 pt-4 mt-2 border-t border-gray-100 flex justify-end gap-3 bg-white">
              {buttons.map((data, index) => (
                <Buttontag
                  key={index}
                  value={data}
                  setformdata={setFormData}
                  initialFormData={initialFormData}
                  className={data.className}
                  action={data.function}
                  tooltip={data.tooltip}
                  arialabel={data.arialabel}
                  disabled={data.disabled}
                  loader={data.loader}
                />
              ))}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Formbox;
