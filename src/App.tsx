import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Formbox from "./Components/formbox/Formbox";
import { IoIosCloseCircle } from "react-icons/io";
import { z } from "zod";
function App() {
  const [count, setCount] = useState(0);
  const [firstform, setfirstform] = useState<boolean>(false);
  const [secondform, setsecondform] = useState<boolean>(false);
  const [productId, setproductId] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  // const [secondform, setsecondform] = useState<Boolean>(false);

  // Validation example for form-builder form
  const validationSchema = z.object({
    firstname: z
      .string()
      .min(1, { message: "First name is required" }) // handles empty string
      .min(4, { message: "First name must be at least 4 characters" }),

    age: z.preprocess(
      (val) => {
        if (typeof val === "string") {
          if (val.trim() === "") return undefined;
          const num = Number(val);
          if (isNaN(num)) return val;
          return num;
        }
        return val;
      },
      z
        .number({
          required_error: "Age is required",
          invalid_type_error: "Age must be a number",
        })
        .refine((val) => val >= 18, {
          message: "You must be at least 18 years old",
        }),
    ),
    file: z
      .instanceof(File, { message: "File is required" })
      .or(z.array(z.instanceof(File)).nonempty("At least one file required"))
      .refine((files) => {
        if (Array.isArray(files)) return files.length <= 5;
        return true;
      }, "Maximum 5 files allowed"),
  });
  // handle submit function for the form-builder form to submit the data
  const handlesubmit = (data: any, e: React.MouseEvent) => {
    e.preventDefault();
    console.log(data);
    setLoader(true);
    console.log("this is the data:- ", data);
    setTimeout(() => {
      setLoader(false);
    }, 2000);
  };

  // handle Confirm function for the confirmation box
  const handleConfirm = (confirm: boolean) => {
    console.log(confirm, productId);
    if (confirm && productId) {
      console.log(" We got both of them. Hurrah! 🏆 ");
    }
    setsecondform(false);
  };
  const Deletefunc = (e: React.MouseEvent, productid: string) => {
    e.preventDefault();
    setsecondform(!secondform);
    setproductId(productid);
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
            className={["bg-gray-200"]}
            formtoogle={setfirstform}
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
                required: false,
                // type: "text"
              },
              {
                name: "age",
                placeholder: "Enter your age...",
                label: "Age",
                type: "number",
                required: false,
              },
              {
                name: "file",
                placeholder: "Upload your file",
                label: "Please upload up to 5 files",
                type: "file",
                number: 5,
                preview: "image",
                previewClassName: ["h-32 w-32"],
                required: false,
                arialabel: "FileUpload",
                icon: <IoIosCloseCircle />,
              },
            ]}
            buttons={[
              {
                name: "Reset Button",
                type: "reset",
                label: "Submitbutton",
                arialabel: "reset_button",
                tooltip: "Reset Button",
              },
              {
                name: "Submit",
                type: "submit",
                label: "Submitbutton",
                arialabel: "Submit_button",
                tooltip: "Submit Button",
                loader: {
                  loader: loader,
                  className: ["border-red-500 border-4 border-t-blue-800"],
                },
                function: handlesubmit,
              },
            ]}
            validationSchema={validationSchema}
          />
        ) : (
          ""
        )}
        <button onClick={(e) => Deletefunc(e, "Pawan_Bisht")}>
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
                label: "Cancel",
                type: "cancel",
                function: () => handleConfirm(false),
                className: [
                  "text-red-600 border-1 border-red-600 bg-gray-100 hover:border-red-600 ",
                ],
              },
              {
                name: "Yes",
                label: "Confirm",
                type: "ok",
                function: () => handleConfirm(true),
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
