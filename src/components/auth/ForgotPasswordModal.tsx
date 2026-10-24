import { useState, type FormEvent } from 'react';
import { ArrowLeft, CircleCheck, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useFormValidation } from '../../hooks/useFormValidation';
import { getErrorMessage } from '../../services/mockAuthApi';
import { validateEmail } from '../../utils/validation';
import { FormField } from './FormField';
import { FormAlert, SubmitButton, TextButton } from './FormControls';

interface ForgotPasswordModalProps {
  onBackToLogin: () => void;
}

/** Forgot-password view rendered inside AuthModal. */
export function ForgotPasswordModal({ onBackToLogin }: ForgotPasswordModalProps) {
  const { requestPasswordReset } = useAuth();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const { values, field, submit } = useFormValidation({ email: '' }, (v) => ({
    email: validateEmail(v.email),
  }));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    if (!submit()) return;

    setLoading(true);
    try {
      await requestPasswordReset(values.email);
      setSentTo(values.email.trim());
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const backButton = (
    <button
      type="button"
      onClick={onBackToLogin}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      <ArrowLeft aria-hidden className="size-4" />
      Back to sign in
    </button>
  );

  if (sentTo) {
    return (
      <div className="space-y-5 text-center" role="status">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60">
          <CircleCheck aria-hidden className="size-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="space-y-1.5">
          <p className="text-base font-semibold text-slate-900 dark:text-slate-100">Check your inbox</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            If an account exists for <span className="font-medium text-slate-900 dark:text-slate-100">{sentTo}</span>,
            you&apos;ll receive a password reset link shortly.
          </p>
        </div>
        {backButton}
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Didn&apos;t get it? <TextButton onClick={() => setSentTo(null)}>Try another email</TextButton>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Enter the email you signed up with and we&apos;ll send you a link to reset your password.
      </p>

      <FormAlert message={serverError} />

      <FormField
        {...field('email')}
        label="Email"
        icon={Mail}
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        disabled={loading}
        autoFocus
      />

      <SubmitButton loading={loading} loadingText="Sending link…">
        Send reset link
      </SubmitButton>
      {backButton}
    </form>
  );
}
