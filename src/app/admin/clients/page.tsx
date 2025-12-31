'use client';

import { Users, Construction } from 'lucide-react';

export default function ClientsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">Clients</h1>
        <p className="text-secondary-500">Gérez votre base clients</p>
      </div>

      <div className="bg-white rounded-xl border border-secondary-100 p-12 text-center">
        <Construction className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-secondary-900 mb-2">
          En cours de développement
        </h2>
        <p className="text-secondary-500 max-w-md mx-auto">
          La gestion des clients sera bientôt disponible. 
          Vous pourrez gérer vos contacts, historique d'interventions et équipements.
        </p>
      </div>
    </div>
  );
}
