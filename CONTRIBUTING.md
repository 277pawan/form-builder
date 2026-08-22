# Contributing to Form Builder

First off, thank you for considering contributing to **Form Builder** (React-Form-Toaster)! 🎉

Whether you are fixing a bug, proposing a new feature, adding a new field type, or improving documentation, your contributions are greatly appreciated and help make this library better for everyone.

---

## 📜 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [How Can I Contribute?](#-how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Submitting Pull Requests](#submitting-pull-requests)
- [Local Development Setup](#-local-development-setup)
- [Project Architecture & Structure](#-project-architecture--structure)
- [Coding Guidelines & Standards](#-coding-guidelines--standards)
- [Pull Request Guidelines](#-pull-request-guidelines)

---

## 🤝 Code of Conduct

Please help maintain a welcoming, respectful, and inclusive environment for all contributors:
- Use welcoming and inclusive language.
- Be respectful of differing viewpoints and experiences.
- Gracefully accept constructive criticism.
- Focus on what is best for the community and project users.

---

## 🚀 How Can I Contribute?

### Reporting Bugs

Before creating a bug report, please check the existing [GitHub Issues](https://github.com/277pawan/form-builder/issues) to ensure it hasn't already been reported.

When creating a bug report, please include:
1. **Clear Title**: A concise title summarizing the bug.
2. **Steps to Reproduce**: Minimal steps required to trigger the issue.
3. **Expected vs Actual Behavior**: What you expected to happen vs what actually happened.
4. **Environment Info**: React version, browser/OS version, and library version.
5. **Code Snippet**: Minimal reproducible React code showcasing the issue.

### Suggesting Enhancements

We welcome proposals for new form field types, customization props, performance improvements, or UX refinements!

When submitting a feature suggestion:
- Explain **why** the feature is useful to the broader community.
- Provide a proposed API / Prop interface structure if applicable (e.g. new `FormField` prop or component attribute).
- Mention any edge cases or backward compatibility concerns.

### Submitting Pull Requests

1. Fork the repository and create your feature/bugfix branch from `main`.
2. Keep your PR focused on a single responsibility or feature.
3. Verify that linting and build steps pass cleanly before opening the PR.

---

## 💻 Local Development Setup

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **yarn** / **pnpm**

### Setup Steps

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/form-builder.git
   cd form-builder
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   This launches Vite server (usually at `http://localhost:5173`) where you can test component changes interactively in `App.tsx`.

4. **Verify linting**:
   ```bash
   npm run lint
   ```

5. **Build the package**:
   ```bash
   npm run build
   ```
   Ensures TypeScript compilation and Vite build succeed without errors.

---

## 📂 Project Architecture & Structure

Understanding the layout of `src/` will help you locate the right place to add or edit code:

```
src/
├── components/          # UI Component definitions
│   ├── button/          # Button tag component & loader
│   ├── checkbox/        # Custom checkbox group component
│   ├── fileTag/         # File picker component
│   ├── inputTag/        # Input fields (text, email, password, array, etc.)
│   ├── select/          # Searchable multi-select dropdown component
│   └── Formbox.tsx      # Main Formbox modal component wrapper
├── engine/              # Form Engine Hook & Logic
│   └── useFormEngine.ts # Core state management, Zod validation, conditional rendering
├── types/               # TypeScript interfaces & types
│   └── form.ts          # FormboxProps, FormField, FormButton, Toast definitions
├── utils/               # Helper utilities
│   ├── cn.ts            # Class merging utility (mergeClasses)
│   └── index.ts         # Utility exports
├── validators/          # Zod validation schema helpers
│   └── formSchema.ts    # Schema builder & normalization utilities
├── App.tsx              # Interactive demo page for local development
└── index.css            # Tailwind & core library styling
```

---

## 📐 Coding Guidelines & Standards

To maintain high code quality and consistency across `form-builder`:

1. **TypeScript Strictness**:
   - Avoid `any` types wherever possible.
   - Always update `src/types/form.ts` when introducing new component props or field properties.

2. **Styling & Utility Classes**:
   - Use the `mergeClasses` utility in `src/utils/cn.ts` when merging user-supplied classes (`className`, `addButtonClassName`, etc.) with default component styles.
   - Respect Tailwind CSS utility ordering and avoid conflicting default classes.

3. **Backwards Compatibility**:
   - The library supports both v2 API and legacy prop aliases (`formtoogle`, `textfield`, `formtitle`, etc.). Ensure modifications do not break legacy prop mappings.

4. **Accessibility (a11y)**:
   - Always ensure interactive elements support keyboard navigation, ARIA attributes (`aria-label`, `aria-expanded`), and clean focus states.

---

## Check PR Checklist Before Submitting

- [ ] Code follows existing formatting and style conventions.
- [ ] Added or updated relevant TypeScript interfaces in `src/types/form.ts`.
- [ ] Updated `README.md` or `CONFIGURATION.md` if adding or changing public API props.
- [ ] Executed `npm run lint` with 0 errors/warnings.
- [ ] Executed `npm run build` successfully.
- [ ] Tested functionality locally using `npm run dev`.

---

## 💬 Need Help?

If you have questions, feel free to open a [GitHub Discussion](https://github.com/277pawan/form-builder/discussions) or open an issue labeled `question`.

Thank you for helping make **Form Builder** better! ❤️
