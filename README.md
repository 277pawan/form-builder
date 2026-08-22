# React-Form-Toaster 2.0.0

[![GitHub Repo](https://github.githubassets.com/favicons/favicon.png) **React-form-toaster**](https://github.com/277pawan/form-builder)

[![User Form Demo](https://res.cloudinary.com/dc30b7tnj/video/upload/so_0/form-builder_tibv9z.jpg)](https://res.cloudinary.com/dc30b7tnj/video/upload/v1787248451/form-builder_tibv9z.mp4)

![Confirmation-form](https://cure-ten.vercel.app/static/media/confirm.4b962f1dee5f2bc649cd.png)

🎊 React-Form-Toaster is a powerful and flexible library designed for creating dynamic forms in React with ease. Users can quickly generate complex forms by simply defining input types, buttons, and other elements, without needing to create each element separately.

```sh
npm install react-form-toaster
# or
yarn add react-form-toaster
```

## Features

- ⚡ **Easy Setup** — Get started in less than 10 seconds. No extra config needed.
- 🧩 **Dynamic Form Creation** — Define field types, labels, and validation and the library handles the rest.
- 🎨 **Highly Customizable** — Override every class, label, and message with your own Tailwind utilities.
- 🔷 **TypeScript Support** — Fully typed props and Zod-inferred submit data.
- 💅 **Tailwind CSS Integration** — Uses Tailwind under the hood. No extra setup required.
- 🖼️ **Beautiful Default UI** — Ships with a polished modal form UI out of the box.
- ✅ **Zod Validation** — Inline field errors powered by your Zod schema.
- 📱 **Responsive** — Works great on all screen sizes.
- 🔁 **Array Fields** — Repeatable nested field groups with fully customizable add/remove buttons.
- 👁️ **Conditional Fields** — Show or hide fields based on other field values using `showWhen`.
- 🍞 **Toast Notifications** — Built-in loading/success/error toasts for async submit handlers and individual buttons.
- 🎨 **Toast CSS Overrides** — Fully customize toast appearance per state (loading, success, error) with your own classes.

---

## Quick Setup

Import **once** in your app entry file:

```tsx
import Formbox from "react-form-toaster";
import "react-form-toaster/dist/index.css";
```

No extra Tailwind configuration is required.

---

## v2 API (Recommended)

```tsx
import Formbox from "react-form-toaster";
import "react-form-toaster/dist/index.css";
import { z } from "zod";
import { useState } from "react";

const schema = z.object({
  firstname: z.string().min(4, "First name must be at least 4 characters"),
  age: z.number().min(18, "You must be at least 18 years old"),
});

function App() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Form</button>

      <Formbox
        open={open}
        onOpenChange={setOpen}
        title={{ text: "Create Account", className: "text-2xl font-bold text-center" }}
        closeFormIcon={true}
        schema={schema}
        onSubmit={async (data) => {
          await api.createUser(data); // data is typed from your Zod schema
        }}
        toast={{
          loading: "Creating account...",
          success: "Account created!",
          error: "Something went wrong",
        }}
        fields={[
          { name: "firstname", type: "text", label: "First Name", required: true },
          { name: "age", type: "number", label: "Age", required: true },
          {
            name: "accountType",
            type: "radio",
            label: "Account Type",
            options: [
              { label: "Personal", value: "personal" },
              { label: "Business", value: "business" },
            ],
          },
          {
            name: "companyName",
            type: "text",
            label: "Company",
            showWhen: { field: "accountType", equals: "business" },
          },
          {
            name: "role",
            type: "select",
            label: "Role",
            maxSelect: 3,
            searchable: true,
            options: [
              { label: "Admin", value: "admin" },
              { label: "User", value: "user" },
              { label: "Editor", value: "editor" },
            ],
          },
          {
            name: "tags",
            type: "checkbox",
            label: "Tags",
            maxSelections: 2,
            options: [
              { label: "React", value: "react" },
              { label: "TypeScript", value: "typescript" },
            ],
          },
          {
            name: "resume",
            type: "file",
            label: "Resume",
            maxFiles: 2,
            accept: ".pdf",
            selectLabel: "Choose PDF",
          },
          {
            name: "experience",
            type: "array",
            label: "Work Experience",
            className: ["border-2 border-dotted border-gray-300 p-3 rounded-lg bg-gray-50"],
            addButtonText: "+ Add Experience",
            addButtonClassName: ["text-blue-600 hover:text-blue-700 font-semibold mt-2"],
            removeButtonText: "✕ Remove",
            removeButtonClassName: ["text-red-500 hover:text-red-600 text-xs"],
            fields: [
              { name: "company", type: "text", label: "Company" },
              { name: "position", type: "text", label: "Position" },
              { name: "years", type: "number", label: "Years" },
            ],
          },
        ]}
        buttons={[
          { name: "Reset", type: "reset" },
          { name: "Submit", type: "submit" },
        ]}
      />
    </>
  );
}
```

---

## Legacy API (Still Supported)

`formtoogle`, `textfield`, `formtitle`, `validationSchema`, `checklimit`, and `arialabel` still work — they are mapped internally to the v2 API.

```tsx
import Formbox from "react-form-toaster";
import "react-form-toaster/dist/index.css";

<Formbox
  formtoogle={setOpen}
  validationSchema={validationSchema}
  formtitle={[{ title: "Form-Builder", className: ["text-2xl font-bold text-black"] }]}
  closeFormIcon={true}
  textfield={[
    {
      name: "firstname",
      placeholder: "Enter your Firstname...",
      label: "FirstName",
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
      name: "file",
      label: "File",
      type: "file",
      arialabel: "File",
      maxFiles: 2,
      selectlabel: "Select File pdf or image",
      accept: ".pdf, image/*",
      className: ["border-2 border-dotted border-gray-400 p-2 rounded-lg bg-gray-100"],
    },
  ]}
  buttons={[
    { name: "Reset Button", type: "reset", arialabel: "reset_button", tooltip: "Reset Button" },
    {
      name: "Submit",
      type: "submit",
      arialabel: "Submit_button",
      tooltip: "Submit Button",
      function: handlesubmit,
      loader: { loader: loader },
    },
  ]}
/>
```

---

## Confirmation Forms

Use `type: "ok"` or `type: "cancel"` for confirmation dialogs. Add a `toast` prop directly on any button to show built-in toast feedback when it is clicked:

```tsx
<Formbox
  open={open}
  onOpenChange={setOpen}
  title={{ text: "Confirm Deletion" }}
  message={[{
    text: "This action is permanent. Are you sure you want to delete this file?",
  }]}
  buttons={[
    {
      name: "Cancel",
      type: "cancel",
      className: ["text-gray-600 border border-gray-300 bg-gray-50 hover:bg-gray-100"],
    },
    {
      name: "Delete",
      type: "ok",
      className: ["bg-red-600 text-white hover:bg-red-700"],
      onClick: async () => {
        await deleteFile();      // can be sync or async
      },
      // ✅ Built-in toast on button click — no onSubmit needed
      toast: {
        loading: "Deleting...",
        success: "File deleted!",
        error: "Failed to delete",
      },
    },
  ]}
/>
```

Works on **all** button types: `ok`, `cancel`, `button`.

---

## Component Attributes

For the complete configuration reference with all props, operators, and examples, see **[CONFIGURATION.md](./CONFIGURATION.md)**.

### Formbox Props

| Prop            | Type                                       | Default | Required | Description                                                          |
| --------------- | ------------------------------------------ | ------- | -------- | -------------------------------------------------------------------- |
| `open`          | `boolean`                                  | `false` | ✅        | Controls modal visibility.                                           |
| `onOpenChange`  | `(open: boolean) => void`                  | —       | ✅        | Callback when the modal requests to open or close.                   |
| `fields`        | `FormField[]`                              | `[]`    | ❌        | Array of field definitions rendered inside the form.                 |
| `buttons`       | `FormButton[]`                             | `[]`    | ❌        | Array of button definitions.                                         |
| `title`         | `string \| { text: string; className? }`  | —       | ❌        | Form heading. Accepts a string or config object.                     |
| `schema`        | `z.ZodTypeAny`                             | —       | ❌        | Zod schema for automatic field validation on submit.                 |
| `onSubmit`      | `(data: z.infer<Schema>) => void/Promise`  | —       | ❌        | Called after successful validation. Receives typed form data.        |
| `toast`         | `{ loading?, success?, error? }`           | —       | ❌        | Toast messages shown during async `onSubmit`.                        |
| `message`       | `{ text: string; className? }[]`           | —       | ❌        | Info/confirmation text rendered inside the form body.                |
| `className`     | `string \| string[]`                       | —       | ❌        | Custom Tailwind classes for the modal card container.                |
| `closeFormIcon` | `boolean`                                  | `false` | ❌        | Shows a ✕ icon in the top-right corner to close the modal.          |

### Supported Field Types

| `type`        | Description                      | Key Props                                                                                                    |
| ------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `text`        | Single-line text                 | `placeholder`, `className`                                                                                   |
| `email`       | Email input                      | `placeholder`, `className`                                                                                   |
| `number`      | Numeric input                    | `placeholder`, `className`                                                                                   |
| `password`    | Password with optional toggle    | `passwordToggle`, `icon`                                                                                     |
| `search`      | Search input                     | `placeholder`, `className`                                                                                   |
| `checkbox`    | Multi-option checkbox group      | `options`, `maxSelections`                                                                                   |
| `radio`       | Single-choice radio group        | `options`                                                                                                    |
| `select`      | Searchable multi-select dropdown | `options`, `maxSelect`, `searchable`, `placeholder`                                                          |
| `multiselect` | Alias for `select`               | Same as `select`                                                                                             |
| `file`        | File upload                      | `maxFiles`, `accept`, `selectLabel`, `ariaLabel`                                                             |
| `array`       | Repeatable nested field group    | `fields`, `addButtonText`, `removeButtonText`, `addButtonClassName`, `removeButtonClassName`, `itemClassName` |

### FormField Attributes

| Attribute               | Type                  | Description                                                                 |
| ----------------------- | --------------------- | --------------------------------------------------------------------------- |
| `name`                  | `string`              | **Required.** Unique field key — must match your Zod schema key.            |
| `type`                  | `string`              | Field type (see table above). Defaults to `"text"`.                         |
| `label`                 | `string`              | Label rendered above the input.                                             |
| `placeholder`           | `string`              | Placeholder text inside the input.                                          |
| `required`              | `boolean`             | Marks the field as required.                                                |
| `className`             | `string[]`            | Custom Tailwind classes merged onto the input element.                      |
| `ariaLabel`             | `string`              | `aria-label` for accessibility.                                             |
| `options`               | `{ label, value }[]`  | Options list for `checkbox`, `radio`, `select`, `multiselect`.              |
| `maxSelections`         | `number`              | Max selectable options for `checkbox` groups. Default: `1`.                 |
| `maxSelect`             | `number`              | Max selectable options for `select` / `multiselect`. Default: `2`.          |
| `searchable`            | `boolean`             | Enables search filter inside `select` dropdown.                             |
| `passwordToggle`        | `boolean`             | Enables show/hide toggle inside `password` fields.                          |
| `icon`                  | `{ show, hide }`      | Custom React components for the password toggle icons.                      |
| `accept`                | `string`              | Accepted file types for `file` fields. E.g. `".pdf,image/*"`.               |
| `maxFiles`              | `number`              | Maximum number of files for `file` fields. Default: `1`. Set to `0` for unlimited. |
| `selectLabel`           | `string`              | Label text shown on the file picker button.                                 |
| `showWhen`              | `ShowWhen`            | Conditionally renders this field based on another field's value.            |
| `fields`                | `FormField[]`         | Nested field definitions for `array` type.                                  |
| `addButtonText`         | `string`              | Custom text for the add-row button (**array** only).                        |
| `removeButtonText`      | `string`              | Custom text for the remove-row button (**array** only).                     |
| `addButtonClassName`    | `string[]`            | Custom Tailwind classes for the add-row button (**array** only).            |
| `removeButtonClassName` | `string[]`            | Custom Tailwind classes for the remove-row button (**array** only).         |
| `itemClassName`         | `string[]`            | Custom Tailwind classes for each row container (**array** only).            |

### FormButton Attributes

| Attribute   | Type                                                            | Description                                                                          |
| ----------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `name`      | `string`                                                        | Button label text.                                                                   |
| `type`      | `"submit" \| "reset" \| "cancel" \| "ok" \| "button"`          | Controls button behavior.                                                            |
| `className` | `string[]`                                                      | Custom Tailwind classes.                                                             |
| `ariaLabel` | `string`                                                        | `aria-label` for accessibility.                                                      |
| `tooltip`   | `string`                                                        | Tooltip shown on hover.                                                              |
| `disabled`  | `boolean`                                                       | Disables the button.                                                                 |
| `onClick`   | `(data: unknown, e: MouseEvent) => void \| Promise<void>`       | Click handler — receives current form data. Supports async.                          |
| `loader`    | `{ loading?: boolean; className?: string[] }`                   | Spinner config. `className` customizes the spinner border color.                     |
| `toast`     | `ToastMessages`                                                 | Shows built-in toast when this button is clicked. Works with async `onClick`.        |

---

## Toast Customization

The `toast` prop is available on both the **form level** (for `onSubmit`) and on **individual buttons** (for `onClick`). Both support per-state CSS class overrides.

### Toast on Form Submit

```tsx
<Formbox
  onSubmit={async (data) => await api.save(data)}
  toast={{
    loading: "Saving...",
    success: "Saved!",
    error: "Save failed",
    position: "top-right",   // "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"
    duration: 4000,          // Auto-dismiss after 4000ms (default: 3500ms)
    dismissible: true,       // Shows close (X) button (default: true)
    // 🎨 Custom classes per state (merged on top of defaults)
    loadingClassName: ["bg-blue-700 text-white"],
    successClassName: ["bg-emerald-500 text-white font-bold"],
    errorClassName:   ["bg-rose-600 text-white"],
  }}
  ...
/>
```

### Toast on Button Click

```tsx
buttons={[
  {
    name: "Confirm",
    type: "ok",
    onClick: async () => await doSomething(),
    toast: {
      loading: "Processing...",
      success: "Done!",
      error: "Failed",
      position: "top-right",
      duration: 3000,
      // 🎨 Custom classes per state
      successClassName: ["bg-green-500 rounded-full px-6"],
      errorClassName:   ["bg-red-700 text-lg"],
    },
  },
]}
```

### `ToastMessages` Reference

| Key                  | Type            | Default          | Description                                                                              |
| -------------------- | --------------- | ---------------- | ---------------------------------------------------------------------------------------- |
| `loading`            | `string`        | `undefined`      | Message shown while the async action is in progress.                                     |
| `success`            | `string`        | `undefined`      | Message shown after the action succeeds.                                                 |
| `error`              | `string`        | `undefined`      | Message shown if the action throws.                                                      |
| `position`           | `ToastPosition` | `"bottom-right"` | Position on screen: `"top-left" \| "top-center" \| "top-right" \| "bottom-left" \| "bottom-center" \| "bottom-right"`. |
| `duration`           | `number`        | `3500`           | Auto-dismiss timer in milliseconds.                                                      |
| `dismissible`        | `boolean`       | `true`           | Shows a close (X) icon button on the toast for manual dismissal.                         |
| `loadingClassName`   | `string[]`      | `undefined`      | Extra classes applied to the toast in **loading** state.                                 |
| `successClassName`   | `string[]`      | `undefined`      | Extra classes applied to the toast in **success** state.                                 |
| `errorClassName`     | `string[]`      | `undefined`      | Extra classes applied to the toast in **error** state.                                   |

> **Tip:** Multiple toasts automatically **stack vertically** with entrance animations (slide + fade + scale) and can be dismissed individually using the **(X)** icon button.

---

## Zod Validation

```tsx
import { z } from "zod";

const schema = z.object({
  firstname: z.string().min(4, { message: "First name must be at least 4 characters" }),
  age: z.number().min(18, { message: "You must be at least 18 years old" }),
  role: z.array(z.string()).min(1, "Select at least one role"),
});
```

---

## Conditional Fields

Use `showWhen` to show a field only when another field has a specific value:

```tsx
// Show "companyName" only when "accountType" equals "business"
{ name: "companyName", type: "text", label: "Company Name",
  showWhen: { field: "accountType", equals: "business" } }

// Show when value is NOT "none"
{ showWhen: { field: "type", notEquals: "none" } }

// Show when role is admin or owner
{ showWhen: { field: "role", in: ["admin", "owner"] } }
```

---

## Contribute

### ❤️ Like This Project?

If this project helped you save time, understand something new, or simply made your life a little easier, consider showing your support by giving it a ⭐ **Star**.

Found something that could be better? **I'd genuinely love to hear from you!** Feel free to open an issue, suggest an improvement, or contribute.

📖 Take a look at the [**Contributing Guide**](CONTRIBUTING.md) to get started.

You can also find me on GitHub: [**277pawan**](https://github.com/277pawan).

> ⭐ **If this repository saved you even a little time, give it a Star — it means a lot! ❤️**
