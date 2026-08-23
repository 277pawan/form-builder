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

const VARIANT_REGEX = /^(sm|md|lg|xl|2xl|hover|focus|active|disabled|group-hover|placeholder):/;

const getVariantAndPure = (cls: string): { variant: string; pure: string } => {
  const match = cls.match(VARIANT_REGEX);
  if (match) {
    return {
      variant: match[1],
      pure: cls.slice(match[0].length),
    };
  }
  return { variant: "", pure: cls };
};

/**
 * Maps a Tailwind class to a utility category key, including variant namespace.
 */
const getCategoryKey = (cls: string): string | null => {
  const { variant, pure } = getVariantAndPure(cls);

  let category: string | null = null;

  if (/^bg-/.test(pure)) category = "bg";
  else if (/^rounded(-|$)/.test(pure)) category = "rounded";
  else if (/^border(-|$)/.test(pure)) category = "border";
  else if (/^ring-offset(-|$)/.test(pure)) category = "ring-offset";
  else if (/^ring-/.test(pure)) {
    category = /^ring-(black|white|transparent|current|[\w-]+#?)/.test(pure) ? "ring-color" : "ring";
  }
  else if (/^shadow(-|$)/.test(pure)) category = "shadow";
  else if (/^(p[trblxy]?|px|py)-/.test(pure) || /^p-\d+/.test(pure)) category = "padding";
  else if (/^(m[trblxy]?|mx|my)-/.test(pure) || /^m-\d+/.test(pure)) category = "margin";
  else if (/^font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)/.test(pure))
    category = "font-weight";
  else if (/^text-(left|center|right|justify|start|end)$/.test(pure)) category = "text-align";
  else if (/^space-y-/.test(pure)) category = "space-y";
  else if (/^space-x-/.test(pure)) category = "space-x";
  else {
    const bracketVal = pure.match(/^text-\[(.+)\]$/);
    if (bracketVal) {
      const inner = bracketVal[1];
      if (/#|rgb|hsl/.test(inner)) {
        category = "text-color";
      } else {
        category = "text-size";
      }
    } else {
      const namedSize = pure.match(/^text-([\w]+)$/);
      if (namedSize && TEXT_SIZE_TOKENS.has(namedSize[1])) {
        category = "text-size";
      } else if (/^text-(black|white|transparent|current|[\w-]+)/.test(pure)) {
        category = "text-color";
      }
    }
  }

  if (!category) return null;
  return variant ? `${variant}:${category}` : category;
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
    customList.map(getCategoryKey).filter((cat): cat is string => cat !== null),
  );

  const filteredDefaults = defaultList.filter((defCls) => {
    const catKey = getCategoryKey(defCls);
    return !(catKey && customCategories.has(catKey));
  });

  return [...filteredDefaults, ...customList].join(" ");
}
