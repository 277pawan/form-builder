# React-Form-Toaster 1.1.2

[![GitHub Repo](https://github.githubassets.com/favicons/favicon.png) **React-form-toaster**](https://github.com/277pawan/form-builder)

![User-Form](https://cure-ten.vercel.app/static/media/ezgif.com-video-to-gif-converter.01200ebb8d2078e8d60e.gif)

![Confirmation-form](https://cure-ten.vercel.app/static/media/confirm.4b962f1dee5f2bc649cd.png)

🎊 React-Form-Toaster is a powerful and flexible library designed for creating dynamic forms in React with ease. Users can quickly generate complex forms by simply defining input types, buttons, and other elements, without needing to create each element separately.

```sh
$ npm install --save react-form-toaster
$ yarn add react-form-toaster
```

## Features

- Easy Setup: Get started in less than 10 seconds! Quickly integrate and begin creating dynamic forms without hassle.😎
- Dynamic Form Creation: Simply define the type of fields, labels, form title, and required attributes, and the library handles the rest.
- Highly Customizable: Customize every aspect of your form, including classes, messages, and more, to fit your specific needs.
- TypeScript Support: Built with TypeScript, ensuring strong typing and safer code development.🤯
- Tailwind CSS Integration: Optimized for Tailwind CSS, allowing for efficient and modern styling right out of the box.
- Default Form UI: Comes with a beautifully designed default form UI that you can use as-is or customize further to match your design requirements.
- Form Validation and Error Handling: Easily define required fields and validate user input with built-in error handling and custom validation functions.🍃
- Responsive Design: Fully responsive, making it easy to create forms that look great on any device.
- Zod Validation: Easily apply Zod validation in your Form🔐.
- Fully Customizable Forms: Provides the flexibility to design forms with custom classes and styles, ensuring they match your application's theme.😱

### Quick Setup

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

> Note: It is important to import index.css after App.tsx to ensure that all styles are correctly applied. This ensures that any global styles are loaded after the component has been imported.

### User-Forms

```javascript
import Formbox from "react-form-toaster";
import "react-form-toaster/dist/dist/tailwind.css";
<Formbox
  formtoogle={setfirstform}
  formtitle={[
    {
      title: "Form-Builder",
      className: ["text-2xl font-bold "],
    },
  ]}
  textfield={[
    {
      name: "firstname",
      placeholder: "Enter your Firstname",
      label: "FirstName",
      required: false,
      // type: "text"
    },
    {
      name: "age",
      placeholder: "Enter your age",
      label: "Age",
      type: "number",
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
    },
  ]}
  validationSchema={validationSchema}
/>;
```

```javascript
const handlesubmit = (data: any, e: React.MouseEvent) => {
  e.preventDefault();
  console.log(data);
};
```

#### Zod Validation

```javascript
const validationSchema = z.object({
  firstname: z
    .string()
    .min(4, { message: "First name must be at least 4 characters" }),
  age: z.number().min(18, { message: "You must be at least 18 years old" }),
});
```

### Confirmation-Forms

```sh
 <Formbox
 formtoogle={setsecondform}
 formtitle={[{
 title: "Confirmation-Form",
 }]}
 message={[{
 message: "This is very important file Are you sure want to delete this file? Please reconfirm it!"
 }]}
 buttons={[{
 name: "Ok",
 label: "Confirm",
 type: "ok",
 function: () => handleConfirm(true),
 className: ["bg-red-600"]
 },{
 name: "Cancel",
 label: "Cancel",
 type: "cancel",
 function: () => handleConfirm(false,200),
 className: ["text-red-600 border-1 border-red-600 bg-gray-100 hover:border-red-600 "]
 }]}
 />
```

```javascript
const handleConfirm = (confirm: boolean, productId: number) => {
  console.log(confirm, productId);
  if (confirm && productId) {
    console.log(" We got both of them. Hurrah! 🏆 ");
  }
  setsecondform(false);
};
```

## Component Attributes

The following tables detail all available attributes for each component in React-Form-Toaster:

### Formbox Component Attributes

| Attribute          | Type     | Description                                   | Required |
| ------------------ | -------- | --------------------------------------------- | -------- |
| `className`        | string[] | Custom classes for the form container         | No       |
| `formtoogle`       | Function | Function to toggle form visibility            | Yes      |
| `formtitle`        | Object[] | Form title configuration                      | No       |
| `textfield`        | Object[] | Text input field configurations               | No       |
| `buttons`          | Object[] | Button configurations                         | No       |
| `message`          | Object[] | Message configurations for confirmation forms | No       |
| `validationSchema` | Object   | Zod validation schema                         | No       |

### TextField Component Attributes

| Attribute     | Type    | Description                           | Example                   |
| ------------- | ------- | ------------------------------------- | ------------------------- |
| `name`        | string  | Input field name                      | "firstname"               |
| `placeholder` | string  | Placeholder text                      | "Enter your Firstname..." |
| `label`       | string  | Label text                            | "FirstName"               |
| `type`        | string  | Input type (text, number, file, etc.) | "number"                  |
| `required`    | boolean | Whether field is required             | true                      |
| `arialabel`   | string  | Accessibility label                   | "FileUpload"              |

### File Upload Specific Attributes

| Attribute          | Type        | Description                 | Example                |
| ------------------ | ----------- | --------------------------- | ---------------------- |
| `number`           | number      | Maximum number of files     | 5                      |
| `preview`          | string      | Preview type ("image")      | "image"                |
| `previewClassName` | string[]    | Classes for preview element | ["h-32 w-32"]          |
| `icon`             | JSX.Element | Icon for removing files     | `<RiCloseLargeLine />` |

### Button Component Attributes

| Attribute   | Type     | Description                             | Example         |
| ----------- | -------- | --------------------------------------- | --------------- |
| `name`      | string   | Button text                             | "Submit"        |
| `type`      | string   | Button type (submit, reset, ok, cancel) | "submit"        |
| `label`     | string   | ARIA label                              | "Submitbutton"  |
| `function`  | Function | Click handler                           | handlesubmit    |
| `className` | string[] | Custom classes                          | ["bg-red-600"]  |
| `arialabel` | string   | Accessibility label                     | "Submit_button" |
| `tooltip`   | string   | Tooltip text                            | "Submit Form"   |

### Loader Component Attributes

| Attribute   | Type     | Description            | Example            |
| ----------- | -------- | ---------------------- | ------------------ |
| `loader`    | boolean  | Whether to show loader | true               |
| `className` | string[] | Loader custom classes  | ["border-red-500"] |

### Message Component Attributes

| Attribute   | Type     | Description    | Example                                  |
| ----------- | -------- | -------------- | ---------------------------------------- |
| `message`   | string   | Message text   | "Are you sure want to delete this file?" |
| `className` | string[] | Custom classes | ["text-gray-700"]                        |

## Contribute

Show your ❤️ and support by giving a ⭐. Any suggestions are welcome! Take a look at the contributing guide.
You can also find me on Github [**277pawan**](https://github.com/277pawan).

**Free Library, Happy Coding😎😎!**
