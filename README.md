# React Form Toaster — React Form Builder & Form Validation

[![GitHub Repo](https://github.githubassets.com/favicons/favicon.png) **React Form Toaster**](https://github.com/277pawan/form-builder)

[![User Form Demo](https://res.cloudinary.com/dc30b7tnj/video/upload/so_0/form-builder_tibv9z.jpg)](https://res.cloudinary.com/dc30b7tnj/video/upload/v1787248451/form-builder_tibv9z.mp4)

![Confirmation-form](https://cure-ten.vercel.app/static/media/confirm.4b962f1dee5f2bc649cd.png)

**React Form Toaster** is a Json-schema-driven React form builder and form validation library for creating dynamic forms from a JSON-like configuration.

Define your fields, buttons, validation, conditional logic, styling, and toast messages in a single configuration. React Form Toaster handles form state, validation errors, password visibility, file uploads, loading states, modal forms, inline forms, and toast notifications for you.

It is designed for React and TypeScript applications that need **dynamic forms, schema-based form generation, Zod validation, conditional fields, and built-in form notifications** without writing repetitive HTML, CSS, Form state and Validation code.

## Why React Form Toaster?

Building forms in React often requires repetitive code for:

* Form fields and input state
* Validation and error messages
* Submit/loading states
* Conditional fields
* Password visibility
* Select and multiselect controls
* Modal and inline form layouts
* Success and error notifications
* Styling individual form components

React Form Toaster provides a schema-driven approach so you can describe your form configuration once and let the component handle the form behavior.

```text
Schema
  ↓
Fields + Validation + Buttons + Styling
  ↓
React Form Toaster
  ↓
Dynamic React Form
  ↓
Validation + Loading + Toast Notifications
```

## Key Features

* 📜 **Schema & JSON Driven** — Define fields, buttons, validation, and styling with a clean JSON-like configuration.
* ⚡ **Less Boilerplate** — Avoid repetitive form fields, state management, and validation error handling.
* 🔷 **TypeScript & Zod Integration** — Use Zod schemas for type-safe client-side validation.
* 🎨 **Flexible Styling** — Use Tailwind `className` utilities or inline React `style` objects.
* 🪟 **Modal & Inline Forms** — Use `mode="modal"` for popup forms or `mode="inline"` for embedded forms.
* 🍞 **Built-in Toast Notifications** — Show loading, success, and error messages automatically.
* 🔌 **External Toast Support** — Disable built-in toasts with `toast={false}` and use your preferred toast library.
* 🔁 **Conditional Fields** — Display fields dynamically with `showWhen`.
* 📚 **Array Fields** — Build repeatable and nested form groups.
* 🔐 **Password Fields** — Add password visibility toggles.
* 📁 **File Uploads** — Support file-based form fields.
* 🎛️ **Custom Buttons** — Configure submit, reset, cancel, OK, and custom buttons.
* 📱 **Responsive Styling** — Apply Tailwind responsive utilities directly to form elements.

---

## Installation

Install React Form Toaster using npm:

```sh
npm install react-form-toaster
```

Or with Yarn:

```sh
yarn add react-form-toaster
```

---

## Quick Start

Import the component and stylesheet once in your application entry file:

```tsx
import Formbox from "react-form-toaster";
import "react-form-toaster/dist/index.css";
```

A simple schema-driven React form can then be created like this:

```tsx
import Formbox from "react-form-toaster";
import "react-form-toaster/dist/index.css";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
});

export function ContactForm() {
  return (
    <Formbox
      open={true}
      onOpenChange={() => {}}
      mode="inline"
      schema={schema}
      onSubmit={async (data) => {
        console.log(data);
      }}
      fields={[
        {
          name: "name",
          type: "text",
          label: "Name",
          placeholder: "Your name",
          required: true,
        },
        {
          name: "email",
          type: "email",
          label: "Email",
          placeholder: "you@example.com",
          required: true,
        },
      ]}
      buttons={[
        {
          name: "Submit",
          type: "submit",
          loadingText: "Submitting...",
        },
      ]}
    />
  );
}
```

---

## React Form Builder with Zod Validation

React Form Toaster works with [Zod](https://zod.dev/) schemas so you can define validation separately from the visual field configuration.

For example:

```tsx
const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
```

The field definitions describe how the form should be rendered:

```tsx
fields={[
  {
    name: "firstName",
    type: "text",
    label: "First Name",
    required: true,
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    required: true,
  },
  {
    name: "password",
    type: "password",
    label: "Password",
    required: true,
    passwordToggle: true,
  },
]}
```

This separation makes it possible to build reusable and dynamic forms while keeping validation rules in a Zod schema.

---

## Complete React Form Example

A more realistic example showing validation, multiple field types, conditional fields, password visibility, custom styling, and toast notifications.

```tsx
import Formbox from "react-form-toaster";
import "react-form-toaster/dist/index.css";
import { z } from "zod";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  accountType: z.enum(["personal", "business"]),
  companyName: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export function AccountForm() {
  return (
    <Formbox
      open={true}
      onOpenChange={() => {}}
      mode="inline"
      closeFormIcon={false}
      errorPosition="bottom"

      containerClassName="w-full max-w-lg mx-auto rounded-2xl p-6 shadow-2xl"
      innerContainerClassName="space-y-4"
      buttonContainerClassName="pt-4 flex w-full"
      inputClassName="rounded-xl"

      title={{
        text: "Create your account",
        className: "text-2xl font-bold text-gray-900 mb-1",
      }}

      description={{
        text: "Fill in your details to get started.",
        className: "text-sm text-gray-500 mb-5",
      }}

      labelClassName="block text-sm font-medium mb-1.5 text-gray-700"
      requiredClassName="ml-1 text-red-500"
      errorClassName="text-xs font-medium mt-1.5 block text-red-500"

      schema={schema}

      onSubmit={async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("Submitted:", data);
      }}

      toast={{
        loading: "Creating account...",
        success: "Account created successfully! 🎉",
        error: "Something went wrong",
        position: "bottom-right",
      }}

      fields={[
        {
          name: "firstName",
          type: "text",
          label: "First Name",
          placeholder: "Sarah",
          required: true,
          className: "w-full rounded-xl",
        },

        {
          name: "lastName",
          type: "text",
          label: "Last Name",
          placeholder: "Johnson",
          required: true,
          className: "w-full rounded-xl",
        },

        {
          name: "email",
          type: "email",
          label: "Email",
          placeholder: "sarah@example.com",
          required: true,
          className: "w-full rounded-xl",
        },

        {
          name: "accountType",
          type: "select",
          label: "Account Type",
          required: true,
          options: [
            {
              label: "Personal",
              value: "personal",
            },
            {
              label: "Business",
              value: "business",
            },
          ],
          className: "w-full rounded-xl",
          dropdownClassName: "rounded-xl shadow-lg",
          optionsClassName: "hover:bg-gray-100",
        },

        {
          name: "companyName",
          type: "text",
          label: "Company Name",
          placeholder: "Acme Inc.",
          showWhen: {
            field: "accountType",
            equals: "business",
          },
          className: "w-full rounded-xl",
        },

        {
          name: "password",
          type: "password",
          label: "Password",
          placeholder: "At least 8 characters",
          required: true,
          passwordToggle: true,
          className: "w-full rounded-xl",
          passwordToggleClassName:
            "text-gray-500 hover:text-gray-900 transition-colors",
        },
      ]}

      buttons={[
        {
          name: "Create Account",
          type: "submit",
          loadingText: "Creating...",
          className:
            "w-full rounded-xl py-3 font-semibold cursor-pointer transition-opacity hover:opacity-90",
          style: {
            backgroundColor: "#6366f1",
            color: "#ffffff",
            border: "none",
          },
          disabledClassName: "opacity-50 cursor-not-allowed",
        },
      ]}
    />
  );
}
```

This example demonstrates:

* Zod validation
* Multiple field types
* Select fields
* Conditional fields with `showWhen`
* Password visibility toggle
* Tailwind classes
* Inline styling
* Loading state
* Success and error toasts
* Async form submission

---

## Conditional Fields

Dynamic forms often need fields that appear based on another field's value.

React Form Toaster supports conditional fields with `showWhen`.

```tsx
{
  name: "companyName",
  type: "text",
  label: "Company Name",
  showWhen: {
    field: "accountType",
    equals: "business",
  },
}
```

For example, the company field can automatically appear when the user selects `Business`.

This can be useful for:

* Registration forms
* Checkout forms
* Account forms
* Profile forms
* Onboarding forms
* Multi-purpose forms

---

## Modal and Inline React Forms

React Form Toaster supports two main display modes.

### Inline Form

Use:

```tsx
mode="inline"
```

for forms embedded directly into a page or card.

### Modal Form

Use:

```tsx
mode="modal"
```

for popup and confirmation workflows.

---

## Confirmation Forms

React Form Toaster can also be used for smaller confirmation workflows, not just large forms.

For example, you can build a confirmation box before deleting an account, removing a resource, or performing another destructive action.

```tsx
import Formbox from "react-form-toaster";
import "react-form-toaster/dist/index.css";
import { z } from "zod";

const confirmationSchema = z.object({
  confirmation: z
    .string()
    .refine(
      (value) => value === "DELETE",
      "Please type DELETE to confirm"
    ),
});

export function DeleteConfirmation() {
  return (
    <Formbox
      open={true}
      onOpenChange={() => {}}
      mode="modal"
      errorPosition="bottom"

      containerClassName="w-full max-w-md rounded-2xl p-6 shadow-2xl"

      title={{
        text: "Delete your account?",
        className: "text-xl font-bold text-gray-900",
      }}

      description={{
        text: "This action cannot be undone. Type DELETE below to confirm.",
        className: "text-sm text-gray-500 mt-2 mb-5",
      }}

      labelClassName="block text-sm font-medium text-gray-700 mb-1.5"
      errorClassName="text-sm text-red-500 mt-1.5"

      schema={confirmationSchema}

      onSubmit={async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        console.log("Confirmed:", data);
      }}

      toast={{
        loading: "Deleting account...",
        success: "Account deleted successfully",
        error: "Unable to delete account",
        position: "bottom-right",
      }}

      fields={[
        {
          name: "confirmation",
          type: "text",
          label: "Confirmation",
          placeholder: "Type DELETE",
          required: true,
          className: "w-full rounded-xl",
        },
      ]}

      buttons={[
        {
          name: "Cancel",
          type: "cancel",
          className:
            "rounded-xl px-5 py-3 font-medium border border-gray-300 text-gray-700 hover:bg-gray-50",
        },
        {
          name: "Delete Account",
          type: "submit",
          loadingText: "Deleting...",
          className:
            "rounded-xl px-5 py-3 font-semibold cursor-pointer transition-opacity hover:opacity-90",
          style: {
            backgroundColor: "#dc2626",
            color: "#ffffff",
            border: "none",
          },
          disabledClassName: "opacity-50 cursor-not-allowed",
        },
      ]}
    />
  );
}
```

This is useful for:

* 🗑️ Delete account
* 🗑️ Delete a project
* ⚠️ Remove a team member
* 🔄 Reset application data
* 📦 Cancel an order
* 🔐 Confirm a security-sensitive action

---

## Tailwind CSS and Inline Styles

The library ships its Tailwind utility CSS, so standard utility classes passed through `className` work on fields, buttons, titles, descriptions, messages, and containers.

For example:

```tsx
className="bg-pink-600 text-white rounded-xl px-4 py-3 font-semibold"
```

Use `style` for arbitrary CSS values that are not part of the shipped utility set:

```tsx
style={{
  backgroundColor: "#6366f1",
  color: "#ffffff",
  borderRadius: "12px",
}}
```

When both specify the same CSS property, standard CSS precedence applies and inline `style` wins.

```tsx
style={{ color: "black" }}
className="bg-pink-600 text-white"
```

In this example, the inline `color` takes precedence over `text-white`.

---

## Select and Multiselect Styling

For select and multiselect fields, use `dropdownClassName` and `optionsClassName` to style the opened menu and its options.

```tsx
{
  name: "role",
  type: "select",
  searchable: true,
  options: [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
  ],
  className: "border-gray-700",
  style: {
    backgroundColor: "#111827",
    borderColor: "#374151",
    color: "#ffffff",
  },
  dropdownClassName: "bg-gray-900 border-gray-700",
  optionsClassName: "text-gray-200 hover:bg-gray-800 hover:text-white",
}
```

`optionClassName` is retained as a deprecated alias for `optionsClassName`.

---

## External Toast Libraries

You can disable the built-in toast system and use your own notification library.

Set:

```tsx
toast={false}
```

For example, with `react-hot-toast`:

```tsx
import toast from "react-hot-toast";

<Formbox
  toast={false}
  onSubmit={async (data) => {
    try {
      await api.save(data);
      toast.success("Saved successfully!");
    } catch (err) {
      toast.error("Failed to save");
    }
  }}
  ...
/>
```

This allows React Form Toaster to handle the form while your application controls its own notification system.

---

# Component Attributes & API Reference

## Formbox Props

| Prop                       | Type                             | Default    | Description                                                     |
| -------------------------- | -------------------------------- | ---------- | --------------------------------------------------------------- |
| `open`                     | `boolean`                        | `true`     | Controls form visibility.                                       |
| `onOpenChange`             | `(open: boolean) => void`        | —          | Callback when open/close state changes.                         |
| `mode`                     | `"modal" \| "inline"`            | `"modal"`  | Display mode: modal popup or inline embedded card.              |
| `inline`                   | `boolean`                        | `false`    | Shorthand for `mode="inline"`.                                  |
| `fields`                   | `FormField[]`                    | `[]`       | JSON array of field definitions.                                |
| `buttons`                  | `FormButton[]`                   | `[]`       | JSON array of button definitions.                               |
| `title`                    | `string \| { text, className? }` | —          | Form title heading.                                             |
| `description`              | `string \| { text, className? }` | —          | Subtitle text below title.                                      |
| `schema`                   | `z.ZodTypeAny`                   | —          | Zod schema for client-side validation.                          |
| `onSubmit`                 | `(data) => void \| Promise`      | —          | Submit handler called on valid submission.                      |
| `toast`                    | `boolean \| ToastMessages`       | `true`     | Built-in toast config, or `false` for external toast libraries. |
| `containerClassName`       | `ClassValue`                     | —          | Outer card container Tailwind classes.                          |
| `innerContainerClassName`  | `ClassValue`                     | —          | Inner form wrapper Tailwind classes.                            |
| `buttonContainerClassName` | `ClassValue`                     | —          | Button row container classes.                                   |
| `inputClassName`           | `ClassValue`                     | —          | Form-level default classes applied to all inputs.               |
| `labelClassName`           | `ClassValue`                     | —          | Form-level default label styling.                               |
| `requiredClassName`        | `ClassValue`                     | —          | Form-level required asterisk styling.                           |
| `errorClassName`           | `ClassValue`                     | —          | Form-level validation error text styling.                       |
| `errorPosition`            | `"top" \| "bottom"`              | `"top"`    | Where validation errors appear.                                 |
| `focusClassName`           | `ClassValue`                     | —          | Form-level focus border/ring classes.                           |
| `fieldWrapperClassName`    | `ClassValue`                     | —          | Form-level field row wrapper styling.                           |
| `passwordToggleClassName`  | `ClassValue`                     | —          | Form-level password toggle icon styling.                        |
| `closeFormIcon`            | `boolean`                        | modal mode | Show/hide the top-right close button.                           |

## FormField Schema Attributes

| Attribute                 | Type                  | Description                                                                                                                  |
| ------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `name`                    | `string`              | **Required.** Unique key matching the Zod schema key.                                                                        |
| `type`                    | `string`              | `"text"`, `"email"`, `"password"`, `"number"`, `"checkbox"`, `"radio"`, `"select"`, `"multiselect"`, `"file"`, or `"array"`. |
| `label`                   | `string`              | Label text above input.                                                                                                      |
| `placeholder`             | `string`              | Placeholder text.                                                                                                            |
| `required`                | `boolean`             | Shows required asterisk.                                                                                                     |
| `className`               | `ClassValue`          | Tailwind layout classes for the input.                                                                                       |
| `style`                   | `React.CSSProperties` | Inline CSS object for colors and borders.                                                                                    |
| `dropdownClassName`       | `ClassValue`          | Classes for the opened select/multiselect dropdown.                                                                          |
| `optionsClassName`        | `ClassValue`          | Classes for select/multiselect options, selected text, and selected tags.                                                    |
| `errorPosition`           | `"top" \| "bottom"`   | Override error position for the specific field.                                                                              |
| `labelClassName`          | `ClassValue`          | Per-field label styling override.                                                                                            |
| `requiredClassName`       | `ClassValue`          | Per-field required asterisk override.                                                                                        |
| `errorClassName`          | `ClassValue`          | Per-field error text styling override.                                                                                       |
| `focusClassName`          | `ClassValue`          | Per-field focus state override.                                                                                              |
| `passwordToggleClassName` | `ClassValue`          | Password toggle icon override.                                                                                               |
| `passwordToggle`          | `boolean`             | Enables the show/hide password toggle.                                                                                       |
| `options`                 | `{ label, value }[]`  | Options for checkbox, radio, select, and multiselect fields.                                                                 |
| `showWhen`                | `ShowWhen`            | Conditional visibility: `{ field, equals }`.                                                                                 |

## FormButton Schema Attributes

| Attribute           | Type                                                  | Description                                    |
| ------------------- | ----------------------------------------------------- | ---------------------------------------------- |
| `name`              | `string`                                              | Button label text.                             |
| `type`              | `"submit" \| "reset" \| "cancel" \| "ok" \| "button"` | Button behavior type.                          |
| `className`         | `ClassValue`                                          | Tailwind layout classes.                       |
| `style`             | `React.CSSProperties`                                 | Inline CSS for button colors and styling.      |
| `disabledClassName` | `ClassValue`                                          | Classes applied when disabled or submitting.   |
| `loadingText`       | `string`                                              | Text shown during loading.                     |
| `onClick`           | `(data, e) => void \| Promise`                        | Click handler that receives current form data. |
| `toast`             | `ToastMessages`                                       | Button-level toast configuration.              |

---

## Common Use Cases

React Form Toaster can be used for many types of React forms and workflows:

* Registration forms
* Login forms
* Contact forms
* Account creation forms
* Profile forms
* Checkout forms
* Dynamic form builders
* Zod validation forms
* Settings forms
* Onboarding forms
* Confirmation dialogs
* File upload forms
* Conditional forms
* Modal forms
* Inline forms

---

## Technology

React Form Toaster is designed for modern React applications and supports:

* React
* TypeScript
* Zod
* Tailwind CSS utilities
* JSON/schema-driven form configuration
* React Hooks

---

## Contributing

### ❤️ Like This Project?

If this project helped you save time, understand something new, or simply made your life a little easier, consider showing your support by giving it a ⭐ **Star**.

Found something that could be better? **I'd genuinely love to hear from you!** Feel free to open an issue, suggest an improvement, or contribute.

📖 Take a look at the [**Contributing Guide**](CONTRIBUTING.md) to get started.

You can also find me on GitHub: [**277pawan**](https://github.com/277pawan).

> ⭐ **If this repository saved you even a little time, give it a Star — it means a lot! ❤️**
