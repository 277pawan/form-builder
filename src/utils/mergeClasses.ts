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

const TEXT_SIZE_TOKENS = new Set([
  "xs",
  "sm",
  "base",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "9xl",
]);

const stripVariantPrefix = (cls: string): string =>
  cls.replace(/^(sm|md|lg|xl|2xl|hover|focus|active|disabled|group-hover):/, "");

/**
 * Maps a Tailwind class to a utility category so custom classes can replace defaults.
 */
const getCategory = (cls: string): string | null => {
  const pure = stripVariantPrefix(cls);

  if (/^bg-/.test(pure)) return "bg";
  if (/^rounded(-|$)/.test(pure)) return "rounded";
  if (/^border(-|$)/.test(pure)) return "border";
  if (/^shadow(-|$)/.test(pure)) return "shadow";
  if (/^(p[trblxy]?|px|py)-/.test(pure) || /^p-\d+/.test(pure)) return "padding";
  if (/^(m[trblxy]?|mx|my)-/.test(pure) || /^m-\d+/.test(pure)) return "margin";
  if (/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)/.test(pure))
    return "font-weight";
  if (/^text-(left|center|right|justify|start|end)$/.test(pure)) return "text-align";

  const bracketSize = pure.match(/^text-\[(.+)\]$/);
  if (bracketSize) return "text-size";

  const namedSize = pure.match(/^text-([\w]+)$/);
  if (namedSize && TEXT_SIZE_TOKENS.has(namedSize[1])) return "text-size";

  if (/^text-[a-z]+-\d+$/.test(pure)) return "text-color";
  if (/^text-(black|white|transparent|current)$/.test(pure)) return "text-color";

  return null;
};

/**
 * Merges library default Tailwind classes with user-provided classes.
 * When both sides define the same utility category (e.g. background, text color, font weight),
 * the user's class wins and the default for that category is removed.
 */
export function mergeClasses(defaultClasses: ClassValue, customClasses?: ClassValue): string {
  const defaultList = normalizeClasses(defaultClasses);
  const customList = normalizeClasses(customClasses);

  if (customList.length === 0) {
    return defaultList.join(" ");
  }

  const customCategories = new Set(
    customList.map(getCategory).filter((cat): cat is string => cat !== null),
  );

  const filteredDefaults = defaultList.filter((defCls) => {
    const cat = getCategory(defCls);
    return !(cat && customCategories.has(cat));
  });

  return [...filteredDefaults, ...customList].join(" ");
}
