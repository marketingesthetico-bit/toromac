import { forwardRef } from 'react';

/**
 * Wrapper unificado de campo: label flotante encima, input/textarea/select y
 * mensaje de error debajo. Todos los campos del proyecto pasan por aqui.
 */
function getInputCls(hasError) {
  return [
    'w-full rounded-md border bg-white px-3.5 py-2.5 text-sm',
    'text-toro-black placeholder:text-toro-gray-mid/70',
    'transition-colors focus:outline-none',
    hasError
      ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-500/20'
      : 'border-toro-black/15 focus:border-toro-blue focus:ring-2 focus:ring-toro-blue/15',
  ].join(' ');
}

function FieldLabel({ id, children, required, optional }) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 mb-1.5 text-sm font-medium text-toro-black">
      <span>{children}</span>
      {required && <span aria-hidden className="text-toro-blue">*</span>}
      {optional && <span aria-hidden className="text-xs font-normal text-toro-gray-mid">(opcional)</span>}
    </label>
  );
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs text-red-600">{message}</p>
  );
}

export const TextField = forwardRef(function TextField(
  { id, label, type = 'text', error, required, optional, hint, ...props },
  ref
) {
  return (
    <div>
      {label && (
        <FieldLabel id={id} required={required} optional={optional}>
          {label}
        </FieldLabel>
      )}
      <input
        id={id}
        ref={ref}
        type={type}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className={getInputCls(!!error)}
        {...props}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-toro-gray-mid">{hint}</p>
      )}
      <FieldError message={error} />
    </div>
  );
});

export const TextareaField = forwardRef(function TextareaField(
  { id, label, error, required, optional, rows = 5, ...props },
  ref
) {
  return (
    <div>
      {label && (
        <FieldLabel id={id} required={required} optional={optional}>
          {label}
        </FieldLabel>
      )}
      <textarea
        id={id}
        ref={ref}
        rows={rows}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`${getInputCls(!!error)} resize-y`}
        {...props}
      />
      <FieldError message={error} />
    </div>
  );
});

export const SelectField = forwardRef(function SelectField(
  { id, label, error, required, optional, children, ...props },
  ref
) {
  return (
    <div>
      {label && (
        <FieldLabel id={id} required={required} optional={optional}>
          {label}
        </FieldLabel>
      )}
      <select
        id={id}
        ref={ref}
        aria-invalid={!!error}
        className={`${getInputCls(!!error)} appearance-none bg-[length:14px_14px] bg-no-repeat bg-[position:right_12px_center] pr-10`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpath d='m6 9 6 6 6-6'/%3e%3c/svg%3e\")",
        }}
        {...props}
      >
        {children}
      </select>
      <FieldError message={error} />
    </div>
  );
});

export const CheckboxField = forwardRef(function CheckboxField(
  { id, label, error, ...props },
  ref
) {
  return (
    <div>
      <label htmlFor={id} className="flex items-start gap-3 cursor-pointer text-sm text-toro-black/85 leading-relaxed">
        <input
          id={id}
          ref={ref}
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-toro-black/30 text-toro-blue focus:ring-2 focus:ring-toro-blue/30"
          {...props}
        />
        <span>{label}</span>
      </label>
      <FieldError message={error} />
    </div>
  );
});

// Honeypot invisible — los bots rellenan este campo, los humanos no.
export const Honeypot = forwardRef(function Honeypot(props, ref) {
  return (
    <div className="absolute left-[-9999px]" aria-hidden tabIndex={-1}>
      <label>
        Website (no rellenar)
        <input ref={ref} type="text" autoComplete="off" tabIndex={-1} {...props} />
      </label>
    </div>
  );
});
