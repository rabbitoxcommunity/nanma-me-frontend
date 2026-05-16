import {
  createContext, useCallback, useContext, useEffect, useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiHelpCircle } from "react-icons/fi";
import { Button } from "./ui";

/**
 * Promise-based confirm dialog. Usage:
 *
 *   const confirm = useConfirm();
 *
 *   const ok = await confirm({
 *     title: "Delete this project?",
 *     message: "This also removes its uploaded media. This action cannot be undone.",
 *     confirmLabel: "Delete project",
 *     danger: true,
 *   });
 *   if (!ok) return;
 *   // proceed with delete…
 *
 * Keyboard: Esc cancels, Enter confirms. Click outside cancels.
 */

const ConfirmCtx = createContext(() => Promise.resolve(false));

const DEFAULTS = {
  title: "Are you sure?",
  message: "",
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  danger: false,
};

export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null); // null | { ...opts, resolve }

  const confirm = useCallback((opts = {}) => {
    return new Promise((resolve) => {
      setState({ ...DEFAULTS, ...opts, resolve });
    });
  }, []);

  const close = useCallback(
    (result) => {
      if (state) state.resolve(result);
      setState(null);
    },
    [state]
  );

  // Keyboard shortcuts while dialog is open
  useEffect(() => {
    if (!state) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(false);
      } else if (e.key === "Enter") {
        e.preventDefault();
        close(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [state, close]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = state ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [state]);

  const Icon = state?.danger ? FiAlertTriangle : FiHelpCircle;
  const iconTint = state?.danger
    ? "bg-red-50 text-red-500"
    : "bg-terracotta/10 text-terracotta";

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      <AnimatePresence>
        {state && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => close(false)}
              className="fixed inset-0 bg-graphite/40 backdrop-blur-sm z-[80]"
            />
            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              aria-describedby="confirm-message"
              className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl pointer-events-auto overflow-hidden">
                <div className="px-7 pt-7 pb-2">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-4 ${iconTint}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3
                    id="confirm-title"
                    className="text-base font-semibold tracking-tight text-graphite leading-tight"
                  >
                    {state.title}
                  </h3>
                  {state.message && (
                    <p
                      id="confirm-message"
                      className="text-sm text-smoke mt-1.5 leading-relaxed"
                    >
                      {state.message}
                    </p>
                  )}
                </div>

                <div className="px-7 pb-6 pt-5 flex items-center gap-2 justify-end">
                  <Button variant="ghost" onClick={() => close(false)}>
                    {state.cancelLabel}
                  </Button>
                  <Button
                    variant={state.danger ? "danger" : "primary"}
                    onClick={() => close(true)}
                    autoFocus
                  >
                    {state.confirmLabel}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ConfirmCtx.Provider>
  );
}

export const useConfirm = () => useContext(ConfirmCtx);
