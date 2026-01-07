// src/components/Input.tsx
import classNames from "classnames";
import { Warning } from "phosphor-react";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ error, label, ...props }, ref) => {
  return (
    <div className="flex flex-col w-full group">
      {label && (
        <label
          className={classNames("text-xs uppercase mb-2 transition-colors duration-200", {
            "text-danger": !!error,
            "text-gray-500 group-focus-within:text-blue-base": !error,
          })}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={classNames("w-full rounded-lg border bg-white p-3 outline-none transition-all duration-200 text-md text-gray-600 placeholder:text-gray-300", {
          "border-danger text-danger focus:border-danger focus:ring-1 focus:ring-danger placeholder:text-danger/50": !!error,
          "border-gray-300 focus:border-blue-base focus:ring-1 focus:ring-blue-base": !error,
        })}
        {...props}
      />
      {error && (
        <div className="flex items-center gap-1 mt-1 text-danger animate-fade-in">
          <Warning size={16} weight="bold" />
          <span className="text-xs">{error}</span>
        </div>
      )}
    </div>
  );
});

export default Input;
