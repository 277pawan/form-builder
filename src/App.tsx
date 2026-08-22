import { useState } from "react";
import "./App.css";
import Formbox from "./Components/formbox/Formbox";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

const userSchema = z.object({
  firstname: z
    .string()
    .min(1, { message: "First name is required" })
    .min(4, { message: "First name must be at least 4 characters" }),
  age: z
    .number({
      required_error: "Age is required",
      invalid_type_error: "Age must be a number",
    })
    .refine((val) => val >= 18, {
      message: "You must be at least 18 years old",
    }),
  file: z
    .any()
    .optional()
    .refine(
      (file) => {
        // undefined/null/empty-array = no file chosen = valid when not required
        if (file === undefined || file === null) return true;
        if (Array.isArray(file) && file.length === 0) return true;
        if (file instanceof File) return file.size > 0;
        if (Array.isArray(file)) return file.length > 0;
        return true;
      },
      { message: "Invalid file" },
    ),
});

function App() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirm = (confirm: boolean, id?: string) => {
    console.log(id ?? "default_id");
    if (confirm) console.log(" We got both of them. Hurrah! 🏆 ");
    setConfirmOpen(false);
  };

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((c) => c + 1)}>count is {count}</button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>

      <div className="flex flex-wrap gap-2 m-2 justify-center">
        <button type="button" onClick={() => setOpen(true)}>
          Create form
        </button>
        <button type="button" onClick={() => setConfirmOpen(true)}>
          Create Second form
        </button>
      </div>

      {open && (
        <Formbox
          open={open}
          onOpenChange={setOpen}
          className={["border-1 max-w-xl border-gray-100 px-6 py-3 shadow-md"]}
          title={{
            text: "React-Form-Toaster",
            className: ["text-2xl text-center font-bold text-blue-500"],
          }}
          closeFormIcon
          schema={userSchema}
          toast={{
            loading: "Submitting form...",
            success: "Form submitted!",
            error: "Submission failed.",
            position: "top-right",
          }}
          onSubmit={async (data) => {
            await new Promise((r) => setTimeout(r, 1500));
            console.log("Submitted:", data);
          }}
          fields={[
            {
              name: "firstname",
              placeholder: "Enter your Firstname...",
              label: "First Name",
              required: true,
              type: "text",
            },
            {
              name: "password",
              placeholder: "Enter your password...",
              label: "Password",
              type: "password",
              required: true,
              passwordToggle: true,
              icon: { show: Eye, hide: EyeOff },
            },
            {
              name: "age",
              placeholder: "Enter your age...",
              label: "Age",
              type: "number",
              required: true,
            },
            {
              name: "accountType",
              label: "Account Type",
              type: "radio",
              required: true,
              options: [
                { label: "Personal", value: "personal" },
                { label: "Business", value: "business" },
              ],
            },
            {
              name: "companyName",
              label: "Company Name",
              type: "text",
              required: true,
              showWhen: { field: "accountType", equals: "business" },
            },
            {
              name: "role",
              label: "Select your Role",
              type: "select",
              searchable: true,
              maxSelect: 3,
              required: true,
              options: [
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" },
                { label: "Editor", value: "editor" },
              ],
            },
            {
              name: "maritalStatus",
              label: "Marital Status",
              type: "checkbox",
              maxSelections: 1,
              required: true,
              options: [
                { label: "Married", value: "married" },
                { label: "Unmarried", value: "unmarried" },
                { label: "Other", value: "other" },
              ],
            },
            {
              name: "file",
              label: "File",
              type: "file",
              ariaLabel: "File",
              maxFiles: 0,
              selectLabel: "Select File pdf or image",
              accept: ".pdf, image/*",
              className: [
                "border-2 border-dotted border-gray-400 p-2 rounded-lg bg-gray-100",
              ],
            },
            {
              name: "experience",
              label: "Experience",
              addButtonClassName: [
                "text-white hover:text-white-700 font-semibold mt-2",
              ],
              removeButtonClassName: [
                "text-red-600 hover:text-red-700 font-medium mt-1",
              ],
              type: "array",
              fields: [
                { name: "company", label: "Company", type: "text" },
                { name: "position", label: "Position", type: "text" },
                { name: "years", label: "Years", type: "number" },
              ],
            },
          ]}
          buttons={[
            {
              name: "Reset",
              type: "reset",
              ariaLabel: "reset_button",
              tooltip: "Reset form",
            },
            {
              name: "Submit",
              type: "submit",
              ariaLabel: "Submit_button",
              tooltip: "Submit form",
            },
          ]}
        />
      )}

      {confirmOpen && (
        <Formbox
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title={{
            text: "Confirmation Form",
            className: ["text-2xl font-semibold"],
          }}
          toast={{
            loading: "Submitting form...",
            success: "Form submitted!",
            error: "Submission failed.",
            position: "top-right",
          }}
          message={[
            {
              text: "This is a very important file. Are you sure you want to delete it? Please reconfirm.",
            },
          ]}
          buttons={[
            {
              name: "Cancel",
              type: "cancel",
              onClick: () => handleConfirm(false),
              className: [
                "text-red-600 border-1 border-red-600 bg-gray-100 hover:border-red-600",
              ],
            },
            {
              name: "Ok",
              type: "ok",
              onClick: async () => {
                await new Promise((r) => setTimeout(r, 800));
                handleConfirm(true, "file_123");
              },
              toast: {
                loading: "Deleting...",
                success: "File deleted!",
                error: "Failed to delete",
              },
              tooltip: "Confirmation",
              className: ["bg-red-600"],
            },
          ]}
        />
      )}
    </>
  );
}

export default App;
