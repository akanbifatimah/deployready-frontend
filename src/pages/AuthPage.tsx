import { useNavigate } from 'react-router-dom';
import { AuthPanel } from '../components/auth/AuthModal';
import { useSeo } from '../hooks/useSeo';

export function AuthPage() {
  const navigate = useNavigate();
  useSeo({ title: 'Sign in', description: 'Sign in to DeployReady to track your deployment checklists.', noIndex: true });

  return (
    <main className="flex items-center justify-center px-4 py-16 sm:py-24">
      <div className="w-full max-w-md animate-fade-in-up">
        <AuthPanel onSuccess={() => navigate('/')} />
      </div>
    </main>
  );
}
