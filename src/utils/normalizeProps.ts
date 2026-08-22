import type {
  FormboxProps,
  FormButton,
  FormField,
  FormMessage,
  FormTitleConfig,
  NormalizedField,
  NormalizedFormboxProps,
} from "../types/form";

type LegacyField = FormField & {
  arialabel?: string;
  selectlabel?: string;
  checklimit?: number;
};

type LegacyButton = FormButton & {
  arialabel?: string;
  function?: FormButton["onClick"];
  loader?: { loader?: boolean; className?: FormButton["loader"] extends infer L ? L extends { className?: infer C } ? C : never : never };
};

function normalizeField(field: LegacyField): NormalizedField {
  return {
    ...field,
    ariaLabel: field.ariaLabel ?? field.arialabel,
    selectLabel: field.selectLabel ?? field.selectlabel,
    maxSelections: field.maxSelections ?? field.checklimit ?? 1,
    maxSelect: field.maxSelect ?? 2,
    maxFiles: field.maxFiles !== undefined ? field.maxFiles : 1,
    searchable: field.searchable ?? false,
    passwordToggle: field.passwordToggle ?? false,
    resolvedOptions: field.options ?? [],
  };
}

function normalizeButton(btn: LegacyButton): FormButton {
  return {
    ...btn,
    ariaLabel: btn.ariaLabel ?? btn.arialabel,
    onClick: btn.onClick ?? btn.function,
    loader: btn.loader
      ? {
          loading: btn.loader.loading ?? (btn.loader as { loader?: boolean }).loader,
          className: btn.loader.className,
        }
      : undefined,
  };
}

function normalizeTitle(props: FormboxProps): FormTitleConfig | undefined {
  if (props.title !== undefined) {
    if (typeof props.title === "string") return { text: props.title };
    return props.title;
  }
  if (props.formtitle?.[0]) {
    return {
      text: props.formtitle[0].title,
      className: props.formtitle[0].className,
    };
  }
  return undefined;
}

function normalizeMessages(props: FormboxProps): FormMessage[] {
  const raw = props.message;
  if (!raw?.length) return [];

  const first = raw[0] as FormMessage & { message?: string };
  if ("text" in first && first.text) return raw as FormMessage[];
  if ("message" in first && first.message) {
    return (raw as unknown as { message: string; className?: FormMessage["className"] }[]).map(
      (m) => ({
        text: m.message,
        className: m.className,
      }),
    );
  }
  return [];
}

export function normalizeFormboxProps(props: FormboxProps): NormalizedFormboxProps {
  const rawFields = props.fields ?? props.textfield ?? [];
  const usesOpenProp = props.open !== undefined;

  const onOpenChange = (open: boolean) => {
    if (props.onOpenChange) props.onOpenChange(open);
    else if (props.formtoogle) props.formtoogle(open);
  };

  return {
    open: usesOpenProp ? (props.open as boolean) : true,
    onOpenChange,
    className: props.className,
    title: normalizeTitle(props),
    fields: rawFields.map(normalizeField),
    buttons: (props.buttons ?? []).map(normalizeButton),
    messages: normalizeMessages(props),
    schema: props.schema ?? props.validationSchema,
    onSubmit: props.onSubmit as NormalizedFormboxProps["onSubmit"],
    toast: props.toast,
    closeFormIcon: props.closeFormIcon,
  };
}

export function fieldToLegacyShape(field: NormalizedField): LegacyField & NormalizedField {
  return {
    ...field,
    arialabel: field.ariaLabel,
    selectlabel: field.selectLabel,
    checklimit: field.maxSelections,
  };
}
