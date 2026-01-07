import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button = ({ isLoading, children, ...props }: ButtonProps) => {
  return (
    <button
      disabled={isLoading || props.disabled}
      className="flex items-center justify-center w-full md:w-full px-6 py-3 rounded-lg cursor-pointer font-sans text-md font-semibold text-white bg-blue-base transition-colors duration-200 hover:bg-blue-dark disabled:bg-blue-base/50disabled:cursor-not-alloweddisabled:hover:bg-blue-base/50"
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default Button;
