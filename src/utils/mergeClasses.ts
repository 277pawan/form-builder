export type ClassValue =
  | string
  | string[]
  | Record<string, boolean | undefined | null>
  | undefined
  | null
  | boolean;

/**
 * Normalizes any combination of strings, arrays, objects, or falsy values into a flat list of class names.
 */
export function normalizeClasses(...inputs: ClassValue[]): string[] {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string") {
      classes.push(...input.trim().split(/\s+/));
    } else if (Array.isArray(input)) {
      classes.push(...normalizeClasses(...input));
    } else if (typeof input === "object") {
      for (const [key, val] of Object.entries(input)) {
        if (val) {
          classes.push(...key.trim().split(/\s+/));
        }
      }
    }
  }

  return classes.filter(Boolean);
}

/**
 * Utility function to intelligently merge default CSS classes with custom user-provided classes.
 * Ensures user-provided Tailwind classes (e.g. background, rounded, padding, border) override defaults.
 * Supports string, string[], objects, and conditional classes cleanly.
 */
export function mergeClasses(defaultClasses: ClassValue, customClasses?: ClassValue): string {
  const defaultList = normalizeClasses(defaultClasses);
  const customList = normalizeClasses(customClasses);

  if (customList.length === 0) {
    return defaultList.join(" ");
  }

  const getCategory = (cls: string): string | null => {
    // Strip responsive and state prefixes for category matching
    const pure = cls.replace(/^(sm|md|lg|xl|2xl|hover|focus|active|disabled|group-hover):/, "");
    if (/^bg-/.test(pure)) return "bg";
    if (/^rounded(-|$)/.test(pure)) return "rounded";
    if (/^border(-|$)/.test(pure)) return "border";
    if (/^shadow(-|$)/.test(pure)) return "shadow";
    if (/^p[trblx-]?-\d+/.test(pure) || /^p-\d+/.test(pure)) return "padding";
    if (/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)/.test(pure)) return "text-size";
    if (/^text-(black|white|gray|red|blue|green|yellow|indigo|purple|pink|slate|zinc|neutral)/.test(pure)) return "text-color";
    return null;
  };

  const customCategories = new Set(
    customList.map(getCategory).filter((cat): cat is string => cat !== null)
  );

  const filteredDefaults = defaultList.filter((defCls) => {
    const cat = getCategory(defCls);
    return !(cat && customCategories.has(cat));
  });

  return [...filteredDefaults, ...customList].join(" ");
}
