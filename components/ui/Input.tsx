"use client";

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface FieldWrapperProps {
  label: string;
  error?: string;
  hint?: string;
  id: string;
}

const fieldBase =
  "w-full rounded-2xl bg-ink-soft border px-4 py-3 text-[15px] text-paper placeholder:text-paper-faint " +
  "transition-colors duration-150 outline-none focus:border-gold";

function FieldChrome({
  label,
  error,
  hint,
  id,
  children,
}: FieldWrapperProps & { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-black">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-ember" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-paper-faint">{hint}</p>
      ) : null}
    </div>
  );
}

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "id">, FieldWrapperProps {}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, id, className, ...props },
  ref
) {
  return (
    <FieldChrome label={label} error={error} hint={hint} id={id}>
      <input
        ref={ref}
        id={id}
        className={clsx(fieldBase, error ? "border-ember" : "border-ink-line", className)}
        aria-invalid={Boolean(error)}
        {...props}
      />
    </FieldChrome>
  );
});

interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id">,
    FieldWrapperProps {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, hint, id, className, ...props },
  ref
) {
  return (
    <FieldChrome label={label} error={error} hint={hint} id={id}>
      <textarea
        ref={ref}
        id={id}
        className={clsx(fieldBase, "resize-none", error ? "border-ember" : "border-ink-line", className)}
        aria-invalid={Boolean(error)}
        {...props}
      />
    </FieldChrome>
  );
});
