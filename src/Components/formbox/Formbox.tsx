import React, { useEffect, useState } from "react";
import Inputtag from "../inputTag/Inputtag";
import Buttontag from "../button/Buttontag";

interface Person {
  name: string;
  placeholder: string;
  label: string;
  type?: string;
  required?: boolean;
}
interface Button {
  name: string;
  type: "submit" | "reset";
  label?: string;
  function: (data: any, e: React.MouseEvent) => void;
}
interface FormTitle {
  title: string
  className?: string[]
}
interface Props {
  textfield: Person[];
  buttons?: Button[] | undefined;
  formtitle?: FormTitle[] | undefined;
}

function Formbox(props: Props) {
  const { textfield, buttons, formtitle } = props;
  const [textfieldCount, settextfieldCount] = useState<number>(0);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [initialFormData, setInitialFormData] = useState<{ [key: string]: any }>({});

  const isEmpty = (obj: object) => {
    return Object.keys(obj).length === 0;
  };

  useEffect(() => {
    if (!isEmpty(textfield)) {
      settextfieldCount(textfield.length);
      const initialData: { [key: string]: any } = {};
      textfield.forEach((field) => {
        initialData[field.name] = "";
      });
      setFormData(initialData);
      setInitialFormData(initialData);
    }
  }, [textfield, buttons]);

  const handleInputChange = (name: string, value: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const handleSubmitFn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submitButton = buttons?.find(button => button.type === "submit");
    if (submitButton) {
      submitButton.function(formData, e as any);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-screen  bg-gray-50 flex bg-opacity-5 backdrop-blur-sm items-center justify-center">
      <div className="absolute top-0 left-0 h-full w-full bg-gray-900 bg-opacity-10 backdrop-blur-sm"></div>
      <div className="relative z-10 bg-white p-6 rounded shadow-lg w-full max-w-lg mx-4">
        <form action="" onSubmit={handleSubmitFn}>
          {formtitle && formtitle.map((data, index) => (
            <div key={index} className={`${data.className !== undefined}? ${data.className} : text-2xl font-bold `} >{data.title}</div>
          ))}
          {textfieldCount > 0 &&
            textfield.map((field, index) => (
              <div key={index} className="mb-2 flex flex-col justify-start items-start">
                <Inputtag
                  textfield={field}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                />
              </div>
            ))}
          {buttons &&
            buttons.map((data, index) => (
              <div key={index} className="mb-2 mx-2 inline-flex justify-end ">
                <Buttontag
                  value={data}
                  setformdata={setFormData}
                  initialFormData={initialFormData}
                />
              </div>
            ))}
        </form>
      </div>
    </div>
  );
}

export default Formbox;
