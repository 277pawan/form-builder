import React, { SetStateAction, useEffect, useRef, useState } from "react";
import Inputtag from "../inputTag/Inputtag";
import Buttontag from "../button/Buttontag";
import { z } from "zod"
interface Person {
  name: string;
  placeholder?: string;
  label?: string;
  type?: string;
  required?: boolean;
  className?: string[];
}

interface Button {
  name: string;
  type: "submit" | "reset" | "cancel" | "ok";
  label?: string;
  className?: string[];
  function: (data: any, e: React.MouseEvent) => void;
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
  textfield?: Person[];  // Make this prop optional
  buttons?: Button[];
  formtitle?: FormTitle[];
  formtoogle: React.Dispatch<SetStateAction<boolean>>;
  message?: Message[];
  validationSchema?: z.ZodObject<any>;
}

function Formbox(props: Props) {
  const { formtoogle, message, textfield, buttons, formtitle, validationSchema } = props;
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: any }>({})
  const [initialFormData, setInitialFormData] = useState<{ [key: string]: any }>({});
  const formref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textfield && textfield.length > 0) {
      const initialData: { [key: string]: any } = {};
      textfield.forEach((field) => {
        initialData[field.name] = "";
      });
      setFormData(initialData);
      setInitialFormData(initialData);
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

  const handleInputChange = (name: string, value: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmitFn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitButton = buttons?.find((button) => button.type === "submit");
    if (submitButton) {
      if (validationSchema) {
        const validationData = validationSchema.safeParse(formData)
        if (!validationData.success) {
          const errors: any = {};
          validationData.error.errors.forEach((err) => {
            errors[err.path[0]] = err.message;
          });
          setFormErrors(errors);
          return;
        }
        else {
          submitButton.function(formData, e as any);
          setFormErrors({});
        }
      }
      else {
        submitButton.function(formData, e as any);
        setFormErrors({});
      }
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-screen bg-gray-50 flex bg-opacity-5 backdrop-blur-[2px] items-center justify-center">
      <div className="absolute top-0 left-0 h-full w-full bg-gray-700 bg-opacity-10 backdrop-blur-sm"></div>
      <div ref={formref} className="relative z-10 bg-white p-6 rounded shadow-lg w-full max-w-lg mx-4">
        <form onSubmit={handleSubmitFn}>
          {formtitle && formtitle.map((data, index) => (
            <div key={index} className={data.className ? data.className.join(' ') : "text-black text-2xl font-bold"}>
              {data.title}
            </div>
          ))}
          {textfield && textfield.length > 0 &&
            textfield.map((field, index) => (
              <div key={index} className="mb-2 flex flex-col justify-start items-start">
                <Inputtag
                  textfield={field}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  className={field.className}
                  formErrors={formErrors}
                />
              </div>
            ))}
          {message && message.length > 0 && message.map((data, index) => (
            <dd key={index} className={data.className ? data.className.join('') : "mt-2 text-black font-normal"}>{data.message}</dd>
          ))
          }
          {buttons &&
            buttons.map((data, index) => (
              <div key={index} className="mx-2 mt-2 float-right ">
                <div className="inline-block">
                  <Buttontag
                    value={data}
                    setformdata={setFormData}
                    initialFormData={initialFormData}
                    className={data.className}
                    action={data.function}
                  />
                </div>
              </div>
            ))}
        </form>
      </div>
    </div>
  );
}

export default Formbox;
