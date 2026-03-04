/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  type: ToastType;
  message: string;
};

type ToastContextValue = {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Record<string, number>>({});

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timersRef.current[id]) {
      window.clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
    Object.values(timersRef.current).forEach((t) => window.clearTimeout(t));
    timersRef.current = {};
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const toast: ToastItem = { id, type, message };

      setToasts((prev) => [...prev, toast]);

      timersRef.current[id] = window.setTimeout(() => {
        removeToast(id);
      }, 2500);
    },
    [removeToast]
  );

  const value = useMemo(
    () => ({ toasts, showToast, removeToast, clearToasts }),
    [toasts, showToast, removeToast, clearToasts]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast UI */}
      <div className="fixed top-4 right-4 z-[9999] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "min-w-[260px] max-w-[360px] rounded-xl px-4 py-3 shadow-lg border",
              "bg-black text-white flex items-start gap-3",
              t.type === "success" ? "border-green-500" : "",
              t.type === "error" ? "border-red-500" : "",
              t.type === "info" ? "border-slate-500" : "",
            ].join(" ")}
          >
            <div className="mt-[2px] text-lg">
              {t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}
            </div>

            <div className="flex-1 text-sm leading-5">{t.message}</div>

            <button
              onClick={() => removeToast(t.id)}
              className="ml-2 rounded-md px-2 py-1 text-xs bg-white/10 hover:bg-white/20"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}