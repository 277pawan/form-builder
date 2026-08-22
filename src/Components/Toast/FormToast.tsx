import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { createRoot } from "react-dom/client";
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

type Listener = () => void;
let globalToasts: ToastItem[] = [];
const listeners = new Set<Listener>();
const globalTimerMap = new Map<string, ReturnType<typeof setTimeout>>();

let toastRoot: ReturnType<typeof createRoot> | null = null;

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

function ensureToastRoot() {
  if (typeof document === "undefined") return;
  let container = document.getElementById("react-form-toaster-root");
  if (!container) {
    container = document.createElement("div");
    container.id = "react-form-toaster-root";
    document.body.appendChild(container);
  }
  if (!toastRoot) {
    toastRoot = createRoot(container);
  }
  toastRoot.render(<GlobalToastViewportContainer />);
}

export const globalToastManager = {
  getToasts: () => globalToasts,
  subscribe: (fn: Listener) => {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  show: (
    type: ToastType,
    message: string,
    customClassName?: ClassValue,
    options?: ShowToastOptions,
    defaultPos: ToastPosition = "bottom-right",
    defaultDur = 3500,
    defaultDis = true
  ): string => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const pos = options?.position || defaultPos;
    const dur = options?.duration ?? defaultDur;
    const dis = options?.dismissible ?? defaultDis;

    const newItem: ToastItem = {
      id,
      type,
      message,
      customClassName,
      duration: dur,
      position: pos,
      dismissible: dis,
    };

    globalToasts = [...globalToasts, newItem];
    notifyListeners();
    ensureToastRoot();

    if (type !== "loading" && dur > 0) {
      const timer = setTimeout(() => {
        globalToastManager.dismiss(id);
      }, dur);
      globalTimerMap.set(id, timer);
    }

    return id;
  },
  dismiss: (id: string) => {
    const timer = globalTimerMap.get(id);
    if (timer) {
      clearTimeout(timer);
      globalTimerMap.delete(id);
    }
    globalToasts = globalToasts.filter((t) => t.id !== id);
    notifyListeners();
    ensureToastRoot();
  },
  clear: () => {
    globalTimerMap.forEach((timer) => clearTimeout(timer));
    globalTimerMap.clear();
    globalToasts = [];
    notifyListeners();
    ensureToastRoot();
  },
};

function GlobalToastViewportContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>(globalToastManager.getToasts());

  useEffect(() => {
    const unsubscribe = globalToastManager.subscribe(() => {
      setToasts([...globalToastManager.getToasts()]);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  if (toasts.length === 0) return null;

  return <FormToastViewportUI toasts={toasts} onDismiss={(id) => globalToastManager.dismiss(id)} />;
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
  const [toasts, setToasts] = useState<ToastItem[]>(globalToastManager.getToasts());

  useEffect(() => {
    const unsubscribe = globalToastManager.subscribe(() => {
      setToasts([...globalToastManager.getToasts()]);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const dismissToast = useCallback((id: string) => {
    globalToastManager.dismiss(id);
  }, []);

  const clearToast = useCallback(() => {
    globalToastManager.clear();
  }, []);

  const showToast = useCallback(
    (
      type: ToastType,
      message: string,
      customClassName?: ClassValue,
      options?: ShowToastOptions
    ): string => {
      return globalToastManager.show(
        type,
        message,
        customClassName,
        options,
        defaultPosition,
        defaultDuration,
        defaultDismissible
      );
    },
    [defaultPosition, defaultDuration, defaultDismissible]
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
  "top-left": "fixed top-6 left-6 z-[9999] flex flex-col gap-2 pointer-events-none items-start max-w-md w-full sm:w-auto",
  "top-center": "fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none items-center max-w-md w-full sm:w-auto",
  "top-right": "fixed top-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none items-end max-w-md w-full sm:w-auto",
  "bottom-left": "fixed bottom-6 left-6 z-[9999] flex flex-col-reverse gap-2 pointer-events-none items-start max-w-md w-full sm:w-auto",
  "bottom-center": "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col-reverse gap-2 pointer-events-none items-center max-w-md w-full sm:w-auto",
  "bottom-right": "fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-2 pointer-events-none items-end max-w-md w-full sm:w-auto",
};

interface FormToastViewportUIProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

function FormToastViewportUI({ toasts, onDismiss }: FormToastViewportUIProps) {
  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes formToastSlideTop {
          0% { opacity: 0; transform: translateY(-12px) scale(0.94); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes formToastSlideBottom {
          0% { opacity: 0; transform: translateY(12px) scale(0.94); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      {ALL_POSITIONS.map((pos) => {
        const positionToasts = toasts.filter((t) => (t.position || "bottom-right") === pos);
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
                  style={{ animation: `${animName} 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards` }}
                  className={mergeClasses(
                    mergeClasses(
                      "pointer-events-auto px-4 py-3 rounded-xl shadow-[0_10px_38px_-10px_rgba(22,23,24,0.35),0_10px_20px_-15px_rgba(22,23,24,0.2)] border text-sm font-medium flex items-center gap-3 transition-all duration-200 min-w-[260px] max-w-md bg-white text-gray-900 border-gray-200/80 dark:bg-gray-900 dark:text-white dark:border-gray-800",
                      toast.customClassName
                    ),
                    toast.customClassName
                  )}
                >
                  {/* react-hot-toast style circular badge icons */}
                  {toast.type === "loading" && (
                    <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <span className="h-3.5 w-3.5 rounded-full animate-spin border-2 border-current border-t-transparent" />
                    </div>
                  )}

                  {toast.type === "success" && (
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  {toast.type === "error" && (
                    <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}

                  {/* Message */}
                  <span className="flex-1 break-words text-gray-800 dark:text-gray-100 font-medium text-sm">
                    {toast.message}
                  </span>

                  {/* Close / Cross Icon */}
                  {toast.dismissible !== false && (
                    <button
                      type="button"
                      onClick={() => onDismiss(toast.id)}
                      className="ml-1 shrink-0 p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors cursor-pointer flex items-center justify-center leading-none"
                      aria-label="Close toast notification"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
