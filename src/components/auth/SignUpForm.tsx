import { useState, type FormEvent } from 'react';
import { Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useFormValidation } from '../../hooks/useFormValidation';
import { getErrorMessage } from '../../services/mockAuthApi';
import {
  MIN_PASSWORD_LENGTH,
  validateEmail,
  validateNewPassword,
  validatePasswordMatch,
  validateRequired,
} from '../../utils/validation';
import { FormField } from './FormField';
import { FormAlert, SubmitButton, TextButton } from './FormControls';

interface SignUpFormProps {
  onSuccess?: () => void;
  onSignIn: () => void;
}

export function SignUpForm({ onSuccess, onSignIn }: SignUpFormProps) {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { values, field, submit } = useFormValidation(
    { name: '', email: '', password: '', confirmPassword: '' },
    (v) => ({
      name: validateRequired(v.name, 'Name'),
      email: validateEmail(v.email),
      password: validateNewPassword(v.password),
      confirmPassword: validatePasswordMatch(v.password, v.confirmPassword),
    }),
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);
    if (!submit()) return;

    setLoading(true);
    try {
      await signUp(values.name, values.email, values.password);
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
        {...field('name')}
        label="Full name"
        icon={User}
        autoComplete="name"
        placeholder="Ada Lovelace"
        disabled={loading}
        autoFocus
      />
      <FormField
        {...field('email')}
        label="Email"
        icon={Mail}
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        disabled={loading}
      />
      <FormField
        {...field('password')}
        label="Password"
        icon={Lock}
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        hint={`At least ${MIN_PASSWORD_LENGTH} characters.`}
        disabled={loading}
      />
      <FormField
        {...field('confirmPassword')}
        label="Confirm password"
        icon={Lock}
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        disabled={loading}
      />

      <SubmitButton loading={loading} loadingText="Creating account…">
        Create account
      </SubmitButton>

      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        Already have an account? <TextButton onClick={onSignIn}>Sign in</TextButton>
      </p>
    </form>
  );
}
