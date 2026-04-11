import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Formbox from "./Components/formbox/Formbox";
import { z } from "zod";
function App() {
  const [count, setCount] = useState(0);
  const [firstform, setfirstform] = useState<boolean>(false);
  const [secondform, setsecondform] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);

  const validationSchema = z.object({
    firstname: z
      .string()
      .min(1, { message: "First name is required" }) // handles empty string
      .min(4, { message: "First name must be at least 4 characters" }),

    age: z
      .number()
      .min(1, { message: "Age is required" }) // handles empty string
      .refine((val) => !isNaN(Number(val)), {
        message: "Age must be a number",
      })
      .refine((val) => val >= 18, {
        message: "You must be at least 18 years old",
      }),

    file: z.any().refine(
      (file) => {
        if (file instanceof File) return file.size > 0;
        if (Array.isArray(file)) return file.length > 0;
        return false;
      },
      {
        message: "File is required",
      },
    ),
  });

  const handlesubmit = (data: unknown, e: React.MouseEvent) => {
    e.preventDefault();
    setLoader(true);
    setTimeout(() => {
      setLoader(false);
      console.log("Final after loader data:-", data);
    }, 2000);
  };
  const handleConfirm = (confirm: boolean, id?: string) => {
    const finalId = id ?? "default_id";
    console.log(finalId);
    if (confirm) {
      console.log(" We got both of them. Hurrah! 🏆 ");
    }
    setsecondform(false);
  };
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div className=" flex gap-2 m-2">
        <button onClick={() => setfirstform(!firstform)}>Create form</button>

        {firstform ? (
          <Formbox
            className={[
              "bg-gray-200 border-1 border-gray-100 rounded-lg shadow-md",
            ]}
            formtoogle={setfirstform}
            validationSchema={validationSchema}
            formtitle={[
              {
                title: "Form-Builder",
                className: ["text-2xl font-bold text-black "],
              },
            ]}
            textfield={[
              {
                name: "firstname",
                placeholder: "Enter your Firstname...",
                label: "FirstName",
                required: true,
                type: "text",
              },
              {
                name: "age",
                placeholder: "Enter your age...",
                label: "Age",
                type: "number",
                required: true,
              },
              {
                name: "marritalStatus?",
                label: "Marital Status",
                type: "checkbox",
                checklimit: 1,
                required: true,
                options: [
                  { label: "Married", value: "married" },
                  { label: "Unmarried", value: "unmarried" },
                  { label: "other", value: "other" },
                ],
              },
              {
                name: "file",
                placeholder: "Upload your Image",
                label: "File",
                type: "file",
                arialabel: "File",
                maxFiles: 2,
                selectlabel: "Select File pdf or image",
                accept: ".pdf, image/*",
                className: [
                  "border-2 border-dotted border-gray-400 p-2 rounded-lg bg-gray-100",
                ],
              },
            ]}
            buttons={[
              {
                name: "Reset Button",
                type: "reset",
                arialabel: "reset_button",
                tooltip: "Reset Button",
              },
              {
                name: "Submit",
                type: "submit",
                arialabel: "Submit_button",
                tooltip: "Submit Button",
                function: handlesubmit,
                loader: {
                  loader: loader,
                },
              },
            ]}
            //            validationSchema={validationSchema}
          />
        ) : (
          ""
        )}
        <button onClick={() => setsecondform(!secondform)}>
          Create Second form
        </button>
        {secondform ? (
          <Formbox
            formtoogle={setsecondform}
            formtitle={[
              {
                title: "Confirmation-Form",
                className: ["text-2xl font-semibold"],
              },
            ]}
            message={[
              {
                message:
                  "This is very important file. Are you sure want to delete this file? Please provide your reconfirmation!",
              },
            ]}
            buttons={[
              {
                name: "Cancel",
                type: "cancel",
                function: () => handleConfirm(false),
                className: [
                  "text-red-600 border-1 border-red-600 bg-gray-100 hover:border-red-600 ",
                ],
              },
              {
                name: "Ok",
                type: "ok",
                function: () => handleConfirm(true, "secret_id"),
                tooltip: "Confirmation",
                className: ["bg-red-600"],
              },
            ]}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default App;
