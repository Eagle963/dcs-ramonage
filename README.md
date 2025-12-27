# DCS Ramonage - Site Vitrine & Plateforme RamonPro

Site web professionnel et plateforme de gestion pour DCS Ramonage, artisan ramoneur dans l'Oise et le Val-d'Oise.

## 🚀 Stack Technique

- **Framework**: Next.js 15 (App Router)
- **Langage**: TypeScript
- **Styling**: Tailwind CSS
- **Base de données**: PostgreSQL (Neon)
- **ORM**: Prisma 6
- **Authentification**: NextAuth.js v5
- **Emails**: Resend
- **Déploiement**: Vercel

## 📁 Structure du Projet

```
dcs-ramonage/
├── prisma/
│   └── schema.prisma       # Schéma de base de données
├── public/
│   ├── images/             # Images statiques
│   └── icons/              # Icônes et favicons
├── src/
│   ├── app/                # App Router Next.js
│   │   ├── (site)/         # Pages publiques du site
│   │   ├── api/            # Routes API
│   │   ├── contact/        # Page contact
│   │   ├── layout.tsx      # Layout racine
│   │   └── page.tsx        # Page d'accueil
│   ├── components/
│   │   ├── forms/          # Composants de formulaires
│   │   ├── layout/         # Header, Footer, etc.
│   │   ├── sections/       # Sections de pages
│   │   └── ui/             # Composants UI réutilisables
│   ├── config/
│   │   └── site.ts         # Configuration du site
│   ├── lib/
│   │   └── utils.ts        # Utilitaires
│   ├── styles/
│   │   └── globals.css     # Styles globaux
│   └── types/              # Types TypeScript
├── .env.example            # Variables d'environnement
├── next.config.ts          # Configuration Next.js
├── tailwind.config.ts      # Configuration Tailwind
├── tsconfig.json           # Configuration TypeScript
└── package.json
```

## 🛠️ Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- PostgreSQL (ou compte Neon)

### Étapes

1. **Cloner le repository**
```bash
git clone https://github.com/votre-repo/dcs-ramonage.git
cd dcs-ramonage
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env.local
# Éditer .env.local avec vos valeurs
```

4. **Initialiser la base de données**
```bash
npx prisma generate
npx prisma db push
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

Le site est accessible sur [http://localhost:3000](http://localhost:3000)

## 📝 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement |
| `npm run build` | Build de production |
| `npm run start` | Lance le serveur de production |
| `npm run lint` | Vérification ESLint |
| `npm run db:generate` | Génère le client Prisma |
| `npm run db:push` | Pousse le schéma vers la DB |
| `npm run db:migrate` | Crée une migration |
| `npm run db:studio` | Ouvre Prisma Studio |

## 🎨 Design System

### Couleurs

| Nom | Hex | Usage |
|-----|-----|-------|
| Primary (Orange) | `#f97316` | CTA, accents principaux |
| Secondary (Charbon) | `#0f172a` | Texte, backgrounds |
| Accent (Rouge) | `#b91c1c` | Highlights, alertes |
| Success (Vert) | `#22c55e` | Validations |

### Polices

- **Display**: Outfit (titres)
- **Body**: Plus Jakarta Sans (texte)

### Composants CSS

```css
/* Boutons */
.btn-primary    /* Orange, principal */
.btn-secondary  /* Charbon */
.btn-outline    /* Bordure */
.btn-ghost      /* Transparent */

/* Tailles */
.btn-lg         /* Grand */
.btn-md         /* Moyen */
.btn-sm         /* Petit */

/* Cards */
.card           /* Card de base */
.card-hover     /* Avec effet hover */

/* Inputs */
.input          /* Champ de formulaire */
.input-error    /* État erreur */
.label          /* Label de champ */
```

## 🔒 Variables d'Environnement

| Variable | Description | Requis |
|----------|-------------|--------|
| `DATABASE_URL` | URL PostgreSQL | ✅ |
| `NEXTAUTH_URL` | URL du site | ✅ |
| `NEXTAUTH_SECRET` | Secret NextAuth | ✅ |
| `RESEND_API_KEY` | Clé API Resend | ✅ |
| `EMAIL_FROM` | Adresse expéditeur | ✅ |

## 📱 Pages du Site

### Publiques
- `/` - Page d'accueil
- `/contact` - Formulaire de contact/devis
- `/ramonage` - Service ramonage
- `/debistrage` - Service débistrage
- `/tubage-cheminee` - Service tubage
- `/entretien-poele-granules` - Entretien poêles
- `/zones-intervention` - Zones couvertes
- `/tarifs` - Grille tarifaire
- `/a-propos` - Présentation entreprise
- `/mentions-legales` - Mentions légales
- `/politique-confidentialite` - RGPD

### Pages locales SEO
- `/ramonage-beauvais`
- `/ramonage-chantilly`
- `/ramonage-senlis`
- etc.

## 🚢 Déploiement

### Vercel (recommandé)

1. Connecter le repository GitHub
2. Configurer les variables d'environnement
3. Déployer

### Self-hosted (Coolify/Docker)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📈 Roadmap

### Phase 1 - Site Vitrine ✅
- [x] Structure Next.js 15 + React 19
- [x] Design system Tailwind
- [x] Page d'accueil
- [x] Pages services (7)
- [x] Pages locales SEO (16 villes)
- [x] Page contact avec formulaire fonctionnel
- [x] Pages légales (mentions, confidentialité, CGV)
- [x] Carrousel témoignages (50 avis)
- [x] Email protégé anti-spam
- [x] API contact avec Resend

### Phase 2 - Améliorations
- [ ] Sitemap.xml + robots.txt
- [ ] Schema.org / JSON-LD
- [ ] Google Analytics
- [ ] Métadonnées OpenGraph
- [ ] Page 404 personnalisée
- [ ] Intégration Google Reviews API

### Phase 3 - Backoffice
- [ ] Authentification
- [ ] Gestion clients
- [ ] Planning/RDV
- [ ] Devis/Factures

### Phase 4 - SaaS Multi-tenant
- [ ] Onboarding
- [ ] Facturation abonnements
- [ ] Tableau de bord admin

## 📧 Configuration Email (Resend)

Le formulaire de contact utilise [Resend](https://resend.com) pour l'envoi d'emails.

### Étapes de configuration

1. **Créer un compte Resend** sur [resend.com](https://resend.com)

2. **Vérifier votre domaine** dans le dashboard Resend
   - Ajouter les enregistrements DNS (SPF, DKIM)
   - Attendre la vérification (~5 min)

3. **Créer une clé API** dans Settings > API Keys

4. **Configurer les variables d'environnement**
```bash
RESEND_API_KEY="re_xxxxxxxxxxxxx"
CONTACT_EMAIL="contact@dcs-ramonage.fr"
FROM_EMAIL="noreply@dcs-ramonage.fr"
```

### Mode développement

En attendant la vérification du domaine, vous pouvez utiliser l'email de test Resend :
```bash
FROM_EMAIL="onboarding@resend.dev"
```

## 📄 Licence

Propriétaire - DCS Ramonage / RamonPro

## 👥 Contact

- **Site**: [dcs-ramonage.fr](https://dcs-ramonage.fr)
- **Email**: contact@dcs-ramonage.fr
- **Téléphone**: 09 80 80 10 61
