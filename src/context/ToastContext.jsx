import { createContext, useContext, useMemo, useRef, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const idRef = useRef(1);
  const [toasts, setToasts] = useState([]);

  const value = useMemo(
    () => ({
      push(message, type = "info") {
        const id = idRef.current++;
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 2600);
      }
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(92vw,360px)] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg border px-3 py-2 text-sm shadow-lg ${
              toast.type === "error"
                ? "border-rose-300 bg-rose-50 text-rose-800"
                : toast.type === "success"
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-vy-border bg-vy-surface text-vy-text"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
}
