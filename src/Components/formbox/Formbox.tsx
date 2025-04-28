import React, { SetStateAction, useEffect, useRef, useState } from "react";
import Inputtag from "../inputTag/Inputtag";
import Buttontag from "../button/Buttontag";
import { z } from "zod";

interface inputField<T> {
  name: keyof T;
  placeholder?: string;
  label?: string;
  type?: string;
  required?: boolean;
  className?: string[];
  arialabel?: string;
  number?: number;
  preview?: "name" | "image";
  previewClassName?: string[];
  icon?: React.ReactNode;
}
interface LoaderType {
  loader: boolean;
  className: string[];
}
interface Button {
  name: string;
  type: "submit" | "reset" | "cancel" | "ok";
  label?: string;
  className?: string[];
  function?: (data: any, e: React.MouseEvent) => void;
  arialabel?: string;
  tooltip?: string;
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

interface Props<TFormData> {
  className?: string[];
  textfield?: inputField<TFormData>[]; // Tied to the generic
  buttons?: Button[];
  formtitle?: FormTitle[];
  formtoogle: React.Dispatch<SetStateAction<boolean>>;
  message?: Message[];
  validationSchema?: z.ZodObject<any>;
}

function Formbox<TFormData extends Record<string, any>>(
  props: Props<TFormData>,
) {
  const {
    className,
    formtoogle,
    message,
    textfield,
    buttons,
    formtitle,
    validationSchema,
  } = props;

  const [formData, setFormData] = useState<TFormData>({} as TFormData);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof TFormData, string>>
  >({});
  const [initialFormData, setInitialFormData] = useState<TFormData>(
    {} as TFormData,
  );
  const formref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textfield && textfield.length > 0) {
      const initialData = {} as Partial<TFormData>;
      textfield.forEach((field) => {
        // Initialize file fields as arrays
        initialData[field.name] = (
          field.type === "file" ? [] : ""
        ) as TFormData[typeof field.name];
      });
      setFormData(initialData as TFormData);
      setInitialFormData(initialData as TFormData);
    }
  }, [textfield]);

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

  const handleInputChange = <K extends keyof TFormData>(
    name: K,
    value: TFormData[K],
  ) => {
    setFormData((prevFormData) => {
      // Special handling for file inputs
      if (
        textfield?.find((field) => field.name === name && field.type === "file")
      ) {
        return {
          ...prevFormData,
          [name]: value, // For file inputs, directly use the value which should be an array of Files
        };
      }

      // For all other input types
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  };

  const handleSubmitFn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitButton = buttons?.find((button) => button.type === "submit");
    if (submitButton) {
      if (validationSchema) {
        const validationData = validationSchema.safeParse(formData);
        if (!validationData.success) {
          const errors: Partial<Record<keyof TFormData, string>> = {};
          validationData.error.errors.forEach((err) => {
            errors[err.path[0] as keyof TFormData] = err.message;
          });
          setFormErrors(errors);
          return;
        } else {
          submitButton.function?.(formData, e as any);
          setFormErrors({});
        }
      } else {
        submitButton.function?.(formData, e as any);
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
                  arialabel={field.arialabel}
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
                  action={(formData, e) => {
                    if (data.function) {
                      data.function(formData, e);
                    }
                  }}
                  tooltip={data.tooltip}
                  arialabel={data.arialabel}
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
