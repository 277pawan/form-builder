import type { FormField, ShowWhen, FormData } from "../types/form";

/**
 * Check whether a field should currently be visible.
 */
export function isFieldVisible(field: FormField, data: FormData): boolean {
  if (!field.showWhen) return true;

  const { field: depField, equals, notEquals, in: inValues } = field.showWhen;

  const value = data[depField];

  if (equals !== undefined && value !== equals) {
    return false;
  }

  if (notEquals !== undefined && value === notEquals) {
    return false;
  }

  if (inValues !== undefined && !inValues.includes(value)) {
    return false;
  }

  return true;
}

export function getInitialFieldValue(field: FormField): unknown {
  /**
   * -------------------------------------------------------
   * DEFAULT VALUE
   * -------------------------------------------------------
   *
   * Always check the default BEFORE checking the field type.
   */
  if (field.default?.value !== undefined) {
    const defaultValue = field.default.value;

    /**
     * MULTISELECT
     *
     * Multiselect must always have an array as its value.
     */
    if (field.type === "multiselect") {
      if (Array.isArray(defaultValue)) {
        return defaultValue;
      }

      return [defaultValue];
    }

    /**
     * CHECKBOX
     *
     * Checkbox groups also use an array.
     */
    if (field.type === "checkbox") {
      if (Array.isArray(defaultValue)) {
        return defaultValue;
      }

      return [defaultValue];
    }

    /**
     * SELECT / RADIO
     *
     * These normally have a single value.
     *
     * If someone accidentally provides an array,
     * use the first value.
     */
    if (field.type === "select" || field.type === "radio") {
      if (Array.isArray(defaultValue)) {
        return defaultValue[0] ?? "";
      }

      return defaultValue;
    }

    /**
     * All other field types.
     */
    return defaultValue;
  }

  /**
   * -------------------------------------------------------
   * NO DEFAULT VALUE
   * -------------------------------------------------------
   */
  if (field.type === "checkbox") {
    return [];
  }

  if (field.type === "select") {
    return "";
  }

  if (field.type === "multiselect") {
    return [];
  }

  if (field.type === "file") {
    return [];
  }

  if (field.type === "array") {
    return [];
  }

  return "";
}

/**
 * Build the complete initial form state.
 */
export function buildInitialFormData(fields: FormField[]): FormData {
  const data: FormData = {};

  for (const field of fields) {
    data[field.name] = getInitialFieldValue(field);
  }

  return data;
}

/**
 * Create an empty row for an array field.
 *
 * Defaults are also respected here, which means
 * nested fields can have their own defaults.
 */
export function createEmptyArrayRow(nestedFields: FormField[] = []): FormData {
  const row: FormData = {};

  for (const field of nestedFields) {
    row[field.name] = getInitialFieldValue(field);
  }

  return row;
}

/**
 * Evaluate a showWhen rule.
 */
export function evaluateShowWhen(rule: ShowWhen, data: FormData): boolean {
  return isFieldVisible(
    {
      name: "",
      showWhen: rule,
    },
    data,
  );
}
