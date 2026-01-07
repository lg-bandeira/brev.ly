import classNames from "classnames";
import type { ButtonHTMLAttributes, ElementType } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ElementType;
  label: string;
}

export const IconButton = ({ icon: Icon, label, ...props }: IconButtonProps) => {
  return (
    <button
      type="button"
      className={classNames(
        "flex items-center justify-center p-2 rounded-md transition-all duration-200 bg-gray-200 text-gray-500 border border-transparent hover:border-blue-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-transparent",
        {
          "px-4 py-2 gap-2": label,
          "p-2": !label,
        }
      )}
      {...props}
    >
      <Icon size={20} weight="bold" />
      {label && <span className="text-sm font-semibold whitespace-nowrap">{label}</span>}
    </button>
  );
};
