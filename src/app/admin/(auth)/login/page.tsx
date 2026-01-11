'use client';

// ===========================================
// Page de connexion - Admin
// ===========================================

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2, LogIn, Mail, Lock } from 'lucide-react';

// Composant interne qui utilise useSearchParams
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';
  const error = searchParams.get('error');
  const registered = searchParams.get('registered');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(error || '');
  const [successMessage, setSuccessMessage] = useState('');

  // Afficher message de succès après inscription
  useEffect(() => {
    if (registered === 'true') {
      setSuccessMessage('Compte créé avec succès ! Connectez-vous.');
    }
  }, [registered]);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErrorMessage(result.error);
        setIsLoading(false);
        return;
      }

      // Connexion réussie - rediriger
      router.push(callbackUrl);
      router.refresh();
    } catch {
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Message de succès */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {successMessage}
        </div>
      )}

      {/* Message d'erreur */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
            Adresse email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              disabled={isLoading}
              className="w-full pl-11 pr-4 py-3 border border-secondary-200 rounded-lg text-secondary-900 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-secondary-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Mot de passe */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-secondary-700">
              Mot de passe
            </label>
            <Link
              href="/admin/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Mot de passe oublié ?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="w-full pl-11 pr-12 py-3 border border-secondary-200 rounded-lg text-secondary-900 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-secondary-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Bouton de connexion */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Connexion en cours...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Se connecter
            </>
          )}
        </button>
      </form>

      {/* Lien vers inscription */}
      <p className="mt-6 text-center text-sm text-secondary-600">
        Pas encore de compte ?{' '}
        <Link
          href="/admin/register"
          className="font-medium text-primary-600 hover:text-primary-700"
        >
          Créer mon entreprise
        </Link>
      </p>
    </div>
  );
}

// Composant de fallback pour le chargement
function LoginFormSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
      <div className="space-y-5">
        <div>
          <div className="h-4 bg-secondary-200 rounded w-24 mb-2" />
          <div className="h-12 bg-secondary-100 rounded-lg" />
        </div>
        <div>
          <div className="h-4 bg-secondary-200 rounded w-24 mb-2" />
          <div className="h-12 bg-secondary-100 rounded-lg" />
        </div>
        <div className="h-12 bg-primary-200 rounded-lg" />
      </div>
    </div>
  );
}

// Page principale avec Suspense
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-3xl font-bold text-primary-500">R</span>
          </div>
          <h1 className="text-2xl font-bold text-white">RamonPro</h1>
          <p className="text-primary-100 mt-1">Connectez-vous à votre espace</p>
        </div>

        {/* Formulaire avec Suspense */}
        <Suspense fallback={<LoginFormSkeleton />}>
          <LoginForm />
        </Suspense>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-primary-100">
          © {new Date().getFullYear()} RamonPro - Tous droits réservés
        </p>
      </div>
    </div>
  );
}
