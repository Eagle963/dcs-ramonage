'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

// Types du formulaire
interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  consent: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  consent: false,
};

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Veuillez entrer votre nom';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Veuillez entrer votre email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    // Téléphone facultatif mais validé si rempli
    if (formData.phone.trim() && !/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Veuillez entrer un sujet';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Veuillez décrire votre demande';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Veuillez donner plus de détails (min. 20 caractères)';
    }

    if (!formData.consent) {
      newErrors.consent = 'Veuillez accepter la politique de confidentialité';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestion des changements
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      setIsSuccess(true);
      setFormData(initialFormData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      setErrors({ submit: message + '. Veuillez réessayer ou nous contacter par téléphone.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Message de succès
  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-success-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-success-600" />
        </div>
        <h3 className="text-xl font-display font-bold text-secondary-900 mb-2">
          Message envoyé !
        </h3>
        <p className="text-secondary-600 mb-6">
          Nous avons bien reçu votre message et vous répondrons rapidement.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="btn-outline btn-md"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Erreur globale */}
      {errors.submit && (
        <div className="p-4 rounded-xl bg-accent-50 border border-accent-200 text-accent-700 text-sm">
          {errors.submit}
        </div>
      )}

      {/* Nom et Email */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="label">
            Nom complet <span className="text-accent-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Jean Dupont"
            className={cn('input', errors.name && 'input-error')}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-accent-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="label">
            Email <span className="text-accent-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="jean@exemple.fr"
            className={cn('input', errors.email && 'input-error')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-accent-600">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Téléphone (facultatif) */}
      <div>
        <label htmlFor="phone" className="label">
          Téléphone <span className="text-secondary-400">(facultatif)</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="06 12 34 56 78"
          className={cn('input', errors.phone && 'input-error')}
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-accent-600">{errors.phone}</p>
        )}
      </div>

      {/* Sujet */}
      <div>
        <label htmlFor="subject" className="label">
          Sujet <span className="text-accent-500">*</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Ex: Demande de devis ramonage"
          className={cn('input', errors.subject && 'input-error')}
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-accent-600">{errors.subject}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="label">
          Votre demande <span className="text-accent-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          placeholder="Décrivez votre demande..."
          className={cn('input resize-none', errors.message && 'input-error')}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-accent-600">{errors.message}</p>
        )}
      </div>

      {/* Consentement */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleChange}
            className="mt-1 w-4 h-4 rounded border-secondary-300 text-primary-500 
                       focus:ring-primary-500 focus:ring-offset-0"
          />
          <span className="text-sm text-secondary-600 group-hover:text-secondary-700">
            J&apos;accepte que mes données soient traitées pour répondre à ma demande. 
            Consultez notre{' '}
            <a href="/politique-confidentialite" className="text-primary-600 hover:underline">
              politique de confidentialité
            </a>
            . <span className="text-accent-500">*</span>
          </span>
        </label>
        {errors.consent && (
          <p className="mt-1 text-sm text-accent-600">{errors.consent}</p>
        )}
      </div>

      {/* Bouton de soumission */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary btn-lg w-full disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Envoyer
          </>
        )}
      </button>
    </form>
  );
}
