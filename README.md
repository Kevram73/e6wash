# E6Wash SaaS - Plateforme de Gestion pour Pressings

Une solution SaaS complète pour la gestion des pressings avec support multi-tenant, inspirée du design d'Upwork.

## 🚀 Fonctionnalités

### Super Admin SaaS
- Gestion des pressings abonnés
- Plans d'abonnement (Basic, Premium, Enterprise)
- Suivi des paiements SaaS
- Statistiques globales
- Gestion des utilisateurs système

### Admin Pressing
- Gestion multi-agences
- Configuration des services et tarifs
- Gestion des employés et collecteurs
- Suivi des commandes et paiements
- Rapports comptables et statistiques
- Gestion du stock et inventaire

### Agents/Caissiers
- Interface de gestion des commandes
- Encaissement des paiements
- Gestion du statut des commandes
- Vérification du stock

### Collecteurs
- Visualisation des missions
- Confirmation des collectes/livraisons
- Scanner QR code (via webcam)
- Historique des missions

### Clients
- Création de compte
- Passation de commandes (détail/kilo)
- Paiement en ligne (Mobile Money, carte, wallet)
- Suivi du statut des commandes
- Historique des commandes

## 🛠️ Stack Technique

### Frontend
- **Next.js 15** avec App Router
- **TypeScript** pour la sécurité des types
- **Tailwind CSS** pour le styling
- **Radix UI** pour les composants
- **Lucide React** pour les icônes
- **NextAuth.js** pour l'authentification

### Backend
- **Next.js API Routes**
- **Prisma ORM** avec PostgreSQL
- **NextAuth.js** pour l'authentification multi-rôles
- **Bcrypt** pour le hachage des mots de passe

### Base de Données
- **PostgreSQL** avec architecture multi-tenant
- **Prisma** comme ORM
- Support des relations complexes

## 📁 Structure du Projet

```
e6wash-saas/
├── prisma/
│   ├── schema.prisma          # Schéma de base de données
│   └── seed.ts               # Script de données de test
├── src/
│   ├── app/                  # App Router Next.js
│   │   ├── (protected)/      # Pages protégées
│   │   ├── api/              # API Routes
│   │   └── auth/             # Pages d'authentification
│   ├── components/
│   │   ├── ui/               # Composants UI réutilisables
│   │   └── Layout/           # Layouts de l'application
│   ├── lib/
│   │   ├── auth.ts           # Configuration NextAuth
│   │   └── utils.ts          # Utilitaires
│   ├── pages/                # Pages React
│   └── types/                # Types TypeScript
├── public/                   # Assets statiques
└── README.md
```

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+ 
- PostgreSQL 14+
- npm ou yarn

### 1. Cloner le projet
```bash
git clone <repository-url>
cd e6wash-saas
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration de la base de données
```bash
# Créer une base de données PostgreSQL
createdb e6wash_saas

# Copier le fichier d'environnement
cp env.example .env

# Éditer .env avec vos paramètres
DATABASE_URL="postgresql://username:password@localhost:5432/e6wash_saas"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

### 4. Initialiser la base de données
```bash
# Générer le client Prisma
npm run db:generate

# Appliquer le schéma à la base de données
npm run db:push

# Peupler avec des données de test
npm run db:seed
```

### 5. Lancer l'application
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 👥 Comptes de Test

Après le seeding, vous pouvez vous connecter avec :

| Rôle | Email | Mot de passe | Description |
|------|-------|--------------|-------------|
| Super Admin | admin@e6wash.com | admin123 | Gestion globale de la plateforme |
| Admin Pressing | pressing@e6wash.com | pressing123 | Gestion d'un pressing |
| Agent | agent@e6wash.com | agent123 | Gestion des commandes |
| Collecteur | collector@e6wash.com | collector123 | Livraisons et collectes |

## 🏗️ Architecture Multi-Tenant

### Hiérarchie des Données
```
SaaS Platform
 └── Tenant (Pressing)
      └── Agences
           └── Employés (agents, collecteurs)
           └── Clients
           └── Commandes
```

### Séparation des Données
- **Filtrage par tenant_id** : Toutes les requêtes sont filtrées par le tenant de l'utilisateur connecté
- **Isolation des données** : Chaque pressing ne voit que ses propres données
- **Rôles et permissions** : Système de rôles granulaire avec permissions par fonctionnalité

## 📊 Modèles de Données Principaux

### Utilisateurs et Authentification
- `User` : Utilisateurs avec rôles (SUPER_ADMIN, PRESSING_ADMIN, AGENT, COLLECTOR, CLIENT)
- `Tenant` : Pressings (tenants) avec abonnements
- `Agency` : Agences d'un pressing

### Gestion des Commandes
- `Order` : Commandes avec statuts et paiements
- `OrderItem` : Articles d'une commande
- `Service` : Services proposés (détail/kilo)
- `Customer` : Clients des pressings

### Finances
- `Payment` : Paiements des commandes
- `Revenue` : Revenus du pressing
- `Expense` : Dépenses du pressing

### Stock et Inventaire
- `Inventory` : Articles en stock
- `InventoryTransaction` : Mouvements de stock
- `Supplier` : Fournisseurs

## 🎨 Design System

### Inspiration Upwork
- **Interface moderne** avec cartes et composants élégants
- **Navigation intuitive** avec sidebar responsive
- **Couleurs cohérentes** avec palette professionnelle
- **Animations subtiles** pour une meilleure UX

### Composants UI
- **Cards** : Affichage des statistiques et informations
- **Badges** : Statuts et indicateurs
- **Buttons** : Actions avec variants (primary, secondary, outline)
- **Layouts** : Responsive avec sidebar et topbar

## 🔧 Scripts Disponibles

```bash
# Développement
npm run dev              # Lancer en mode développement
npm run build            # Build de production
npm run start            # Lancer en production

# Base de données
npm run db:generate      # Générer le client Prisma
npm run db:push          # Appliquer le schéma
npm run db:seed          # Peupler avec des données de test
npm run db:studio        # Interface graphique Prisma

# Qualité du code
npm run lint             # Linter ESLint
```

## 🚀 Déploiement

### Variables d'environnement de production
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret"
NODE_ENV="production"
```

### Build et déploiement
```bash
npm run build
npm run start
```

## 📈 Roadmap

### Phase 1 (Actuelle)
- ✅ Architecture multi-tenant
- ✅ Authentification multi-rôles
- ✅ Dashboard adaptatif
- ✅ Gestion des commandes de base

### Phase 2
- [ ] API REST complète
- [ ] Intégration paiements (Mobile Money, cartes)
- [ ] Notifications en temps réel
- [ ] Rapports avancés

### Phase 3
- [ ] Application mobile (React Native)
- [ ] Scanner QR code
- [ ] Géolocalisation
- [ ] Analytics avancés

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou support :
- Email : support@e6wash.com
- Documentation : [docs.e6wash.com](https://docs.e6wash.com)
- Issues : [GitHub Issues](https://github.com/your-repo/issues)

---

**E6Wash SaaS** - Révolutionnez la gestion de votre pressing ! 🚀