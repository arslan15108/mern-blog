import React from "react";

const Input = React.forwardRef(
  (
    {
      className,
      type = "text",
      label,
      error,
      icon,
      rightElement,
      name,
      register,
      validation = {},
      ...props
    },
    ref
  ) => {
    // error can be a string OR a react-hook-form FieldError object
    const errorMessage = typeof error === "string" ? error : error?.message;

    return (
      <div className="w-full space-y-1.5 relative group">

        {/* Floating Label */}
        {label && (
          <label className="block text-[10px] font-bold text-white/40  group-focus-within:text-amber-400 transition-all uppercase tracking-widest px-1">
            {label}
          </label>
        )}

        <div className="relative flex items-center">

          {/* Left Icon */}
          {icon && (
            <span className="absolute left-3 text-white/30 group-focus-within:text-amber-400 transition-colors z-10 pointer-events-none">
              {icon}
            </span>
          )}

          <input
            type={type}
            ref={ref}
            name={name}
            {...(register ? register(name, validation) : {})}
            className={`
              flex h-12 w-full rounded-xl
              bg-white/5 border border-white/10
              px-4 py-2 text-sm text-white
              placeholder:text-white/25
              focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40
              transition-all duration-200
              ${icon        ? "pl-10"  : ""}
              ${rightElement ? "pr-10" : ""}
              ${errorMessage ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30" : ""}
              ${className || ""}
            `}
            {...props}
          />

          {/* Right Element (e.g. show/hide password button) */}
          {rightElement && (
            <span className="absolute right-3 z-10">
              {rightElement}
            </span>
          )}

        </div>

        {/* Error Message */}
        {errorMessage && (
          <p className="text-red-400 text-[10px] font-semibold uppercase tracking-wide px-1">
            {errorMessage}
          </p>
        )}

      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;