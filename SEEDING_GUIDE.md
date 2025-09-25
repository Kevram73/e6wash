# 🌱 Guide de Seeding - E6Wash SaaS

Ce guide explique comment utiliser le système de seeding complet pour peupler la base de données avec des données de test réalistes.

## 📋 Données Créées

Le script de seeding complet (`prisma/seed-complete.ts`) crée des données pour toutes les tables :

### 🏢 **Tenants (Pressings)**
- **Pressing Central** (Paris) - Plan Premium
- **Clean Express** (Lyon) - Plan Basique  
- **Laverie Pro** (Douala) - Plan Entreprise

### 👥 **Utilisateurs**
- **Super Admin** - `admin@e6wash.com` / `password123`
- **Admin Pressing Central** - `admin@pressing-central.com` / `password123`
- **Employé** - `employe@pressing-central.com` / `password123`
- **Collecteur** - `collecteur@pressing-central.com` / `password123`

### 🏪 **Agences**
- **Agence Centre** (Paris) - Code AG001
- **Agence Nord** (Paris) - Code AG002

### 👤 **Clients**
- **Marie Dubois** - Client fidèle (150 points)
- **Jean Martin** - Client régulier (75 points)
- **Sophie Laurent** - Client premium (200 points)

### 🛠️ **Services**
- **Nettoyage à sec** - 15€ (24h)
- **Repassage** - 8€ (2h)
- **Blanchisserie** - 12€ (48h)

### 📦 **Commandes**
- **ORD-001** - Marie Dubois (Complétée)
- **ORD-002** - Jean Martin (En cours)
- **ORD-003** - Sophie Laurent (En attente)

### 📋 **Tâches**
- Collecte, traitement et livraison des commandes
- Assignées aux employés et collecteurs

### 📦 **Inventaire**
- Détergent professionnel (50L)
- Cintres métalliques (200 pièces)
- Sacs de protection (1000 pièces)

### 🔔 **Notifications**
- Nouvelles commandes
- Alertes de stock faible
- Tâches assignées

### 💬 **Conversations**
- Support client avec Marie Dubois
- Demande de service de Jean Martin

### 🎯 **Promotions**
- **WELCOME20** - 20% nouveau client
- **LOYALTY10** - 10€ clients fidèles

### ⭐ **Groupes de Fidélité**
- **Bronze** (0-99 pts) - 5% réduction
- **Argent** (100-299 pts) - 10% réduction
- **Or** (300-999 pts) - 15% réduction
- **Platine** (1000+ pts) - 20% réduction

### 💳 **Abonnements**
- **Plan Basique** - 29.99€/mois
- **Plan Premium** - 79.99€/mois
- **Plan Entreprise** - 199.99€/mois

## 🚀 Commandes de Seeding

### Seeding Complet (Recommandé)
```bash
npm run db:seed-complete
```

### Seeding Basique
```bash
npm run db:seed
```

### Génération du Client Prisma
```bash
npm run db:generate
```

### Push du Schéma vers la DB
```bash
npm run db:push
```

### Interface Graphique
```bash
npm run db:studio
```

## 🔧 Prérequis

1. **Base de données MySQL** configurée
2. **Variables d'environnement** définies dans `.env.local` :
   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/e6wash"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   NODE_ENV="development"
   ```

## 📊 Comptes de Test

### Super Admin
- **Email** : `admin@e6wash.com`
- **Mot de passe** : `password123`
- **Rôle** : SUPER_ADMIN
- **Accès** : Toute la plateforme

### Admin Pressing
- **Email** : `admin@pressing-central.com`
- **Mot de passe** : `password123`
- **Rôle** : ADMIN
- **Accès** : Gestion du pressing Central

### Employé
- **Email** : `employe@pressing-central.com`
- **Mot de passe** : `password123`
- **Rôle** : EMPLOYEE
- **Accès** : Gestion des commandes et tâches

### Collecteur
- **Email** : `collecteur@pressing-central.com`
- **Mot de passe** : `password123`
- **Rôle** : COLLECTOR
- **Accès** : Collecte et livraison

## 🎯 Données de Test Réalistes

Toutes les données créées sont cohérentes et réalistes :
- **Adresses** complètes avec codes postaux
- **Numéros de téléphone** valides
- **Dates** cohérentes (pickup, delivery, etc.)
- **Relations** entre entités respectées
- **Statuts** logiques (commandes, tâches, etc.)

## 🔄 Réinitialisation

Pour réinitialiser complètement la base de données :

```bash
# Supprimer toutes les données
npx prisma db push --force-reset

# Re-seeder
npm run db:seed-complete
```

## 📈 Statistiques Générées

Après le seeding, vous aurez :
- **3 tenants** avec différents plans
- **4 utilisateurs** avec différents rôles
- **2 agences** opérationnelles
- **3 clients** avec historique
- **3 services** populaires
- **3 commandes** dans différents états
- **3 tâches** assignées
- **3 articles** d'inventaire
- **3 notifications** récentes
- **2 conversations** actives
- **2 promotions** en cours
- **4 groupes** de fidélité
- **3 abonnements** actifs

## 🎉 Résultat

Une fois le seeding terminé, vous aurez une plateforme E6Wash complètement fonctionnelle avec des données réalistes pour tester toutes les fonctionnalités !
