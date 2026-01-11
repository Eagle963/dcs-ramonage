'use client';

// ===========================================
// Page d'accès non autorisé
// ===========================================

import Link from 'next/link';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Icône */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <ShieldX className="w-10 h-10 text-red-500" />
        </div>

        {/* Message */}
        <h1 className="text-2xl font-bold text-secondary-900 mb-2">
          Accès non autorisé
        </h1>
        <p className="text-secondary-600 mb-8">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          Contactez votre administrateur si vous pensez qu'il s'agit d'une erreur.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 text-secondary-600 hover:text-secondary-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <Link
            href="/admin"
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Tableau de bord
          </Link>
        </div>
      </div>
    </div>
  );
}
