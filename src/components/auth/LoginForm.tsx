import { useState, type FormEvent } from 'react';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useFormValidation } from '../../hooks/useFormValidation';
import { DEMO_CREDENTIALS, getErrorMessage } from '../../services/mockAuthApi';
import { validateEmail, validateRequired } from '../../utils/validation';
import { FormField } from './FormField';
import { FormAlert, SubmitButton, TextButton } from './FormControls';

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
}

export function LoginForm({ onSuccess, onForgotPassword, onSignUp }: LoginFormProps) {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { values, field, submit } = useFormValidation({ email: '', password: '' }, (v) => ({
    email: validateEmail(v.email),
    password: validateRequired(v.password, 'Password'),
  }));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    if (!submit()) return;

    setLoading(true);
    try {
      await login(values.email, values.password);
      onSuccess?.();
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
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

      <div className="space-y-1.5">
        <FormField
          {...field('password')}
          label="Password"
          icon={Lock}
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          disabled={loading}
        />
        <div className="text-right text-sm">
          <TextButton onClick={onForgotPassword}>Forgot password?</TextButton>
        </div>
      </div>

      <SubmitButton loading={loading} loadingText="Signing in…">
        Sign in
      </SubmitButton>

      <p className="rounded-lg bg-slate-100 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        Demo account: <span className="font-mono">{DEMO_CREDENTIALS.email}</span> /{' '}
        <span className="font-mono">{DEMO_CREDENTIALS.password}</span>
      </p>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Don&apos;t have an account? <TextButton onClick={onSignUp}>Create account</TextButton>
      </p>
    </form>
  );
}
