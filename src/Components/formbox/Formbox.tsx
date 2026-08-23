import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Inputtag from "../inputTag/Inputtag";
import Buttontag from "../button/Buttontag";
import { mergeClasses, ClassValue } from "../../utils/mergeClasses";
import {
  normalizeFormboxProps,
  fieldToLegacyShape,
} from "../../utils/normalizeProps";
import { useFormEngine } from "../../engine/useFormEngine";
import { FormToastProvider, useFormToast } from "../Toast/FormToast";
import type { FormboxProps } from "../../types/form";

function FormboxInner(props: FormboxProps) {
  const normalized = normalizeFormboxProps(props);
  const {
    open,
    onOpenChange,
    className,
    title,
    fields,
    buttons,
    messages,
    schema,
    onSubmit,
    toast,
    closeFormIcon,
    children,
    mode,
    container,
  } = normalized;

  const formref = useRef<HTMLDivElement>(null);
  const justOpenedRef = useRef(false);
  const { runWithToast } = useFormToast();

  const submitButton = buttons.find((b) => b.type === "submit");
  const legacySubmit = submitButton?.onClick;

  const engine = useFormEngine({
    fields,
    schema,
    resetOnSuccess: Boolean(onSubmit),
    onSubmit: onSubmit
      ? async (data) => {
          const run = async () => {
            await onSubmit(data);
          };
          if (toast) await runWithToast(run(), toast);
          else await run();
        }
      : legacySubmit
        ? async (data) => {
            legacySubmit(data, {} as React.MouseEvent);
          }
        : undefined,
  });

  // Legacy loader: external loader state on submit button resets form
  const externalLoading = submitButton?.loader?.loading ?? false;
  const prevLoaderRef = useRef(false);
  const resetFormRef = useRef(engine.resetForm);
  resetFormRef.current = engine.resetForm;

  useEffect(() => {
    if (prevLoaderRef.current && !externalLoading) {
      resetFormRef.current();
    }
    prevLoaderRef.current = externalLoading;
  }, [externalLoading]);

  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  useEffect(() => {
    if (!open || mode === "inline") return;

    justOpenedRef.current = true;
    const openGuard = window.setTimeout(() => {
      justOpenedRef.current = false;
    }, 200);

    const handleClickOutside = (e: MouseEvent) => {
      if (justOpenedRef.current) return;
      if (formref.current && !formref.current.contains(e.target as Node)) {
        onOpenChangeRef.current(false);
      }
    };

    const timer = window.setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);

    return () => {
      window.clearTimeout(openGuard);
      window.clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, mode]);

  if (!open) return null;

  const isSubmitting = engine.submitting || externalLoading;

  const cardContent = (
    <div
      ref={formref}
      className={mergeClasses(
        [
          "flex flex-col relative z-10 bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full border border-gray-200",
          mode === "modal" ? "max-h-[90vh] max-w-xl" : "",
        ],
        className,
      )}
    >
      <form
        onSubmit={engine.handleSubmit}
        noValidate
        className="flex flex-col h-full min-h-0"
      >
        {title && (
          <div className="flex-shrink-0 mb-4">
            <div
              className={mergeClasses(
                "text-gray-800 text-3xl font-semibold",
                title.className,
              )}
            >
              {title.text}
            </div>
            {closeFormIcon && (
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-6 text-gray-500 hover:text-gray-700 bg-transparent border-none cursor-pointer p-1 transition-colors"
                aria-label="Close form"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {engine.visibleFields.map((field) => (
            <div
              key={field.name}
              className="flex flex-col justify-start items-start w-full"
            >
              <Inputtag
                textfield={fieldToLegacyShape(field)}
                value={engine.formData[field.name]}
                onChange={engine.setFieldValue}
                className={field.className}
                formErrors={engine.formErrors}
                onAddArrayItem={() =>
                  engine.addArrayItem(field.name, field.fields)
                }
                onRemoveArrayItem={(index) =>
                  engine.removeArrayItem(field.name, index)
                }
                onUpdateArrayItem={(index, subName, val) =>
                  engine.updateArrayItem(field.name, index, subName, val)
                }
              />
            </div>
          ))}

          {children}

          {messages.map((msg, index) => (
            <dd
              key={index}
              className={mergeClasses("text-sm text-gray-600", msg.className)}
            >
              {msg.text}
            </dd>
          ))}
        </div>

        {buttons.length > 0 && (
          <div className="flex-shrink-0 pt-4 mt-2 border-t border-gray-100 flex justify-end gap-3 bg-white">
            {buttons.map((btn, index) => (
              <Buttontag
                key={index}
                value={{
                  ...btn,
                  function: btn.onClick,
                  loader: btn.loader
                    ? {
                        loader:
                          btn.type === "submit"
                            ? isSubmitting
                            : btn.loader.loading,
                        className: btn.loader.className,
                      }
                    : btn.type === "submit" && isSubmitting
                      ? { loader: true }
                      : undefined,
                }}
                setformdata={() => {
                  engine.resetForm();
                }}
                initialFormData={engine.formData}
                className={btn.className}
                action={btn.onClick}
                toast={btn.toast}
                runWithToast={runWithToast}
                tooltip={btn.tooltip}
                arialabel={btn.ariaLabel}
                disabled={
                  btn.disabled || (btn.type === "submit" && isSubmitting)
                }
                loader={
                  btn.type === "submit"
                    ? {
                        loader: isSubmitting,
                        className: btn.loader?.className,
                      }
                    : btn.loader
                      ? {
                          loader: btn.loader.loading ?? false,
                          className: btn.loader.className,
                        }
                      : undefined
                }
              />
            ))}
          </div>
        )}
      </form>
    </div>
  );

  if (mode === "inline") {
    return cardContent;
  }

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {cardContent}
    </div>
  );

  const targetContainer = container || (typeof document !== "undefined" ? document.body : null);

  if (!targetContainer) return modal;

  return createPortal(modal, targetContainer);
}

function Formbox(props: FormboxProps) {
  return (
    <FormToastProvider
      position={props.toast?.position}
      duration={props.toast?.duration}
      dismissible={props.toast?.dismissible}
    >
      <FormboxInner {...props} />
    </FormToastProvider>
  );
}

export default Formbox;
export type { FormboxProps, ClassValue };
