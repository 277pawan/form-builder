import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ToastMessages } from "../../types/form";

export type ToastType = "loading" | "success" | "error" | "idle";

export interface ToastState {
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: ToastState;
  showToast: (type: ToastType, message: string) => void;
  clearToast: () => void;
  runWithToast: <T>(
    promise: Promise<T>,
    messages: ToastMessages,
  ) => Promise<T>;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function FormToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({ type: "idle", message: "" });
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const clearToast = useCallback(() => {
    setToast({ type: "idle", message: "" });
  }, []);

  const showToast = useCallback((type: ToastType, message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ type, message });
    if (type === "success" || type === "error") {
      timerRef.current = setTimeout(clearToast, 3500);
    }
  }, [clearToast]);

  const runWithToast = useCallback(
    async <T,>(promise: Promise<T>, messages: ToastMessages): Promise<T> => {
      if (messages.loading) showToast("loading", messages.loading);
      try {
        const result = await promise;
        if (messages.success) showToast("success", messages.success);
        else clearToast();
        return result;
      } catch {
        if (messages.error) showToast("error", messages.error);
        else clearToast();
        throw new Error(messages.error ?? "Submission failed");
      }
    },
    [showToast, clearToast],
  );

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, showToast, clearToast, runWithToast }}>
      {children}
      <FormToastViewport toast={toast} />
    </ToastContext.Provider>
  );
}

function FormToastViewport({ toast }: { toast: ToastState }) {
  if (toast.type === "idle" || !toast.message) return null;

  const styles: Record<Exclude<ToastType, "idle">, string> = {
    loading: "bg-gray-800 text-white",
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-[100] px-4 py-3 rounded-lg shadow-xl text-sm font-medium flex items-center gap-2 ${styles[toast.type as Exclude<ToastType, "idle">]}`}
    >
      {toast.type === "loading" && (
        <span className="h-4 w-4 rounded-full animate-spin border-2 border-white border-t-transparent" />
      )}
      {toast.message}
    </div>
  );
}

export function useFormToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useFormToast must be used within FormToastProvider");
  }
  return ctx;
}
