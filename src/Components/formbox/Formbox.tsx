import React, { SetStateAction, useEffect, useRef, useState } from "react";
import Inputtag from "../inputTag/Inputtag";
import Buttontag from "../button/Buttontag";
import { z } from "zod";
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
}

interface LoaderType {
  loader: boolean;
  className?: string[];
}
interface Button {
  name: string;
  type: "submit" | "reset" | "cancel" | "ok";
  className?: string[];
  function?: (data: any, e: React.MouseEvent) => void;
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
    [key: string]: any;
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
      const initialData: { [key: string]: any } = {};
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

  const handleInputChange = (name: string, value: any) => {
    setFormData((prevFormData) => {
      const currentValue = prevFormData[name];

      const newValue =
        typeof value === "function" ? value(currentValue) : value;

      return {
        ...prevFormData,
        [name]: newValue,
      };
    });
  };

  const handleSubmitFn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitButton = buttons?.find((button) => button.type === "submit");
    if (submitButton) {
      if (validationSchema) {
        const processedData: { [key: string]: any } = { ...formData };

        // Collect non-required field names
        const nonRequiredFields: string[] = [];

        textfield?.forEach((field) => {
          if (field.required === false || field.required === undefined) {
            nonRequiredFields.push(field.name);
            processedData[field.name] = undefined; // 👈 this is the key fix
          }
          // Coerce number fields
          if (field.type === "number" && processedData[field.name] !== "") {
            processedData[field.name] = Number(processedData[field.name]);
          }
        });

        // Dynamically make non-required fields optional in the schema
        const schemaShape = validationSchema.shape;
        const updatedShape: { [key: string]: z.ZodTypeAny } = {};

        Object.keys(schemaShape).forEach((key) => {
          if (nonRequiredFields.includes(key)) {
            updatedShape[key] = schemaShape[key].optional(); // 👈 make it optional
          } else {
            updatedShape[key] = schemaShape[key];
          }
        });

        const adjustedSchema = z.object(updatedShape);
        const validationData = adjustedSchema.safeParse(processedData);

        if (!validationData.success) {
          const errors: any = {};
          validationData.error.errors.forEach((err) => {
            errors[err.path[0]] = err.message;
          });
          setFormErrors(errors);
          return;
        } else {
          submitButton.function(formData, e as any);
          setFormErrors({});
        }
      } else {
        submitButton.function(formData, e as any);
        setFormErrors({});
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-screen bg-gray-50 flex bg-opacity-5 backdrop-blur-[2px] items-center justify-center">
      <div className="absolute top-0 left-0 h-full w-full bg-gray-700 bg-opacity-10 backdrop-blur-sm"></div>
      <div
        ref={formref}
        className={`relative z-10 bg-white p-8 md:p-8 rounded-2xl shadow-xl w-full max-w-xl mx-auto border border-gray-200 ${className ? className.join("") : ""}`}
      >
        <form onSubmit={handleSubmitFn} className="space-y-4">
          {formtitle &&
            formtitle.map((data, index) => (
              <div
                key={index}
                className={
                  data.className
                    ? data.className.join(" ")
                    : "text-gray-800 text-3xl font-semibold mb-4"
                }
              >
                {data.title}
              </div>
            ))}

          {textfield &&
            textfield.length > 0 &&
            textfield.map((field, index) => (
              <div
                key={index}
                className="flex flex-col justify-start items-start"
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

          {buttons && (
            <div className="pt-4 flex justify-end gap-3">
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
