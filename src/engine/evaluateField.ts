import type { FormField, ShowWhen, FormData } from "../types/form";

export function isFieldVisible(field: FormField, data: FormData): boolean {
  if (!field.showWhen) return true;

  const { field: depField, equals, notEquals, in: inValues } = field.showWhen;
  const value = data[depField];

  if (equals !== undefined && value !== equals) return false;
  if (notEquals !== undefined && value === notEquals) return false;
  if (inValues !== undefined && !inValues.includes(value)) return false;

  return true;
}

export function getInitialFieldValue(field: FormField): unknown {
  if (field.type === "checkbox") return [];
  if (field.type === "select" || field.type === "multiselect") return [];
  if (field.type === "file") return [];
  if (field.type === "array") return [];
  return "";
}

export function buildInitialFormData(fields: FormField[]): FormData {
  const data: FormData = {};
  for (const field of fields) {
    data[field.name] = getInitialFieldValue(field);
  }
  return data;
}

export function createEmptyArrayRow(nestedFields: FormField[] = []): FormData {
  const row: FormData = {};
  for (const f of nestedFields) {
    row[f.name] = getInitialFieldValue(f);
  }
  return row;
}

export function evaluateShowWhen(rule: ShowWhen, data: FormData): boolean {
  return isFieldVisible({ name: "", showWhen: rule }, data);
}
