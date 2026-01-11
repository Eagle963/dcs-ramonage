// ===========================================
// Système de permissions par rôle
// ===========================================

import type { UserRole } from '@prisma/client';

// Définition des actions possibles par module
export const PERMISSIONS = {
  // Tableau de bord
  dashboard: {
    view: ['ADMIN', 'MANAGER', 'TECH'],
    viewAll: ['ADMIN', 'MANAGER'],
  },

  // CRM - Clients
  clients: {
    view: ['ADMIN', 'MANAGER', 'TECH'],
    create: ['ADMIN', 'MANAGER'],
    edit: ['ADMIN', 'MANAGER'],
    delete: ['ADMIN'],
    export: ['ADMIN', 'MANAGER'],
    import: ['ADMIN'],
  },

  // Calendrier & Planning
  calendar: {
    view: ['ADMIN', 'MANAGER', 'TECH'],
    viewAll: ['ADMIN', 'MANAGER'],
    create: ['ADMIN', 'MANAGER', 'TECH'],
    edit: ['ADMIN', 'MANAGER', 'TECH'],
    editAll: ['ADMIN', 'MANAGER'],
    delete: ['ADMIN', 'MANAGER'],
  },

  // Interventions
  interventions: {
    view: ['ADMIN', 'MANAGER', 'TECH'],
    viewAll: ['ADMIN', 'MANAGER'],
    create: ['ADMIN', 'MANAGER', 'TECH'],
    edit: ['ADMIN', 'MANAGER', 'TECH'],
    editAll: ['ADMIN', 'MANAGER'],
    delete: ['ADMIN'],
    sign: ['ADMIN', 'MANAGER', 'TECH'],
  },

  // Devis
  quotes: {
    view: ['ADMIN', 'MANAGER', 'TECH'],
    create: ['ADMIN', 'MANAGER'],
    edit: ['ADMIN', 'MANAGER'],
    delete: ['ADMIN'],
    send: ['ADMIN', 'MANAGER'],
    approve: ['ADMIN'],
  },

  // Factures
  invoices: {
    view: ['ADMIN', 'MANAGER'],
    create: ['ADMIN', 'MANAGER'],
    edit: ['ADMIN', 'MANAGER'],
    delete: ['ADMIN'],
    send: ['ADMIN', 'MANAGER'],
    markPaid: ['ADMIN', 'MANAGER'],
  },

  // Avoirs
  credits: {
    view: ['ADMIN', 'MANAGER'],
    create: ['ADMIN', 'MANAGER'],
    edit: ['ADMIN'],
    delete: ['ADMIN'],
  },

  // Paiements
  payments: {
    view: ['ADMIN', 'MANAGER'],
    create: ['ADMIN', 'MANAGER'],
    edit: ['ADMIN'],
    delete: ['ADMIN'],
    export: ['ADMIN', 'MANAGER'],
  },

  // Maintenances / Contrats
  maintenances: {
    view: ['ADMIN', 'MANAGER', 'TECH'],
    create: ['ADMIN', 'MANAGER'],
    edit: ['ADMIN', 'MANAGER'],
    delete: ['ADMIN'],
    plan: ['ADMIN', 'MANAGER'],
  },

  // Équipements
  equipments: {
    view: ['ADMIN', 'MANAGER', 'TECH'],
    create: ['ADMIN', 'MANAGER', 'TECH'],
    edit: ['ADMIN', 'MANAGER', 'TECH'],
    delete: ['ADMIN', 'MANAGER'],
  },

  // Bibliothèque (Articles/Services)
  catalog: {
    view: ['ADMIN', 'MANAGER', 'TECH'],
    create: ['ADMIN', 'MANAGER'],
    edit: ['ADMIN', 'MANAGER'],
    delete: ['ADMIN'],
    import: ['ADMIN'],
  },

  // Stock
  stock: {
    view: ['ADMIN', 'MANAGER', 'TECH'],
    adjust: ['ADMIN', 'MANAGER'],
    manage: ['ADMIN'],
  },

  // Équipe / Utilisateurs
  team: {
    view: ['ADMIN', 'MANAGER'],
    invite: ['ADMIN'],
    edit: ['ADMIN'],
    delete: ['ADMIN'],
    changeRole: ['ADMIN'],
  },

  // Paramètres entreprise
  settings: {
    view: ['ADMIN', 'MANAGER'],
    edit: ['ADMIN'],
    billing: ['ADMIN'],
  },

  // RDV en ligne
  booking: {
    view: ['ADMIN', 'MANAGER'],
    configure: ['ADMIN'],
    manage: ['ADMIN', 'MANAGER'],
  },

  // Demandes (Leads)
  leads: {
    view: ['ADMIN', 'MANAGER', 'TECH'],
    manage: ['ADMIN', 'MANAGER'],
    convert: ['ADMIN', 'MANAGER'],
    delete: ['ADMIN'],
  },

  // Tableaux de bord / Statistiques
  analytics: {
    view: ['ADMIN', 'MANAGER'],
    viewFinancial: ['ADMIN'],
    export: ['ADMIN'],
  },

  // Banque
  bank: {
    view: ['ADMIN'],
    connect: ['ADMIN'],
    reconcile: ['ADMIN'],
  },

  // Dépenses
  expenses: {
    view: ['ADMIN', 'MANAGER'],
    create: ['ADMIN', 'MANAGER'],
    edit: ['ADMIN', 'MANAGER'],
    delete: ['ADMIN'],
    approve: ['ADMIN'],
  },
} as const;

// Types pour les modules et actions
export type PermissionModule = keyof typeof PERMISSIONS;
export type PermissionAction<M extends PermissionModule> = keyof (typeof PERMISSIONS)[M];

/**
 * Vérifie si un rôle a une permission spécifique
 */
export function hasPermission<M extends PermissionModule>(
  role: UserRole,
  module: M,
  action: PermissionAction<M>
): boolean {
  const modulePermissions = PERMISSIONS[module];
  const allowedRoles = modulePermissions[action] as readonly string[];
  return allowedRoles.includes(role);
}

/**
 * Récupère toutes les permissions d'un rôle
 */
export function getRolePermissions(role: UserRole): Record<string, string[]> {
  const permissions: Record<string, string[]> = {};

  for (const [module, actions] of Object.entries(PERMISSIONS)) {
    const allowedActions: string[] = [];

    for (const [action, roles] of Object.entries(actions)) {
      if ((roles as readonly string[]).includes(role)) {
        allowedActions.push(action);
      }
    }

    if (allowedActions.length > 0) {
      permissions[module] = allowedActions;
    }
  }

  return permissions;
}

/**
 * Vérifie si un rôle peut accéder à un module
 */
export function canAccessModule(role: UserRole, module: PermissionModule): boolean {
  const modulePermissions = PERMISSIONS[module];
  return Object.values(modulePermissions).some((roles) =>
    (roles as readonly string[]).includes(role)
  );
}

/**
 * Liste des rôles avec leur description
 */
export const ROLE_LABELS: Record<UserRole, { label: string; description: string }> = {
  ADMIN: {
    label: 'Administrateur',
    description: 'Accès complet à toutes les fonctionnalités',
  },
  MANAGER: {
    label: 'Manager',
    description: 'Gestion des opérations et de l\'équipe',
  },
  TECH: {
    label: 'Technicien',
    description: 'Interventions et rapports terrain',
  },
  CLIENT: {
    label: 'Client',
    description: 'Accès au portail client uniquement',
  },
};

/**
 * Liste des rôles qu'un admin peut attribuer
 */
export const ASSIGNABLE_ROLES: UserRole[] = ['ADMIN', 'MANAGER', 'TECH'];
