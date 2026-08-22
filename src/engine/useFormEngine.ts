import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import {
  buildInitialFormData,
  createEmptyArrayRow,
  isFieldVisible,
} from "../engine/evaluateField";
import type { FieldOption, FormData, NormalizedField, NormalizedFormboxProps } from "../types/form";

export interface UseFormEngineOptions {
  fields: NormalizedField[];
  schema?: z.ZodTypeAny;
  onSubmit?: (data: unknown) => void | Promise<void>;
  resetOnSuccess?: boolean;
}

export interface UseFormEngineReturn {
  formData: FormData;
  formErrors: Record<string, string>;
  submitting: boolean;
  visibleFields: NormalizedField[];
  setFieldValue: (name: string, value: unknown) => void;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  addArrayItem: (fieldName: string, nestedFields: NormalizedField["fields"]) => void;
  removeArrayItem: (fieldName: string, index: number) => void;
  updateArrayItem: (fieldName: string, index: number, subName: string, value: unknown) => void;
}

function processFieldValues(fields: NormalizedField[], data: FormData): FormData {
  const processed: FormData = { ...data };

  for (const field of fields) {
    const val = processed[field.name];

    if (field.type === "number") {
      if (val === "" || val === null || val === undefined) {
        processed[field.name] = undefined;
      } else if (typeof val === "string") {
        const num = Number(val);
        processed[field.name] = Number.isNaN(num) ? val : num;
      }
    }
  }

  return processed;
}

function validateRequired(fields: NormalizedField[], data: FormData, visibleNames: Set<string>): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    if (!visibleNames.has(field.name) || !field.required) continue;

    const val = data[field.name];
    const isEmpty =
      val === undefined ||
      val === null ||
      val === "" ||
      (Array.isArray(val) && val.length === 0);

    if (isEmpty) {
      errors[field.name] = `${field.label || field.name} is required`;
    }
  }

  return errors;
}

async function resolveFieldOptions(
  fields: NormalizedField[],
  formData: FormData,
): Promise<Record<string, FieldOption[]>> {
  const resolved: Record<string, FieldOption[]> = {};

  await Promise.all(
    fields.map(async (field) => {
      if (field.loadOptions && field.dependsOn) {
        const parentVal = formData[field.dependsOn];
        if (parentVal !== undefined && parentVal !== null && parentVal !== "") {
          const loaded = await field.loadOptions(parentVal);
          resolved[field.name] = loaded;
          return;
        }
        resolved[field.name] = [];
        return;
      }
      resolved[field.name] = field.options ?? [];
    }),
  );

  return resolved;
}

function areOptionsEqual(
  a: Record<string, FieldOption[]>,
  b: Record<string, FieldOption[]>,
): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    const arrA = a[key];
    const arrB = b[key] ?? [];
    if (arrA.length !== arrB.length) return false;
    for (let i = 0; i < arrA.length; i++) {
      if (arrA[i].value !== arrB[i].value || arrA[i].label !== arrB[i].label) {
        return false;
      }
    }
  }
  return true;
}

export function useFormEngine({
  fields,
  schema,
  onSubmit,
  resetOnSuccess = false,
}: UseFormEngineOptions): UseFormEngineReturn {
  const initialData = useMemo(() => buildInitialFormData(fields), [fields]);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, FieldOption[]>>({});

  const fieldsRef = useRef(fields);
  fieldsRef.current = fields;

  useEffect(() => {
    let cancelled = false;

    const hasDynamicFields = fields.some((f) => f.loadOptions && f.dependsOn);
    if (!hasDynamicFields) return;

    resolveFieldOptions(fields, formData).then((opts) => {
      if (!cancelled) {
        setDynamicOptions((prev) => (areOptionsEqual(prev, opts) ? prev : opts));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [fields, formData]);

  const visibleFields = useMemo(() => {
    return fields
      .filter((f) => isFieldVisible(f, formData))
      .map((f) => ({
        ...f,
        resolvedOptions: dynamicOptions[f.name] ?? f.resolvedOptions ?? f.options ?? [],
      }));
  }, [fields, formData, dynamicOptions]);

  const setFieldValue = useCallback((name: string, value: unknown) => {
    setFormData((prev) => {
      const currentVal = prev[name];
      const nextVal =
        typeof value === "function"
          ? (value as (p: unknown) => unknown)(currentVal)
          : value;
      return { ...prev, [name]: nextVal };
    });
    setFormErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setFormErrors({});
  }, [initialData]);

  const addArrayItem = useCallback(
    (fieldName: string, nestedFields: NormalizedField["fields"] = []) => {
      setFormData((prev) => {
        const current = Array.isArray(prev[fieldName]) ? (prev[fieldName] as FormData[]) : [];
        return {
          ...prev,
          [fieldName]: [...current, createEmptyArrayRow(nestedFields ?? [])],
        };
      });
    },
    [],
  );

  const removeArrayItem = useCallback((fieldName: string, index: number) => {
    setFormData((prev) => {
      const current = Array.isArray(prev[fieldName]) ? [...(prev[fieldName] as FormData[])] : [];
      current.splice(index, 1);
      return { ...prev, [fieldName]: current };
    });
  }, []);

  const updateArrayItem = useCallback(
    (fieldName: string, index: number, subName: string, value: unknown) => {
      setFormData((prev) => {
        const current = Array.isArray(prev[fieldName]) ? [...(prev[fieldName] as FormData[])] : [];
        if (!current[index]) return prev;
        current[index] = { ...current[index], [subName]: value };
        return { ...prev, [fieldName]: current };
      });
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const visibleNames = new Set(visibleFields.map((f) => f.name));
      const processed = processFieldValues(fieldsRef.current, formData);
      const errors = validateRequired(fieldsRef.current, processed, visibleNames);

      if (schema) {
        const subset: FormData = {};
        for (const key of Array.from(visibleNames)) {
          subset[key] = processed[key];
        }

        const result = schema.safeParse(subset);
        if (!result.success) {
          result.error.errors.forEach((err) => {
            const fieldName = String(err.path[0]);
            if (fieldName && !(err.message === "Required" && errors[fieldName])) {
              errors[fieldName] = err.message;
            }
          });
        }
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        const first = Object.keys(errors)[0];
        document.getElementById(first)?.focus();
        return;
      }

      setFormErrors({});
      if (!onSubmit) return;

      setSubmitting(true);
      try {
        const subset: FormData = {};
        for (const key of Array.from(visibleNames)) {
          subset[key] = processed[key];
        }
        await onSubmit(subset);
        if (resetOnSuccess) {
          setFormData(initialData);
          setFormErrors({});
        }
      } finally {
        setSubmitting(false);
      }
    },
    [formData, initialData, onSubmit, resetOnSuccess, schema, visibleFields],
  );

  return {
    formData,
    formErrors,
    submitting,
    visibleFields,
    setFieldValue,
    resetForm,
    handleSubmit,
    addArrayItem,
    removeArrayItem,
    updateArrayItem,
  };
}

export type { NormalizedFormboxProps };
