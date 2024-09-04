import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Formbox from "./Components/formbox/Formbox";

function App() {
  const [count, setCount] = useState(0);
  const [firstform, setfirstform] = useState<boolean>(false);
  const [secondform, setsecondform] = useState<boolean>(false);
  const [productId, setproductId] = useState<string>("")
  // const [secondform, setsecondform] = useState<Boolean>(false);
  const handlesubmit = (data: any, e: React.MouseEvent) => {
    e.preventDefault();
    console.log(data)
  }
  const handleConfirm = (confirm: boolean) => {
    console.log(confirm, productId)
    if (confirm && productId) {
      console.log(" We got both of them. Hurrah! 🏆 ");
    }
    setsecondform(false)
  }
  const Deletefunc = (e: React.MouseEvent, productid: string) => {
    e.preventDefault();
    setsecondform(!secondform)
    setproductId(productid)
  }
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
            formtoogle={setfirstform}
            formtitle={[
              {
                title: "Form-Builder",
                className: ["text-2xl font-bold text-black "]
              }
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
                type: "number"
              },

            ]}
            buttons={[
              {
                name: "Submit",
                type: "submit",
                label: "Submitbutton",
                function: handlesubmit,
              },
              {
                name: "Reset",
                type: "reset",
                label: "Submitbutton",
                function: handlesubmit,
              }
            ]}
          />
        ) : (
          ""
        )}
        <button onClick={(e) => Deletefunc(e, "Pawan_Bisht")}>Create Second form</button>
        {secondform ? (
          <Formbox
            formtoogle={setsecondform}
            formtitle={[{
              title: "Confirmation-Form",
            }]}
            message={[{
              message: "This is very important file Are you sure want to delete this file? Please reconfirm it!",

            }]}
            buttons={[{
              name: "Ok",
              label: "Confirm",
              type: "ok",
              function: () => handleConfirm(true),
              className: ["bg-red-600"]
            }, {
              name: "Cancel",
              label: "Cancel",
              type: "cancel",
              function: () => handleConfirm(false),
              className: ["text-red-600 border-1 border-red-600 bg-gray-100 hover:border-red-600 "]
            }]}
          />
        )
          :
          ("")}
      </div>
    </>
  );
}

export default App;
