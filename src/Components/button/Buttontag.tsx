import React from "react";
import "./ButtonTag.css";
import { mergeClasses, ClassValue } from "../../utils/mergeClasses";
import type { ToastMessages } from "../../types/form";

interface LoaderType {
  loader: boolean;
  className?: ClassValue;
}
// Button Component props
interface Props {
  value: any;
  setformdata: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
  initialFormData: { [key: string]: any };
  className?: ClassValue;
  style?: React.CSSProperties;
  action?: (data: any, e: React.MouseEvent) => void | Promise<void>;
  arialabel?: string;
  tooltip?: string;
  disabled?: boolean;
  loader?: LoaderType;
  /** Built-in toast config for this button */
  toast?: ToastMessages;
  /** runWithToast injected from FormToast context via Formbox */
  runWithToast?: <T>(promise: Promise<T>, messages: ToastMessages) => Promise<T>;
}

function Buttontag(props: Props) {
  const {
    action,
    value,
    setformdata,
    initialFormData,
    arialabel,
    tooltip,
    className,
    loader,
    disabled,
    toast: toastMessages,
    runWithToast,
  } = props;

  /** Wraps action with runWithToast if a toast config is provided */
  const handleAction = (data: unknown, e: React.MouseEvent) => {
    if (!action) return;
    if (toastMessages && runWithToast) {
      const result = action(data, e);
      const promise = result instanceof Promise ? result : Promise.resolve();
      runWithToast(promise, toastMessages);
    } else {
      action(data, e);
    }
  };

  // Handle reset function
  const handleResetFn = (e: React.MouseEvent) => {
    e.preventDefault();
    setformdata(initialFormData);
  };

  const isFullWidth = (cls?: ClassValue): boolean => {
    if (!cls) return false;
    if (typeof cls === "string") return cls.includes("w-full");
    if (Array.isArray(cls)) return cls.some((c) => typeof c === "string" && c.includes("w-full"));
    return false;
  };

  // Button Wrapper Function
  const ButtonWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className={mergeClasses("relative group", isFullWidth(className) ? "w-full" : "inline-block")}>
      {children}
      {/* Tooltip */}
      {!loader?.loader && tooltip && (
        <span className="tooltip absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-sm rounded py-1 px-2 opacity-0 whitespace-nowrap group-hover:opacity-100 transition-all duration-300 ease-in-out z-40">
          {tooltip}
        </span>
      )}
    </div>
  );

  const baseBtnStyle = "px-4 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer";

  return (
    <>
      {value.type === "button" && (
        <ButtonWrapper>
          <button
            className={mergeClasses(
              `${baseBtnStyle} bg-[#0878ce] text-white hover:bg-[#2a6898]`,
              className
            )}
            style={value.style || props.style}
            type={value.type}
            onClick={(e) => handleAction(null, e)}
            aria-label={arialabel}
          >
            {value.name}
          </button>
        </ButtonWrapper>
      )}
      {value.type === "reset" && (
        <ButtonWrapper>
          <button
            className={mergeClasses(
              `${baseBtnStyle} bg-gray-200 text-[#3089cd] hover:bg-gray-300`,
              className
            )}
            style={value.style || props.style}
            type={value.type}
            onClick={handleResetFn}
            aria-label={arialabel}
          >
            {value.name}
          </button>
        </ButtonWrapper>
      )}

      {value.type === "submit" && (
        <ButtonWrapper>
          <button
            className={mergeClasses(
              `${baseBtnStyle} bg-[#0878ce] text-white hover:bg-[#2a6898] ${
                disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""
              }`,
              mergeClasses(className, disabled ? (value.disabledClassName || value.disabledClass) : undefined)
            )}
            style={value.style || props.style}
            type={value.type}
            aria-label={arialabel}
            disabled={disabled}
          >
            {loader?.loader ? (
              value.loadingText ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className={mergeClasses(
                      "h-4 w-4 rounded-full animate-spin border-2 border-current border-t-transparent inline-block shrink-0",
                      loader?.className
                    )}
                  />
                  <span>{value.loadingText}</span>
                </span>
              ) : (
                <>
                  <span className="text-sm tracking-wide invisible">
                    {value.name}
                  </span>
                  <span
                    className={mergeClasses(
                      "absolute left-[42%] h-5 w-5 rounded-full animate-spin border-2 border-white border-t-transparent",
                      loader?.className
                    )}
                  ></span>
                </>
              )
            ) : (
              <>{value.name}</>
            )}
          </button>
        </ButtonWrapper>
      )}

      {value.type === "ok" && (
        <ButtonWrapper>
          <button
            className={mergeClasses(
              `${baseBtnStyle} bg-[#0878ce] text-white hover:bg-[#2a6898]`,
              className
            )}
            onClick={(e) => handleAction(true, e)}
            aria-label={arialabel}
          >
            {value.name || "Yes"}
          </button>
        </ButtonWrapper>
      )}

      {value.type === "cancel" && (
        <ButtonWrapper>
          <button
            className={mergeClasses(
              `${baseBtnStyle} bg-gray-200 text-[#3089cd] hover:bg-gray-300`,
              className
            )}
            onClick={(e) => handleAction(false, e)}
            aria-label={arialabel}
          >
            {value.name || "Cancel"}
          </button>
        </ButtonWrapper>
      )}
    </>
  );
}

export default Buttontag;
