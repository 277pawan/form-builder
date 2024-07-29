import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Formbox from "./Components/formbox/Formbox";

function App() {
  const [count, setCount] = useState(0);
  const [firstform, setfirstform] = useState<boolean>(false);
  // const [secondform, setsecondform] = useState<Boolean>(false);
  console.log(firstform);
  const handlesubmit = (data: any, e: React.MouseEvent) => {
    e.preventDefault();
    console.log(data)

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

            formtitle={[
              {
                title: "Form-Builder",
                className: ["text-2xl "]
              }
            ]}
            textfield={[
              {
                name: "firstname",
                placeholder: "Enter your Firstname",
                label: "FirstName",
                required: false,
                // type: "string"
              },
              {
                name: "age",
                placeholder: "Enter your age",
                label: "Age",
                type: "number"
              },

            ]}
            buttons={[
              {
                name: "Reset",
                type: "reset",
                label: "Submitbutton",
                function: handlesubmit,
              },
              {
                name: "Submit",
                type: "submit",
                label: "Submitbutton",
                function: handlesubmit,
              }
            ]}
          />
        ) : (
          ""
        )}
        <button>Create Second form</button>
      </div>
    </>
  );
}

export default App;
