import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ToastMessages, ToastPosition } from "../../types/form";
import { mergeClasses } from "../../utils/mergeClasses";
import type { ClassValue } from "../../utils/mergeClasses";

export type ToastType = "loading" | "success" | "error" | "idle";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  customClassName?: ClassValue;
  duration?: number;
  position?: ToastPosition;
  dismissible?: boolean;
}

export interface ToastState {
  type: ToastType;
  message: string;
  customClassName?: ClassValue;
}

export interface ShowToastOptions {
  duration?: number;
  position?: ToastPosition;
  dismissible?: boolean;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (
    type: ToastType,
    message: string,
    customClassName?: ClassValue,
    options?: ShowToastOptions
  ) => string;
  dismissToast: (id: string) => void;
  clearToast: () => void;
  runWithToast: <T>(
    promise: Promise<T>,
    messages: ToastMessages
  ) => Promise<T>;

  /** Backwards compatibility state for single active toast */
  toast: ToastState;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export interface FormToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  duration?: number;
  dismissible?: boolean;
}

export function FormToastProvider({
  children,
  position: defaultPosition = "bottom-right",
  duration: defaultDuration = 3500,
  dismissible: defaultDismissible = true,
}: FormToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timerMapRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: string) => {
    const timer = timerMapRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timerMapRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToast = useCallback(() => {
    timerMapRef.current.forEach((timer) => clearTimeout(timer));
    timerMapRef.current.clear();
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (
      type: ToastType,
      message: string,
      customClassName?: ClassValue,
      options?: ShowToastOptions
    ): string => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const pos = options?.position || defaultPosition;
      const dur = options?.duration ?? defaultDuration;
      const dis = options?.dismissible ?? defaultDismissible;

      const newItem: ToastItem = {
        id,
        type,
        message,
        customClassName,
        duration: dur,
        position: pos,
        dismissible: dis,
      };

      setToasts((prev) => [...prev, newItem]);

      if (type !== "loading" && dur > 0) {
        const timer = setTimeout(() => {
          dismissToast(id);
        }, dur);
        timerMapRef.current.set(id, timer);
      }

      return id;
    },
    [defaultPosition, defaultDuration, defaultDismissible, dismissToast]
  );

  const runWithToast = useCallback(
    async <T,>(promise: Promise<T>, messages: ToastMessages): Promise<T> => {
      const pos = messages.position || defaultPosition;
      const dur = messages.duration ?? defaultDuration;
      const dis = messages.dismissible ?? defaultDismissible;

      let loadingId: string | null = null;
      if (messages.loading) {
        loadingId = showToast("loading", messages.loading, messages.loadingClassName, {
          position: pos,
          duration: 0,
          dismissible: dis,
        });
      }

      try {
        const result = await promise;
        if (loadingId) dismissToast(loadingId);

        if (messages.success) {
          showToast("success", messages.success, messages.successClassName, {
            position: pos,
            duration: dur,
            dismissible: dis,
          });
        }
        return result;
      } catch (error) {
        if (loadingId) dismissToast(loadingId);

        if (messages.error) {
          showToast("error", messages.error, messages.errorClassName, {
            position: pos,
            duration: dur,
            dismissible: dis,
          });
        }
        throw error;
      }
    },
    [defaultPosition, defaultDuration, defaultDismissible, showToast, dismissToast]
  );

  useEffect(() => {
    return () => {
      timerMapRef.current.forEach((timer) => clearTimeout(timer));
      timerMapRef.current.clear();
    };
  }, []);

  const latestToast = toasts[toasts.length - 1];
  const legacyToast: ToastState = latestToast
    ? { type: latestToast.type, message: latestToast.message, customClassName: latestToast.customClassName }
    : { type: "idle", message: "" };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        dismissToast,
        clearToast,
        runWithToast,
        toast: legacyToast,
      }}
    >
      {children}
      <FormToastViewport toasts={toasts} defaultPosition={defaultPosition} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
}

const ALL_POSITIONS: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

const POSITION_CONTAINER_CLASSES: Record<ToastPosition, string> = {
  "top-left": "fixed top-6 left-6 z-[100] flex flex-col gap-2 pointer-events-none items-start max-w-md w-full sm:w-auto",
  "top-center": "fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none items-center max-w-md w-full sm:w-auto",
  "top-right": "fixed top-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none items-end max-w-md w-full sm:w-auto",
  "bottom-left": "fixed bottom-6 left-6 z-[100] flex flex-col-reverse gap-2 pointer-events-none items-start max-w-md w-full sm:w-auto",
  "bottom-center": "fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col-reverse gap-2 pointer-events-none items-center max-w-md w-full sm:w-auto",
  "bottom-right": "fixed bottom-6 right-6 z-[100] flex flex-col-reverse gap-2 pointer-events-none items-end max-w-md w-full sm:w-auto",
};

interface FormToastViewportProps {
  toasts: ToastItem[];
  defaultPosition: ToastPosition;
  onDismiss: (id: string) => void;
}

function FormToastViewport({ toasts, defaultPosition, onDismiss }: FormToastViewportProps) {
  if (toasts.length === 0) return null;

  const baseStyles: Record<Exclude<ToastType, "idle">, string> = {
    loading: "bg-gray-900 text-white border border-gray-700 shadow-2xl",
    success: "bg-emerald-600 text-white border border-emerald-500 shadow-2xl",
    error: "bg-rose-600 text-white border border-rose-500 shadow-2xl",
  };

  return (
    <>
      <style>{`
        @keyframes formToastSlideTop {
          0% { opacity: 0; transform: translateY(-18px) scale(0.92); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes formToastSlideBottom {
          0% { opacity: 0; transform: translateY(18px) scale(0.92); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      {ALL_POSITIONS.map((pos) => {
        const positionToasts = toasts.filter((t) => (t.position || defaultPosition) === pos);
        if (positionToasts.length === 0) return null;

        const isTop = pos.startsWith("top");

        return (
          <div key={pos} className={POSITION_CONTAINER_CLASSES[pos]} role="region" aria-label="Notifications">
            {positionToasts.map((toast) => {
              if (toast.type === "idle" || !toast.message) return null;

              const animName = isTop ? "formToastSlideTop" : "formToastSlideBottom";

              return (
                <div
                  key={toast.id}
                  role="status"
                  aria-live="polite"
                  style={{ animation: `${animName} 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards` }}
                  className={mergeClasses(
                    mergeClasses(
                      "pointer-events-auto px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 transition-all duration-200 min-w-[240px] max-w-md w-full sm:w-auto",
                      baseStyles[toast.type as Exclude<ToastType, "idle">]
                    ),
                    toast.customClassName
                  )}
                >
                  {/* Icon */}
                  {toast.type === "loading" && (
                    <span className="h-4 w-4 shrink-0 rounded-full animate-spin border-2 border-current border-t-transparent" />
                  )}
                  {toast.type === "success" && (
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {toast.type === "error" && (
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}

                  {/* Message */}
                  <span className="flex-1 break-words">{toast.message}</span>

                  {/* Close / Cross Icon */}
                  {toast.dismissible !== false && (
                    <button
                      type="button"
                      onClick={() => onDismiss(toast.id)}
                      className="ml-2 shrink-0 p-1 text-current opacity-70 hover:opacity-100 hover:bg-black/15 rounded transition-all cursor-pointer flex items-center justify-center leading-none"
                      aria-label="Close toast notification"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
}

export function useFormToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useFormToast must be used within FormToastProvider");
  }
  return ctx;
}
