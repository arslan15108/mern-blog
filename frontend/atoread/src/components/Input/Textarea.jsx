import React from "react";

const Textarea = React.forwardRef(
  (
    {
      className,
      label,
      error,
      icon,
      name,
      register,
      validation = {},
      rows = 4,
      id,
      ...props
    },
    ref
  ) => {
    const errorMessage = typeof error === "string" ? error : error?.message;
    const textareaId = id || name;

    const registerProps = register ? register(name, validation) : {};

    return (
      <div className="w-full space-y-1.5 group">

        {label && (
          <label
            htmlFor={textareaId}
            className="block text-[10px] font-bold text-white/40 group-focus-within:text-amber-400 transition-all uppercase tracking-widest px-1"
          >
            {label}
          </label>
        )}

        <div className="relative">

          {icon && (
            <span className="absolute left-3 top-3.5 text-white/30 group-focus-within:text-amber-400 transition-colors pointer-events-none">
              {icon}
            </span>
          )}

          <textarea
            id={textareaId}
            rows={rows}
            ref={register ? registerProps.ref : ref}
            {...registerProps}
            className={`
              w-full rounded-xl resize-y
              bg-white/[0.07] border border-white/20
              px-4 py-3 text-sm text-white
              placeholder:text-white/25
              focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40
              transition-all duration-200
              ${icon ? "pl-10" : ""}
              ${errorMessage ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30" : ""}
              ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}
              ${className || ""}
            `}
            {...props}
          />

        </div>

        {errorMessage && (
          <p className="text-red-400 text-[10px] font-semibold uppercase tracking-wide px-1">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;