# React-Form-Toaster 2.0

[![GitHub Repo](https://github.githubassets.com/favicons/favicon.png) **React-form-toaster**](https://github.com/277pawan/form-builder)

[![User Form Demo](https://res.cloudinary.com/dc30b7tnj/video/upload/so_0/form-builder_tibv9z.jpg)](https://res.cloudinary.com/dc30b7tnj/video/upload/v1787248451/form-builder_tibv9z.mp4)

![Confirmation-form](https://cure-ten.vercel.app/static/media/confirm.4b962f1dee5f2bc649cd.png)

🎊 React-Form-Toaster is a powerful and flexible library for creating dynamic forms in React. Pass a single JSON-like schema for fields, buttons, validation, and styling — the library handles layout, state, error handling, password toggles, file uploads, and toasts automatically!

```sh
npm install react-form-toaster
# or
yarn add react-form-toaster
```

## Key Strengths & Features

- 📜 **100% Schema & JSON Driven** — Define your entire form in a clean JSON-like schema.
- ⚡ **Zero Boilerplate** — No repetitive form fields, state hooks, or error messages.
- 🎨 **Granular Styling** — Deep control via `className` (Tailwind) **and** `style` (inline CSS).
- 🔷 **TypeScript & Zod Integration** — Full type safety with Zod schemas for validation.
- 🖼️ **Modal & Inline Modes** — Embed as a card (`mode="inline"`) or popup (`mode="modal"`).
- 🍞 **Flexible Toasts** — Built-in toasts or `toast={false}` to use your own library.
- 🔁 **Array & Conditional Fields** — Repeatable nested groups and `showWhen` visibility.

---

## Quick Setup

Import **once** in your app entry file:

```tsx
import Formbox from "react-form-toaster";
import "react-form-toaster/dist/index.css";
```

## Tailwind Classes and `style`

The library ships its Tailwind utility CSS, so standard utility classes passed through `className` work on fields, buttons, titles, descriptions, messages, and containers. This includes colors such as `bg-pink-600` and `text-white`, responsive utilities, spacing, typography, layout, borders, shadows, and common hover/focus states.

Use `className` for normal Tailwind styling. Use `style` for arbitrary values that are not part of the shipped utility set, such as a custom hex color. When both specify the same CSS property, standard CSS precedence applies: inline `style` wins over a class.

```tsx
// ✅ Standard Tailwind utilities work in className
className="bg-pink-600 text-white rounded-xl px-4 py-3 font-semibold"

// ✅ Inline style is useful for arbitrary values
style={{ backgroundColor: "#6366f1", color: "#ffffff", borderRadius: "12px" }}

// ⚠️ Here the inline color intentionally wins over text-white
style={{ color: "black" }}
className="bg-pink-600 text-white"
```

---

## Complete Dark UI Example (Figma-ready)

```tsx
import Formbox from "react-form-toaster";
import "react-form-toaster/dist/index.css";
import { z } from "zod";

const schema = z.object({
  firstname: z.string().min(1, "First name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Must be 8+ chars"),
});

export function HeroFormDemo() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ backgroundColor: "#080a0f" }}>
      <div className="w-full max-w-sm">
        <Formbox
          open={true}
          onOpenChange={() => {}}
          mode="inline"
          closeFormIcon={false}
          errorPosition="bottom"

          containerClassName="w-full rounded-2xl p-6 shadow-2xl overflow-visible"
          innerContainerClassName="space-y-4 overflow-visible"
          buttonContainerClassName="pt-3 flex w-full"
          inputClassName="rounded-xl border"

          title={{
            text: "Create an account",
            className: "text-2xl font-bold text-white mb-1",
          }}
          description={{
            text: "Enter your details to test the form live.",
            className: "text-sm mb-5 text-gray-400",
          }}

          labelClassName="block text-sm font-medium mb-1.5"
          requiredClassName="ml-0.5"
          errorClassName="text-xs font-medium mt-1.5 block"

          schema={schema}
          onSubmit={async (data) => {
            console.log("Submitted:", data);
          }}

          toast={{
            loading: "Creating account...",
            success: "Account created! 🎉",
            error: "Something went wrong",
            position: "bottom-right",
          }}

          fields={[
            {
              name: "firstname",
              type: "text",
              label: "First Name",
              placeholder: "Sarah",
              required: true,
              // ✅ style for colors — guaranteed to work
              style: {
                backgroundColor: "#12141c",
                border: "1px solid #252836",
                color: "#ffffff",
                borderRadius: "12px",
              },
              labelClassName: "text-[#d1d5db] text-sm font-medium",
              requiredClassName: "text-[#ef4444]",
              errorClassName: "text-[#ef4444] text-xs mt-1 block",
            },
            {
              name: "email",
              type: "email",
              label: "Email",
              placeholder: "sarah@design.dev",
              required: true,
              style: {
                backgroundColor: "#12141c",
                border: "1px solid #252836",
                color: "#ffffff",
                borderRadius: "12px",
              },
              labelClassName: "text-[#d1d5db] text-sm font-medium",
              requiredClassName: "text-[#ef4444]",
              errorClassName: "text-[#ef4444] text-xs mt-1 block",
            },
            {
              name: "password",
              type: "password",
              label: "Password",
              placeholder: "Must be 8+ chars",
              required: true,
              passwordToggle: true,
              style: {
                backgroundColor: "#12141c",
                border: "1px solid #252836",
                color: "#ffffff",
                borderRadius: "12px",
              },
              labelClassName: "text-[#d1d5db] text-sm font-medium",
              requiredClassName: "text-[#ef4444]",
              errorClassName: "text-[#ef4444] text-xs mt-1 block",
              passwordToggleClassName: "text-[#6b7280] hover:text-white transition-colors",
            },
          ]}

          buttons={[
            {
              name: "Create Account",
              type: "submit",
              loadingText: "Creating...",
              // ✅ Layout via className, colors via style
              className: "w-full rounded-xl py-3 font-semibold text-base cursor-pointer transition-opacity hover:opacity-90",
              style: {
                backgroundColor: "#6366f1",
                color: "#ffffff",
                border: "none",
              },
              disabledClassName: "opacity-50 cursor-not-allowed",
            },
          ]}
        />
      </div>
    </div>
  );
}
```

---

## Component Attributes & API Reference

### Formbox Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `open` | `boolean` | `true` | Controls form visibility. |
| `onOpenChange` | `(open: boolean) => void` | — | Callback when open/close state changes. |
| `mode` | `"modal" \| "inline"` | `"modal"` | Display mode: modal popup or inline embedded card. |
| `inline` | `boolean` | `false` | Shorthand for `mode="inline"`. |
| `fields` | `FormField[]` | `[]` | JSON array of field definitions. |
| `buttons` | `FormButton[]` | `[]` | JSON array of button definitions. |
| `title` | `string \| { text, className? }` | — | Form title heading. |
| `description` | `string \| { text, className? }` | — | Subtitle text below title. |
| `schema` | `z.ZodTypeAny` | — | Zod schema for client-side validation. |
| `onSubmit` | `(data) => void \| Promise` | — | Submit handler called on valid submission. |
| `toast` | `boolean \| ToastMessages` | `true` | Built-in toast config, or `false` for external toast libraries. |
| `containerClassName` | `ClassValue` | — | Outer card container Tailwind classes. |
| `innerContainerClassName` | `ClassValue` | — | Inner form wrapper Tailwind classes. |
| `buttonContainerClassName` | `ClassValue` | — | Button row container classes (use `w-full` for full-width buttons). |
| `inputClassName` | `ClassValue` | — | Form-level default classes applied to all inputs. |
| `labelClassName` | `ClassValue` | — | Form-level default label styling. |
| `requiredClassName` | `ClassValue` | — | Form-level required asterisk (`*`) styling. |
| `errorClassName` | `ClassValue` | — | Form-level validation error text styling. |
| `errorPosition` | `"top" \| "bottom"` | `"top"` | Where validation errors appear: `"top"` (inline right of label) or `"bottom"` (below input). |
| `focusClassName` | `ClassValue` | — | Form-level focus border/ring classes. |
| `fieldWrapperClassName` | `ClassValue` | — | Form-level field row wrapper styling. |
| `passwordToggleClassName` | `ClassValue` | — | Form-level password toggle icon styling. |
| `closeFormIcon` | `boolean` | modal mode | Show/hide the top-right `✕` close button. |

### FormField Schema Attributes

| Attribute | Type | Description |
| --------- | ---- | ----------- |
| `name` | `string` | **Required.** Unique key matching Zod schema key. |
| `type` | `string` | Field type: `"text"`, `"email"`, `"password"`, `"number"`, `"checkbox"`, `"radio"`, `"select"`, `"multiselect"`, `"file"`, `"array"`. |
| `label` | `string` | Label text above input. |
| `placeholder` | `string` | Placeholder text. |
| `required` | `boolean` | Shows required asterisk. |
| `className` | `ClassValue` | Tailwind layout classes for the input. |
| `style` | `React.CSSProperties` | **✅ Inline CSS object for colors/borders** — use this when Tailwind purging is an issue. |
| `dropdownClassName` | `ClassValue` | Classes for the opened select/multiselect dropdown container. |
| `optionsClassName` | `ClassValue` | Classes for select/multiselect options, selected text, and selected tags. |
| `errorPosition` | `"top" \| "bottom"` | Override error position for this specific field. |
| `labelClassName` | `ClassValue` | Per-field label styling override. |
| `requiredClassName` | `ClassValue` | Per-field required asterisk override. |
| `errorClassName` | `ClassValue` | Per-field error text styling override. |
| `focusClassName` | `ClassValue` | Per-field focus state override. |
| `passwordToggleClassName` | `ClassValue` | Password toggle icon override. |
| `passwordToggle` | `boolean` | Enables show/hide password toggle. |
| `options` | `{ label, value }[]` | Options for `checkbox`, `radio`, `select`, `multiselect`. |
| `showWhen` | `ShowWhen` | Conditional visibility: `{ field, equals }`. |

For select and multiselect fields, use `dropdownClassName` and `optionsClassName` to style the opened menu and its options. Inline `style` is useful for trigger colors that must work without Tailwind-generated color classes:

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

### FormButton Schema Attributes

| Attribute | Type | Description |
| --------- | ---- | ----------- |
| `name` | `string` | Button label text. |
| `type` | `"submit" \| "reset" \| "cancel" \| "ok" \| "button"` | Button behavior type. |
| `className` | `ClassValue` | Tailwind layout classes (e.g. `w-full rounded-xl py-3`). |
| `style` | `React.CSSProperties` | **✅ Inline CSS for button colors** — `{ backgroundColor: "#6366f1", color: "#fff" }`. |
| `disabledClassName` | `ClassValue` | Classes applied when disabled/submitting. |
| `loadingText` | `string` | Text shown with spinner during loading. |
| `onClick` | `(data, e) => void \| Promise` | Click handler — receives current form data. |
| `toast` | `ToastMessages` | Button-level toast config. |

---

## External Toast Libraries Integration

Set `toast={false}` to use your own notification library:

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

---

## Contribute

### ❤️ Like This Project?

If this project helped you save time, understand something new, or simply made your life a little easier, consider showing your support by giving it a ⭐ **Star**.

Found something that could be better? **I'd genuinely love to hear from you!** Feel free to open an issue, suggest an improvement, or contribute.

📖 Take a look at the [**Contributing Guide**](CONTRIBUTING.md) to get started.

You can also find me on GitHub: [**277pawan**](https://github.com/277pawan).

> ⭐ **If this repository saved you even a little time, give it a Star — it means a lot! ❤️**
