import type React from "react";
import type { z } from "zod";
import type { ClassValue } from "../utils/mergeClasses";

export type FieldType =
  | "text"
  | "email"
  | "number"
  | "password"
  | "search"
  | "checkbox"
  | "radio"
  | "select"
  | "multiselect"
  | "file"
  | "array";

export interface FieldOption {
  label: string;
  value: string;
}

export interface ShowWhen {
  field: string;
  equals?: unknown;
  notEquals?: unknown;
  in?: unknown[];
}

export interface FormField {
  name: string;
  type?: FieldType | string;
  default?: { label: string; value: string | string[] };
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: ClassValue;
  ariaLabel?: string;
  accept?: string;
  maxFiles?: number;
  selectLabel?: string;
  options?: FieldOption[];
  /** Max selections for checkbox groups */
  maxSelections?: number;
  /** Max selections for select / multiselect */
  maxSelect?: number;
  passwordToggle?: boolean;
  searchable?: boolean;
  icon?: { show?: React.ComponentType; hide?: React.ComponentType };
  showWhen?: ShowWhen;
  dependsOn?: string;
  /** Field label styling */
  labelClassName?: ClassValue;
  /** Required asterisk (*) styling */
  requiredClassName?: ClassValue;
  /** Error message styling */
  errorClassName?: ClassValue;
  /** Input focus state styling */
  focusClassName?: ClassValue;
  /** Field container / wrapper spacing and styling */
  wrapperClassName?: ClassValue;
  fieldWrapperClassName?: ClassValue;
  fieldContainerClassName?: ClassValue;
  /** Password toggle button styling */
  passwordToggleClassName?: ClassValue;
  /** Custom text for array add button */
  addButtonText?: string;
  addBtnText?: string;
  /** Custom text for array remove button */
  removeButtonText?: string;
  removeBtnText?: string;
  /** Custom classes for array add button */
  addButtonClassName?: ClassValue;
  addBtnClassName?: ClassValue;
  /** Custom classes for array remove button */
  removeButtonClassName?: ClassValue;
  removeBtnClassName?: ClassValue;
  /** Custom classes for array row container */
  itemClassName?: ClassValue;
  /** Nested fields when type is "array" */
  fields?: FormField[];
  /** Validation error message position: "top" (inline on label top-right) or "bottom" (below input field) */
  errorPosition?: "top" | "bottom";
  /** Inline CSS style object for field */
  dropdownClassName?: ClassValue;
  /** Custom classes for select and multiselect options */
  optionsClassName?: ClassValue;
  /** @deprecated Use optionsClassName instead */
  optionClassName?: ClassValue;
  style?: React.CSSProperties;
}

export interface FormTitleConfig {
  text: string;
  className?: ClassValue;
}

export interface FormDescriptionConfig {
  text: string;
  className?: ClassValue;
}

export interface FormMessage {
  text: string;
  className?: ClassValue;
}

export interface FormButton {
  name: string;
  type: "submit" | "reset" | "cancel" | "ok" | "button";
  className?: ClassValue;
  style?: React.CSSProperties;
  ariaLabel?: string;
  tooltip?: string;
  disabled?: boolean;
  disabledClassName?: ClassValue;
  loadingText?: string;
  onClick?: (data: unknown, e: React.MouseEvent) => void | Promise<void>;
  loader?: { loading?: boolean; className?: ClassValue };
  /** Show built-in toast when this button's onClick is triggered */
  toast?: ToastMessages;
}

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastMessages {
  loading?: string;
  success?: string;
  error?: string;
  /** Toast position on screen (default: "bottom-right") */
  position?: ToastPosition;
  /** Auto-dismiss duration in milliseconds (default: 3500) */
  duration?: number;
  /** Whether to show a close (X) button on toast (default: true) */
  dismissible?: boolean;
  /** Custom CSS classes applied to the toast container for each state */
  loadingClassName?: ClassValue;
  successClassName?: ClassValue;
  errorClassName?: ClassValue;
}

export type FormData = Record<string, unknown>;

export interface FormboxProps<TSchema extends z.ZodTypeAny = z.ZodTypeAny> {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: ClassValue;
  containerClassName?: ClassValue;
  innerContainerClassName?: ClassValue;
  title?: string | FormTitleConfig;
  description?: string | FormDescriptionConfig;
  fields?: FormField[];
  buttons?: FormButton[];
  message?: FormMessage[];
  schema?: TSchema;
  onSubmit?: (data: z.infer<TSchema>) => void | Promise<void>;
  toast?: boolean | ToastMessages;
  closeFormIcon?: boolean;

  /** Default field styling options for all fields in the form */
  labelClassName?: ClassValue;
  requiredClassName?: ClassValue;
  errorClassName?: ClassValue;
  focusClassName?: ClassValue;
  fieldWrapperClassName?: ClassValue;
  passwordToggleClassName?: ClassValue;
  inputClassName?: ClassValue;
  buttonContainerClassName?: ClassValue;
  /** Validation error message position for fields: "top" (default) or "bottom" */
  errorPosition?: "top" | "bottom";

  /** Custom child elements rendered inside the form body */
  children?: React.ReactNode;
  /** Display mode: "modal" (portal backdrop) or "inline" (embedded component). Defaults to "modal". */
  mode?: "modal" | "inline";
  /** Shorthand for mode="inline". If true, renders inline without modal backdrop or portal. */
  inline?: boolean;
  /** Custom portal target container element for modal mode. Defaults to document.body. */
  container?: HTMLElement | Element | null;

  /** @deprecated Use `onOpenChange` */
  formtoogle?: React.Dispatch<React.SetStateAction<boolean>>;
  /** @deprecated Use `title` */
  formtitle?: { title: string; className?: ClassValue }[];
  /** @deprecated Use `fields` */
  textfield?: FormField[];
  /** @deprecated Use `schema` */
  validationSchema?: z.ZodObject<z.ZodRawShape>;
  /** @deprecated Use `message` with `{ text }` */
  messageLegacy?: { message: string; className?: ClassValue }[];
}

/** Normalized field used internally after legacy prop mapping */
export interface NormalizedField extends FormField {
  maxSelections: number;
  maxSelect: number;
  maxFiles: number;
  searchable: boolean;
  passwordToggle: boolean;
  dependsOn?: string;
  loadOptions?: (
    parentValue: unknown,
  ) => Promise<FieldOption[]> | FieldOption[];
  /** Resolved options (static or loaded from dependsOn) */
  resolvedOptions: FieldOption[];
}

export interface NormalizedFormboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: ClassValue;
  containerClassName?: ClassValue;
  innerContainerClassName?: ClassValue;
  buttonContainerClassName?: ClassValue;
  inputClassName?: ClassValue;
  title?: FormTitleConfig;
  description?: FormDescriptionConfig;
  fields: NormalizedField[];
  buttons: FormButton[];
  messages: FormMessage[];
  schema?: z.ZodTypeAny;
  onSubmit?: (data: unknown) => void | Promise<void>;
  toast?: boolean | ToastMessages;
  closeFormIcon?: boolean;
  labelClassName?: ClassValue;
  requiredClassName?: ClassValue;
  errorClassName?: ClassValue;
  focusClassName?: ClassValue;
  fieldWrapperClassName?: ClassValue;
  passwordToggleClassName?: ClassValue;
  errorPosition?: "top" | "bottom";
  children?: React.ReactNode;
  mode: "modal" | "inline";
  container?: HTMLElement | Element | null;
}
