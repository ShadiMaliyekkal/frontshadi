// components/ToastProvider.jsx
"use client";

import React, { createContext, useContext, useCallback, useEffect, useState } from "react";

/**
 * Simple toast provider with types: success | error | info
 * - queue of toasts
 * - auto-dismiss after duration
 * - bottom-left position (matches screenshot)
 *
 * Usage:
 * const toast = useToast();
 * toast.success("Registered. Please login.");
 */

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((type, message, opts = {}) => {
    const id = ++idCounter;
    const toast = {
      id,
      type,
      message,
      duration: opts.duration ?? 3500,
      createdAt: Date.now(),
    };
    setToasts((t) => [...t, toast]);
    return id;
  }, []);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  useEffect(() => {
    if (!toasts.length) return;
    const timers = toasts.map((t) =>
      setTimeout(() => remove(t.id), t.duration)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, remove]);

  const value = {
    push,
    success: (msg, opts) => push("success", msg, opts),
    error: (msg, opts) => push("error", msg, opts),
    info: (msg, opts) => push("info", msg, opts),
    remove,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

/* Toast UI */
function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed left-4 bottom-4 z-50 flex flex-col gap-3 max-w-sm">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onClose={() => onRemove(t.id)} />
      ))}
    </div>
  );
}

function Toast({ toast, onClose }) {
  const { type, message } = toast;

  const base =
    "px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm bg-white/90 flex items-start gap-3 border";
  const color =
    type === "success"
      ? "border-green-200"
      : type === "error"
      ? "border-rose-200"
      : "border-sky-200";

  const icon = {
    success: (
      <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="none">
        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-rose-600" viewBox="0 0 24 24" fill="none">
        <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 text-sky-600" viewBox="0 0 24 24" fill="none">
        <path d="M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  }[type || "info"];

  return (
    <div className={`${base} ${color} transition-transform transform hover:scale-[1.01]`}>
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1">
        <div className="text-sm text-neutral-900 font-medium">{message}</div>
      </div>
      <button
        onClick={onClose}
        aria-label="Close"
        className="ml-3 text-neutral-600 hover:text-neutral-800 p-1 rounded focus:outline-none"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
          <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
