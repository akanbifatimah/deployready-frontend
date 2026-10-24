import { useId, useState, type InputHTMLAttributes } from 'react';
import { CircleAlert, Eye, EyeOff, type LucideIcon } from 'lucide-react';

interface FormFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className'> {
  label: string;
  icon: LucideIcon;
  error?: string;
  hint?: string;
}

export function FormField({ label, icon: Icon, error, hint, type = 'text', ...inputProps }: FormFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const [revealed, setRevealed] = useState(false);
  const isPassword = type === 'password';
  const message = error ?? hint;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 dark:text-slate-200">
        {label}
      </label>
      <div className="relative">
        <Icon
          aria-hidden
          className={`pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 ${
            error ? 'text-red-500' : 'text-slate-400'
          }`}
        />
        <input
          id={id}
          type={isPassword && revealed ? 'text' : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          className={`w-full rounded-lg border bg-white py-2.5 pl-10 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-900 dark:text-slate-100 ${
            isPassword ? 'pr-10' : 'pr-3'
          } ${
            error
              ? 'border-red-500 focus:ring-red-500/25'
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/25 dark:border-slate-700'
          }`}
          {...inputProps}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            disabled={inputProps.disabled}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:hover:text-slate-200"
          >
            {revealed ? <EyeOff aria-hidden className="size-4" /> : <Eye aria-hidden className="size-4" />}
          </button>
        )}
      </div>
      {message && (
        <p
          id={messageId}
          className={`flex items-center gap-1.5 text-xs ${
            error ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {error && <CircleAlert aria-hidden className="size-3.5 shrink-0" />}
          {message}
        </p>
      )}
    </div>
  );
}
