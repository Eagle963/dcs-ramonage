'use client';

// ===========================================
// Page d'inscription - Création d'entreprise
// ===========================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';

// Étapes du formulaire
const STEPS = [
  { id: 1, title: 'Entreprise', description: 'Informations de votre entreprise' },
  { id: 2, title: 'Compte', description: 'Vos informations personnelles' },
  { id: 3, title: 'Confirmation', description: 'Vérifiez vos informations' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Données du formulaire
  const [formData, setFormData] = useState({
    // Entreprise
    companyName: '',
    siret: '',
    phone: '',
    // Compte
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Mise à jour des champs
  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrorMessage('');
  };

  // Validation étape 1
  const validateStep1 = () => {
    if (!formData.companyName.trim()) {
      setErrorMessage('Le nom de l\'entreprise est requis');
      return false;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Le numéro de téléphone est requis');
      return false;
    }
    return true;
  };

  // Validation étape 2
  const validateStep2 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage('Prénom et nom sont requis');
      return false;
    }
    if (!formData.email.trim()) {
      setErrorMessage('L\'email est requis');
      return false;
    }
    if (!formData.password || formData.password.length < 8) {
      setErrorMessage('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  // Passer à l'étape suivante
  const nextStep = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  // Revenir à l'étape précédente
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Soumettre le formulaire
  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      // Inscription réussie - rediriger vers login
      router.push('/admin/login?registered=true');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-3xl font-bold text-primary-500">R</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Créer votre compte</h1>
          <p className="text-primary-100 mt-1">Démarrez votre essai gratuit de 14 jours</p>
        </div>

        {/* Indicateur d'étapes */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentStep > step.id
                    ? 'bg-white text-primary-500'
                    : currentStep === step.id
                    ? 'bg-white text-primary-500'
                    : 'bg-primary-400 text-white'
                }`}
              >
                {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-12 h-1 mx-1 rounded ${
                    currentStep > step.id ? 'bg-white' : 'bg-primary-400'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Titre de l'étape */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-secondary-900">
              {STEPS[currentStep - 1].title}
            </h2>
            <p className="text-secondary-500 text-sm">
              {STEPS[currentStep - 1].description}
            </p>
          </div>

          {/* Message d'erreur */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Étape 1: Entreprise */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Nom de l'entreprise *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    placeholder="Mon Entreprise SARL"
                    className="w-full pl-11 pr-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  SIRET (optionnel)
                </label>
                <input
                  type="text"
                  value={formData.siret}
                  onChange={(e) => updateField('siret', e.target.value)}
                  placeholder="123 456 789 00012"
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Téléphone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="06 12 34 56 78"
                    className="w-full pl-11 pr-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Étape 2: Compte */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Prénom *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      placeholder="Jean"
                      className="w-full pl-11 pr-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="Dupont"
                    className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="jean@entreprise.com"
                    className="w-full pl-11 pr-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Mot de passe *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-secondary-500">Minimum 8 caractères</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Confirmation */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="bg-secondary-50 rounded-lg p-4">
                <h3 className="font-medium text-secondary-900 mb-3">Entreprise</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-500">Nom</span>
                    <span className="font-medium">{formData.companyName}</span>
                  </div>
                  {formData.siret && (
                    <div className="flex justify-between">
                      <span className="text-secondary-500">SIRET</span>
                      <span className="font-medium">{formData.siret}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-secondary-500">Téléphone</span>
                    <span className="font-medium">{formData.phone}</span>
                  </div>
                </div>
              </div>

              <div className="bg-secondary-50 rounded-lg p-4">
                <h3 className="font-medium text-secondary-900 mb-3">Administrateur</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-secondary-500">Nom</span>
                    <span className="font-medium">
                      {formData.firstName} {formData.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-500">Email</span>
                    <span className="font-medium">{formData.email}</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Essai gratuit de 14 jours</p>
                    <p className="text-sm text-green-600 mt-1">
                      Aucune carte bancaire requise. Accès complet à toutes les fonctionnalités.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Boutons de navigation */}
          <div className="flex items-center justify-between mt-8">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-4 py-2 text-secondary-600 hover:text-secondary-800"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour
              </button>
            ) : (
              <div />
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
              >
                Continuer
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    Créer mon compte
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Lien vers connexion */}
        <p className="mt-6 text-center text-sm text-primary-100">
          Déjà un compte ?{' '}
          <Link href="/admin/login" className="font-medium text-white hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
