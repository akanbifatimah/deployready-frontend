import { useEffect, useId, useRef, useState } from 'react';
import { Rocket, X } from 'lucide-react';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

export type AuthView = 'signin' | 'signup' | 'forgot';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialView?: AuthView;
}

const HEADINGS: Record<AuthView, { title: string; subtitle: string }> = {
  signin: { title: 'Welcome back', subtitle: 'Sign in to continue your deployment checklists.' },
  signup: { title: 'Create your account', subtitle: 'Track deployments across React, Node.js and Python.' },
  forgot: { title: 'Reset your password', subtitle: "We'll help you get back into your account." },
};

export function AuthModal({ open, onClose, initialView = 'signin' }: AuthModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      // Clicks on the dialog element itself (not its content) land on the backdrop.
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="no-scrollbar m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto overscroll-contain bg-transparent p-0 text-left backdrop:animate-fade-in backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm"
    >
      {/* Mounted only while open so each opening starts with fresh form state. */}
      {open && <AuthPanel titleId={titleId} initialView={initialView} onClose={onClose} onSuccess={onClose} />}
    </dialog>
  );
}

interface AuthPanelProps {
  titleId?: string;
  initialView?: AuthView;
  /** Shows a close button when provided (modal usage). */
  onClose?: () => void;
  onSuccess?: () => void;
}

/** Auth card that opens on sign-in, with links to create an account or reset the password; used by AuthModal and the standalone AuthPage. */
export function AuthPanel({ titleId: titleIdProp, initialView = 'signin', onClose, onSuccess }: AuthPanelProps) {
  const [view, setView] = useState<AuthView>(initialView);
  const baseId = useId();
  const titleId = titleIdProp ?? `${baseId}-title`;
  const { title, subtitle } = HEADINGS[view];

  return (
    <div className="animate-scale-in rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-8 dark:border-slate-800 dark:bg-slate-950"
    >
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Rocket aria-hidden className="size-5" />
          </div>
          <div>
            <p id={titleId} className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-m-1 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-2 focus-visible:outline-indigo-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X aria-hidden className="size-5" />
          </button>
        )}
      </div>

      <div>
        {view === 'signin' && (
          <LoginForm
            onSuccess={onSuccess}
            onForgotPassword={() => setView('forgot')}
            onSignUp={() => setView('signup')}
          />
        )}
        {view === 'signup' && <SignUpForm onSuccess={onSuccess} onSignIn={() => setView('signin')} />}
        {view === 'forgot' && <ForgotPasswordModal onBackToLogin={() => setView('signin')} />}
      </div>
    </div>
  );
}
