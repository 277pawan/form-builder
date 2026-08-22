# React-Form-Toaster — Configuration Guide

A complete reference for every prop, field type, and option available in `react-form-toaster`.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Formbox Props (v2 API)](#formbox-props-v2-api)
3. [Field Types](#field-types)
4. [FormField Reference](#formfield-reference)
5. [Array Fields](#array-fields)
6. [Buttons Reference](#buttons-reference)
7. [Toast Messages](#toast-messages)
8. [Zod Validation](#zod-validation)
9. [Conditional Fields (showWhen)](#conditional-fields-showwhen)
10. [Legacy API Mapping](#legacy-api-mapping)

---

## Quick Start

```bash
npm install react-form-toaster
# or
yarn add react-form-toaster
```

```tsx
import Formbox from "react-form-toaster";
import "react-form-toaster/dist/index.css";
```

---

## Formbox Props (v2 API)

| Prop              | Type                                      | Default     | Required | Description                                                        |
| ----------------- | ----------------------------------------- | ----------- | -------- | ------------------------------------------------------------------ |
| `open`            | `boolean`                                 | `false`     | ✅        | Controls modal visibility.                                         |
| `onOpenChange`    | `(open: boolean) => void`                 | —           | ✅        | Called when the modal requests to open/close (backdrop click, ✕). |
| `fields`          | `FormField[]`                             | `[]`        | ❌        | Array of field definitions to render inside the form.              |
| `buttons`         | `FormButton[]`                            | `[]`        | ❌        | Array of button definitions (submit, reset, cancel, ok).           |
| `title`           | `string \| { text: string; className? }` | —           | ❌        | Form heading. Accepts a plain string or object with classNames.    |
| `schema`          | `z.ZodTypeAny`                            | —           | ❌        | Zod schema for validation on submit.                               |
| `onSubmit`        | `(data: z.infer<TSchema>) => void/Promise`| —           | ❌        | Called on successful validation. Data is typed from your schema.   |
| `toast`           | `ToastMessages`                           | —           | ❌        | Loading/success/error toast strings shown during submit.           |
| `message`         | `{ text: string; className? }[]`          | —           | ❌        | Confirmation/info text rendered inside the form (no fields).       |
| `className`       | `string \| string[]`                      | —           | ❌        | Custom Tailwind classes for the modal card container.              |
| `closeFormIcon`   | `boolean`                                 | `false`     | ❌        | Shows an ✕ icon button in the top-right corner to close the modal. |

### Minimal example

```tsx
const [open, setOpen] = useState(false);

<Formbox
  open={open}
  onOpenChange={setOpen}
  title="Create Account"
  fields={[
    { name: "name", type: "text", label: "Full Name", required: true },
    { name: "email", type: "email", label: "Email", required: true },
  ]}
  buttons={[
    { name: "Cancel", type: "cancel" },
    { name: "Submit", type: "submit" },
  ]}
  onSubmit={(data) => console.log(data)}
/>
```

---

## Field Types

| `type`        | Description                      | Specific Props                                                                                               |
| ------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `text`        | Single-line text input           | `placeholder`, `className`                                                                                   |
| `email`       | Email input with format hint     | `placeholder`, `className`                                                                                   |
| `number`      | Numeric input                    | `placeholder`, `className`                                                                                   |
| `password`    | Password with optional toggle    | `passwordToggle`, `icon`                                                                                     |
| `search`      | Search input                     | `placeholder`, `className`                                                                                   |
| `checkbox`    | Multi-option checkbox group      | `options`, `maxSelections`                                                                                   |
| `radio`       | Single-choice radio group        | `options`                                                                                                    |
| `select`      | Searchable multi-select dropdown | `options`, `maxSelect`, `searchable`, `placeholder`                                                          |
| `multiselect` | Alias for `select`               | Same as `select`                                                                                             |
| `file`        | File upload with preview         | `maxFiles`, `accept`, `selectLabel`, `ariaLabel`                                                             |
| `array`       | Repeatable group of nested fields| `fields`, `addButtonText`, `removeButtonText`, `addButtonClassName`, `removeButtonClassName`, `itemClassName` |

---

## FormField Reference

Every item in the `fields` array accepts these properties:

| Property                | Type                   | Description                                                                 |
| ----------------------- | ---------------------- | --------------------------------------------------------------------------- |
| `name`                  | `string`               | **Required.** Unique key used in form data and validation schema.           |
| `type`                  | `FieldType \| string`  | Field type — see Field Types table above. Defaults to `"text"`.             |
| `label`                 | `string`               | Visible label rendered above the input.                                     |
| `placeholder`           | `string`               | Placeholder text inside the input.                                          |
| `required`              | `boolean`              | Marks field as required (adds basic non-empty validation).                  |
| `className`             | `string \| string[]`   | Custom Tailwind classes merged onto the input element.                      |
| `ariaLabel`             | `string`               | Accessibility label (`aria-label`).                                         |
| `options`               | `{ label, value }[]`   | Options for `checkbox`, `radio`, `select`, `multiselect`.                   |
| `maxSelections`         | `number`               | Max options selectable for `checkbox` groups (default: `1`).                |
| `maxSelect`             | `number`               | Max options selectable for `select` / `multiselect` (default: `2`).        |
| `searchable`            | `boolean`              | Enables search filtering inside `select` dropdown.                          |
| `passwordToggle`        | `boolean`              | Shows show/hide toggle inside `password` fields.                            |
| `icon`                  | `{ show, hide }`       | Custom React components for password show/hide icons.                       |
| `accept`                | `string`               | Accepted MIME types / extensions for `file` fields. E.g. `".pdf,image/*"`. |
| `maxFiles`              | `number`               | Max number of files for `file` fields (default: `1`).                       |
| `selectLabel`           | `string`               | Label text shown on the file picker button.                                 |
| `showWhen`              | `ShowWhen`             | Conditionally renders the field based on another field's value.             |
| `fields`                | `FormField[]`          | Nested field definitions for `array` type.                                  |
| `addButtonText`         | `string`               | Custom text for the add-row button in `array` fields.                       |
| `removeButtonText`      | `string`               | Custom text for the remove-row button in `array` fields.                    |
| `addButtonClassName`    | `string \| string[]`   | Custom Tailwind classes for the add-row button in `array` fields.           |
| `removeButtonClassName` | `string \| string[]`   | Custom Tailwind classes for the remove-row button in `array` fields.        |
| `itemClassName`         | `string \| string[]`   | Custom Tailwind classes for each row card container in `array` fields.      |

---

## Array Fields

Array fields let users add and remove repeating groups of inputs — perfect for experience entries, line items, addresses, etc.

```tsx
{
  name: "experience",
  label: "Work Experience",
  type: "array",
  // Wrapper container styling
  className: ["border-2 border-dotted border-gray-300 p-3 rounded-lg bg-gray-50"],
  // Each repeating row styling
  itemClassName: ["border border-gray-200 p-3 rounded-lg bg-white mt-2"],
  // Add button customization
  addButtonText: "+ Add Experience",
  addButtonClassName: ["text-blue-600 hover:text-blue-700 font-semibold mt-2"],
  // Remove button customization
  removeButtonText: "✕ Remove",
  removeButtonClassName: ["text-red-500 hover:text-red-600 text-xs mt-1"],
  // Nested fields per row
  fields: [
    { name: "company", label: "Company", type: "text" },
    { name: "position", label: "Position", type: "text" },
    { name: "years", label: "Years", type: "number" },
  ],
}
```

> If `addButtonText` / `removeButtonText` are not provided, the defaults are:
> - Add: `+ Add {label || name}`
> - Remove: `Remove`

---

## Buttons Reference

| Property    | Type                                        | Description                                                           |
| ----------- | ------------------------------------------- | --------------------------------------------------------------------- |
| `name`      | `string`                                    | Button label text.                                                    |
| `type`      | `"submit" \| "reset" \| "cancel" \| "ok" \| "button"` | Controls button behavior. `submit` triggers validation + onSubmit. |
| `className` | `string \| string[]`                        | Custom Tailwind classes for the button.                               |
| `ariaLabel` | `string`                                    | Accessibility `aria-label`.                                           |
| `tooltip`   | `string`                                    | Tooltip text shown on hover.                                          |
| `disabled`  | `boolean`                                   | Disables the button.                                                  |
| `onClick`   | `(data, e) => void`                         | Custom click handler. Receives form data and mouse event.             |
| `loader`    | `{ loading?: boolean; className?: string[] }` | Shows a spinner; `className` customizes the spinner border color.   |

### Button type behaviors

| Type       | Behavior                                                                 |
| ---------- | ------------------------------------------------------------------------ |
| `submit`   | Validates form via Zod schema then calls `onSubmit`. Shows loader.       |
| `reset`    | Clears all form values back to their initial state.                      |
| `cancel`   | Closes the modal (calls `onOpenChange(false)`).                          |
| `ok`       | Calls `onClick` handler if provided. Used in confirmation dialogs.       |
| `button`   | Plain button — only calls `onClick`. No built-in behavior.               |

```tsx
buttons={[
  { name: "Reset", type: "reset" },
  {
    name: "Submit",
    type: "submit",
    className: ["bg-blue-600 text-white hover:bg-blue-700"],
    loader: { className: ["border-white"] },
    tooltip: "Save changes",
  },
]}
```

---

## Toast Messages

When `onSubmit` is async and `toast` is provided, a toast notification appears automatically:

```tsx
toast={{
  loading: "Saving your data...",
  success: "Saved successfully! 🎉",
  error: "Something went wrong. Please try again.",
}}
```

| Key       | Type     | Default                    | Description                            |
| --------- | -------- | -------------------------- | -------------------------------------- |
| `loading` | `string` | `"Loading..."`             | Shown while the async `onSubmit` runs. |
| `success` | `string` | `"Success!"`               | Shown when `onSubmit` resolves.        |
| `error`   | `string` | `"An error occurred."`     | Shown when `onSubmit` throws.          |

---

## Zod Validation

Pass a Zod schema via `schema`. The form validates on submit and shows inline field errors automatically.

```tsx
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(18, "You must be at least 18"),
  email: z.string().email("Invalid email address"),
  role: z.array(z.string()).min(1, "Select at least one role"),
});

<Formbox
  schema={schema}
  onSubmit={(data) => {
    // data is fully typed: { name: string; age: number; email: string; role: string[] }
    console.log(data);
  }}
  ...
/>
```

> **Tip**: Field names in your `fields` array must match the Zod schema keys exactly for errors to display inline.

---

## Conditional Fields (showWhen)

Fields can be shown or hidden based on the value of another field:

```tsx
{ name: "accountType", type: "radio", label: "Account Type", options: [
    { label: "Personal", value: "personal" },
    { label: "Business", value: "business" },
]},
{
  name: "companyName",
  type: "text",
  label: "Company Name",
  // Only shown when accountType === "business"
  showWhen: { field: "accountType", equals: "business" },
},
```

### ShowWhen operators

| Operator    | Example                                  | Description                           |
| ----------- | ---------------------------------------- | ------------------------------------- |
| `equals`    | `{ field: "type", equals: "business" }`  | Show when field value equals a value. |
| `notEquals` | `{ field: "type", notEquals: "none" }`   | Show when field value is NOT a value. |
| `in`        | `{ field: "role", in: ["admin","owner"]}` | Show when value is in an array.      |

---

## Legacy API Mapping

These legacy props are still fully supported but are mapped internally to v2. Prefer v2 props for new code.

| Legacy Prop         | v2 Equivalent                        |
| ------------------- | ------------------------------------ |
| `formtoogle`        | `onOpenChange`                       |
| `formtitle`         | `title`                              |
| `textfield`         | `fields`                             |
| `validationSchema`  | `schema`                             |
| `checklimit`        | `maxSelections` on `FormField`       |
| `arialabel`         | `ariaLabel` on `FormField`           |
| `selectlabel`       | `selectLabel` on `FormField`         |

---

> 💡 **CSS Note**: Always import `"react-form-toaster/dist/index.css"` once in your app entry file. This bundles the default styles and scrollbar utilities — no extra Tailwind config needed.
