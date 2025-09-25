# Base de Données E6Wash SaaS

## Configuration

### Prérequis
- MySQL 8.0+
- Node.js 18+
- npm ou yarn

### Variables d'environnement
```bash
DATABASE_URL="mysql://root:password@localhost:3306/e6wash"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="your-secret-key-here"
NODE_ENV="development"
```

## Installation

### 1. Configuration automatique
```bash
./scripts/db-setup.sh
```

### 2. Configuration manuelle

#### Créer la base de données
```bash
mysql -u root -ppassword -e "CREATE DATABASE IF NOT EXISTS e6wash CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

#### Générer le client Prisma
```bash
npx prisma generate
```

#### Exécuter les migrations
```bash
npx prisma migrate dev --name init
```

#### Peupler la base de données
```bash
npm run db:seed
```

## Structure de la base de données

### Modèles principaux

#### Users (Utilisateurs)
- **SUPER_ADMIN**: Administrateur système
- **ADMIN**: Administrateur de pressing
- **OWNER**: Propriétaire de pressing
- **EMPLOYEE**: Employé
- **CAISSIER**: Caissier
- **MANAGER**: Manager
- **COLLECTOR**: Collecteur
- **CLIENT**: Client

#### Tenants (Pressings)
- Gestion multi-tenant
- Paramètres personnalisés
- Abonnements SaaS

#### Agencies (Agences)
- Agences par pressing
- Gestion des utilisateurs
- Paramètres spécifiques

#### Orders (Commandes)
- Commandes clients
- Statuts de suivi
- Paiements intégrés

#### Services
- Services de pressing
- Tarification
- Catégories

#### Inventory (Inventaire)
- Gestion des stocks
- Alertes de stock faible
- Transactions

#### Tasks (Tâches)
- Gestion des tâches
- Assignation
- Suivi de progression

#### Messages & Conversations
- Communication interne
- Notifications
- Historique

#### Loyalty (Fidélité)
- Programme de fidélité
- Points et récompenses
- Niveaux de fidélité

## Comptes de test

| Email | Mot de passe | Rôle | Description |
|-------|-------------|------|-------------|
| admin@e6wash.com | admin123 | SUPER_ADMIN | Administrateur système |
| pressing@e6wash.com | pressing123 | ADMIN | Admin pressing |
| agent@e6wash.com | agent123 | EMPLOYEE | Employé |
| collector@e6wash.com | collector123 | COLLECTOR | Collecteur |

## Commandes utiles

### Prisma Studio
```bash
npx prisma studio
```
Interface graphique pour visualiser et modifier les données.

### Reset de la base de données
```bash
npx prisma migrate reset
```

### Nouvelle migration
```bash
npx prisma migrate dev --name nom_de_la_migration
```

### Push des changements (dev uniquement)
```bash
npx prisma db push
```

## Sécurité

- Mots de passe hashés avec bcrypt
- Authentification JWT
- Contraintes d'unicité
- Validation des données
- Soft delete pour les données sensibles

## Performance

- Index sur les champs fréquemment recherchés
- Relations optimisées
- Pagination pour les grandes listes
- Cache des requêtes fréquentes

## Sauvegarde

### Sauvegarde manuelle
```bash
mysqldump -u root -ppassword e6wash > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restauration
```bash
mysql -u root -ppassword e6wash < backup_file.sql
```

## Monitoring

- Logs des requêtes Prisma
- Métriques de performance
- Alertes de stock faible
- Notifications système
