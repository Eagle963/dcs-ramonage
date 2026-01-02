# Feuille de Route - DCS Ramonage

## Règles de Développement Obligatoires

### 1. Nettoyage du Code
- [ ] **Supprimer tout code inutilisé** : imports, fonctions, variables, composants
- [ ] **Pas de @ts-ignore ou @ts-expect-error** sauf cas exceptionnel documenté
- [ ] **Pas de chargement CDN** si la lib est en dépendance npm
- [ ] **Pas de code dupliqué** : factoriser en composants réutilisables

### 2. Dépendances
- [ ] **Vérifier les peer dependencies** avant d'ajouter une lib
- [ ] **Ajouter les overrides** dans package.json si conflit React 19
- [ ] **Supprimer les dépendances non utilisées** régulièrement

### 3. TypeScript
- [ ] **Typer toutes les props et interfaces**
- [ ] **Pas de `any`** sauf cas exceptionnel
- [ ] **Résoudre toutes les erreurs TS** avant commit

### 4. Performance
- [ ] **Import dynamique** pour les composants lourds (cartes, graphiques)
- [ ] **Lazy loading des images**
- [ ] **Pas de re-renders inutiles** (useMemo, useCallback)

### 5. Structure
- [ ] **Composants réutilisables** dans `/src/components`
- [ ] **Pages dans** `/src/app`
- [ ] **Configs dans** `/src/config`
- [ ] **Types dans** `/src/types`

### 6. Avant chaque Commit/Zip
- [ ] Vérifier que le build passe : `npm run build`
- [ ] Supprimer les console.log
- [ ] Vérifier les imports non utilisés
- [ ] Vérifier la pagination (15 éléments/page)

---

## État d'Avancement

### Site Vitrine (95%) ✅
- [x] Accueil
- [x] Services (6 pages)
- [x] 16 pages villes SEO
- [x] Zones d'intervention (avec cartes Leaflet)
- [x] Formulaire de réservation
- [x] Contact
- [x] CGV, Mentions légales

### Admin SaaS (70%)

#### Structure ✅
- [x] Layout avec sidebar
- [x] Header avec breadcrumb
- [x] Navigation responsive

#### Tableau de bord ✅
- [x] 3 onglets (Activité, Finance, Trésorerie)
- [x] KPIs et graphiques

#### Opérations
- [x] Planning (carte Leaflet dynamique)
- [x] Demandes
- [x] Clients (CRM)

#### Finances ✅
- [x] Devis (style Inter-Fast)
- [x] Factures (style Inter-Fast)
- [x] Avoirs (style Inter-Fast)
- [x] Paiements (style Inter-Fast)
- [x] Dépenses (style Inter-Fast)
- [ ] Banque (à améliorer)

#### Outils
- [x] Mon entreprise (6 onglets)
- [x] Paramètres

### À Faire
- [ ] Connexion base de données (Prisma)
- [ ] Authentification (NextAuth)
- [ ] CRUD complet sur toutes les entités
- [ ] Génération PDF (devis, factures)
- [ ] Envoi emails
- [ ] Dashboard temps réel

---

## Composants Réutilisables

| Composant | Fichier | Usage |
|-----------|---------|-------|
| PlanningMap | `/src/components/map/PlanningMap.tsx` | Carte planning avec marqueurs |
| ZonesMap | `/src/components/map/ZonesMap.tsx` | Cartes zones intervention |

---

## Dépendances Principales

| Package | Version | Usage |
|---------|---------|-------|
| next | 15.x | Framework |
| react | 19.x | UI |
| leaflet | 1.9.x | Cartes |
| react-leaflet | 4.2.x | Cartes React |
| prisma | 6.x | ORM |
| next-auth | 5.x | Auth |
| lucide-react | 0.460.x | Icônes |

---

Dernière mise à jour : 2026-01-01
