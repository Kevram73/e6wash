# API Documentation - E6Wash SaaS

## Vue d'ensemble

L'API E6Wash SaaS fournit un accès complet à toutes les fonctionnalités de la plateforme de gestion de pressing. Elle est construite avec Next.js 14 et utilise Prisma comme ORM.

## Authentification

Toutes les routes API (sauf `/api/auth/login` et `/api/auth/register`) nécessitent une authentification via NextAuth.js.

### Headers requis
```
Authorization: Bearer <token>
Content-Type: application/json
```

## Routes API

### 🔐 Authentification

#### POST `/api/auth/login`
Connexion utilisateur
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### POST `/api/auth/register`
Inscription utilisateur
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullname": "John Doe",
  "name": "John",
  "role": "ADMIN",
  "tenantId": "tenant-id",
  "agencyId": "agency-id",
  "phone": "+237 6XX XXX XXX"
}
```

#### GET `/api/auth/me`
Récupérer le profil de l'utilisateur connecté

### 👥 Utilisateurs

#### GET `/api/users`
Liste des utilisateurs avec pagination et filtres
**Paramètres de requête:**
- `page` (number): Page (défaut: 1)
- `limit` (number): Nombre d'éléments par page (défaut: 10)
- `search` (string): Recherche par nom, email
- `role` (string): Filtrer par rôle
- `tenantId` (string): Filtrer par tenant
- `agencyId` (string): Filtrer par agence

#### POST `/api/users`
Créer un nouvel utilisateur
```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullname": "John Doe",
  "name": "John",
  "role": "ADMIN",
  "tenantId": "tenant-id",
  "agencyId": "agency-id",
  "phone": "+237 6XX XXX XXX",
  "address": "123 Main St"
}
```

#### GET `/api/users/[id]`
Récupérer un utilisateur par ID

#### PUT `/api/users/[id]`
Mettre à jour un utilisateur

#### DELETE `/api/users/[id]`
Supprimer un utilisateur (soft delete)

### 🏢 Tenants (Pressings)

#### GET `/api/tenants`
Liste des tenants avec pagination
**Paramètres de requête:**
- `page`, `limit`, `search`
- `status` (string): Filtrer par statut

#### POST `/api/tenants`
Créer un nouveau tenant
```json
{
  "name": "Pressing Moderne",
  "subdomain": "moderne",
  "domain": "moderne.e6wash.com",
  "status": "ACTIVE",
  "settings": {
    "workingHours": {
      "start": "08:00",
      "end": "18:00",
      "days": ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
    },
    "deliveryRadius": 10,
    "currency": "FCFA"
  }
}
```

#### GET `/api/tenants/[id]`
Récupérer un tenant avec ses statistiques

#### PUT `/api/tenants/[id]`
Mettre à jour un tenant

#### DELETE `/api/tenants/[id]`
Supprimer un tenant (soft delete)

### 🏪 Agences

#### GET `/api/agencies`
Liste des agences
**Paramètres de requête:**
- `page`, `limit`, `search`
- `tenantId` (string): Filtrer par tenant
- `isActive` (boolean): Filtrer par statut actif

#### POST `/api/agencies`
Créer une nouvelle agence
```json
{
  "tenantId": "tenant-id",
  "name": "Agence Centre",
  "address": "123 Avenue de la Paix",
  "phone": "+237 6XX XXX XXX",
  "email": "contact@agence.com",
  "countryId": "country-id",
  "city": "Douala",
  "isActive": true,
  "isMainAgency": false,
  "code": "AG001",
  "capacity": 100
}
```

#### GET `/api/agencies/[id]`
Récupérer une agence avec ses utilisateurs et statistiques

#### PUT `/api/agencies/[id]`
Mettre à jour une agence

#### DELETE `/api/agencies/[id]`
Supprimer une agence (soft delete)

### 👤 Clients

#### GET `/api/customers`
Liste des clients
**Paramètres de requête:**
- `page`, `limit`, `search`
- `tenantId`, `agencyId` (string): Filtrer par tenant/agence
- `isActive` (boolean): Filtrer par statut actif

#### POST `/api/customers`
Créer un nouveau client
```json
{
  "tenantId": "tenant-id",
  "agencyId": "agency-id",
  "fullname": "Jean Dupont",
  "email": "jean.dupont@email.com",
  "phone": "+237 6XX XXX XXX",
  "address": "456 Rue de la République",
  "countryId": "country-id",
  "city": "Douala",
  "dateOfBirth": "1990-01-01",
  "gender": "MALE"
}
```

#### GET `/api/customers/[id]`
Récupérer un client avec ses commandes

#### PUT `/api/customers/[id]`
Mettre à jour un client

#### DELETE `/api/customers/[id]`
Supprimer un client (soft delete)

### 📦 Commandes

#### GET `/api/orders`
Liste des commandes
**Paramètres de requête:**
- `page`, `limit`, `search`
- `tenantId`, `agencyId`, `customerId` (string)
- `status` (string): Filtrer par statut
- `paymentStatus` (string): Filtrer par statut de paiement

#### POST `/api/orders`
Créer une nouvelle commande
```json
{
  "tenantId": "tenant-id",
  "agencyId": "agency-id",
  "customerId": "customer-id",
  "orderNumber": "ORD-20240924-001",
  "totalAmount": 5000,
  "status": "NEW",
  "paymentStatus": "PENDING",
  "paymentMethod": "CASH",
  "pickupDate": "2024-09-25T10:00:00Z",
  "deliveryDate": "2024-09-27T16:00:00Z",
  "createdById": "user-id"
}
```

#### GET `/api/orders/[id]`
Récupérer une commande avec ses articles et paiements

#### PUT `/api/orders/[id]`
Mettre à jour une commande

#### DELETE `/api/orders/[id]`
Supprimer une commande (soft delete)

### 🧺 Services

#### GET `/api/services`
Liste des services
**Paramètres de requête:**
- `page`, `limit`, `search`
- `tenantId`, `agencyId` (string)
- `category` (string): Filtrer par catégorie
- `type` (string): Filtrer par type
- `isActive` (boolean): Filtrer par statut actif

#### POST `/api/services`
Créer un nouveau service
```json
{
  "tenantId": "tenant-id",
  "agencyId": "agency-id",
  "name": "Lavage Chemise",
  "type": "DETAIL",
  "price": 500,
  "description": "Lavage et repassage d'une chemise",
  "estimatedTime": "2",
  "category": "WASHING",
  "isActive": true
}
```

#### GET `/api/services/[id]`
Récupérer un service avec ses commandes

#### PUT `/api/services/[id]`
Mettre à jour un service

#### DELETE `/api/services/[id]`
Supprimer un service (soft delete)

### ✅ Tâches

#### GET `/api/tasks`
Liste des tâches
**Paramètres de requête:**
- `page`, `limit`, `search`
- `tenantId` (string)
- `status` (string): Filtrer par statut
- `priority` (string): Filtrer par priorité
- `assignedToId` (string): Filtrer par assigné
- `createdById` (string): Filtrer par créateur

#### POST `/api/tasks`
Créer une nouvelle tâche
```json
{
  "tenantId": "tenant-id",
  "title": "Vérifier le stock",
  "description": "Contrôler les niveaux de stock",
  "priority": "HIGH",
  "status": "PENDING",
  "dueDate": "2024-09-25T18:00:00Z",
  "assignedToId": "user-id",
  "createdById": "user-id",
  "estimatedHours": 2
}
```

#### GET `/api/tasks/[id]`
Récupérer une tâche avec ses commentaires

#### PUT `/api/tasks/[id]`
Mettre à jour une tâche

#### DELETE `/api/tasks/[id]`
Supprimer une tâche

### 📦 Inventaire

#### GET `/api/inventory`
Liste de l'inventaire
**Paramètres de requête:**
- `page`, `limit`, `search`
- `tenantId` (string)
- `category` (string): Filtrer par catégorie
- `isLowStock` (boolean): Filtrer les articles en stock faible

#### POST `/api/inventory`
Créer un nouvel article d'inventaire
```json
{
  "tenantId": "tenant-id",
  "name": "Détergent",
  "category": "DETERGENT",
  "currentStock": 50,
  "minStock": 10,
  "unit": "Litre",
  "unitPrice": 2500,
  "supplier": "Fournisseur ABC",
  "isLowStock": false
}
```

#### GET `/api/inventory/[id]`
Récupérer un article avec ses transactions

#### PUT `/api/inventory/[id]`
Mettre à jour un article

#### DELETE `/api/inventory/[id]`
Supprimer un article

### 🔔 Notifications

#### GET `/api/notifications`
Liste des notifications
**Paramètres de requête:**
- `page`, `limit`, `search`
- `tenantId`, `userId` (string)
- `level` (string): Filtrer par niveau
- `isRead` (boolean): Filtrer par statut de lecture

#### POST `/api/notifications`
Créer une nouvelle notification
```json
{
  "tenantId": "tenant-id",
  "title": "Stock faible",
  "content": "Le stock de détergent est en dessous du seuil minimum",
  "level": "WARNING",
  "icon": "⚠️",
  "link": "/inventory",
  "userId": "user-id",
  "createdById": "user-id",
  "relatedType": "Inventory",
  "relatedId": "item-id"
}
```

#### GET `/api/notifications/[id]`
Récupérer une notification

#### PUT `/api/notifications/[id]`
Mettre à jour une notification (marquer comme lue)

#### DELETE `/api/notifications/[id]`
Supprimer une notification

### 💬 Conversations

#### GET `/api/conversations`
Liste des conversations
**Paramètres de requête:**
- `page`, `limit`, `search`
- `tenantId` (string)
- `type` (string): Filtrer par type (DIRECT, GROUP)
- `userId` (string): Filtrer par participant

#### POST `/api/conversations`
Créer une nouvelle conversation
```json
{
  "tenantId": "tenant-id",
  "title": "Équipe Agence Centre",
  "type": "GROUP",
  "createdById": "user-id",
  "participantIds": ["user1-id", "user2-id", "user3-id"]
}
```

#### GET `/api/conversations/[id]/messages`
Récupérer les messages d'une conversation
**Paramètres de requête:**
- `page`, `limit`

#### POST `/api/conversations/[id]/messages`
Envoyer un message
```json
{
  "conversationId": "conversation-id",
  "senderId": "user-id",
  "content": "Bonjour l'équipe !",
  "type": "TEXT"
}
```

### 📊 Rapports

#### GET `/api/reports`
Générer des rapports
**Paramètres de requête:**
- `tenantId` (string, requis)
- `agencyId` (string, optionnel)
- `startDate` (string, optionnel)
- `endDate` (string, optionnel)
- `type` (string): Type de rapport
  - `overview`: Vue d'ensemble
  - `orders`: Rapport des commandes
  - `revenue`: Rapport des revenus
  - `customers`: Rapport des clients
  - `inventory`: Rapport de l'inventaire
  - `tasks`: Rapport des tâches

### 🎯 Fidélité

#### GET `/api/loyalty`
Données de fidélité
**Paramètres de requête:**
- `tenantId` (string, requis)
- `type` (string): Type de données
  - `settings`: Paramètres de fidélité
  - `customers`: Clients avec points de fidélité
  - `transactions`: Transactions de points
  - `groups`: Groupes de fidélité

#### POST `/api/loyalty`
Créer les paramètres de fidélité
```json
{
  "tenantId": "tenant-id",
  "isActive": true,
  "pointsPerCurrency": 1.0,
  "currencyPerPoint": 100.0,
  "minimumPointsForRedeem": 100,
  "expiryMonths": 12,
  "welcomeBonus": 50,
  "birthdayBonus": 100
}
```

#### GET `/api/loyalty/[id]`
Récupérer les paramètres de fidélité

#### PUT `/api/loyalty/[id]`
Mettre à jour les paramètres de fidélité

#### DELETE `/api/loyalty/[id]`
Supprimer les paramètres de fidélité

### 💳 Abonnements

#### GET `/api/subscriptions`
Liste des abonnements
**Paramètres de requête:**
- `page`, `limit`, `search`
- `isActive` (boolean): Filtrer par statut actif

#### POST `/api/subscriptions`
Créer un nouvel abonnement
```json
{
  "name": "Premium",
  "price": 50000,
  "maxAgencies": 3,
  "maxUsers": 15,
  "maxOrdersPerMonth": 2000,
  "features": ["gestion_commandes", "rapports_avancés", "gestion_stock"],
  "isActive": true
}
```

#### GET `/api/subscriptions/[id]`
Récupérer un abonnement avec ses tenants

#### PUT `/api/subscriptions/[id]`
Mettre à jour un abonnement

#### DELETE `/api/subscriptions/[id]`
Supprimer un abonnement

### 🌍 Pays

#### GET `/api/countries`
Liste des pays
**Paramètres de requête:**
- `page`, `limit`, `search`

#### POST `/api/countries`
Créer un nouveau pays
```json
{
  "name": "Cameroun",
  "code": "CM"
}
```

### 🏭 Fournisseurs

#### GET `/api/suppliers`
Liste des fournisseurs
**Paramètres de requête:**
- `page`, `limit`, `search`
- `tenantId` (string)
- `isActive` (boolean): Filtrer par statut actif

#### POST `/api/suppliers`
Créer un nouveau fournisseur
```json
{
  "tenantId": "tenant-id",
  "name": "Fournisseur ABC",
  "contactPerson": "Jean Dupont",
  "email": "contact@fournisseur.com",
  "phone": "+237 6XX XXX XXX",
  "address": "123 Rue des Fournisseurs",
  "city": "Douala",
  "country": "Cameroun",
  "paymentTerms": "30 jours",
  "isActive": true
}
```

## Codes de statut HTTP

- `200`: Succès
- `201`: Créé avec succès
- `400`: Erreur de validation ou requête invalide
- `401`: Non authentifié
- `403`: Accès non autorisé
- `404`: Ressource non trouvée
- `500`: Erreur interne du serveur

## Gestion des erreurs

Toutes les erreurs retournent un objet JSON avec la structure suivante :

```json
{
  "error": "Message d'erreur",
  "details": "Détails supplémentaires (optionnel)"
}
```

## Pagination

Les listes paginées retournent un objet avec la structure suivante :

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

## Filtres et recherche

La plupart des endpoints de liste supportent :
- **Pagination**: `page` et `limit`
- **Recherche**: `search` (recherche textuelle)
- **Filtres spécifiques**: selon l'endpoint

## Authentification et autorisation

- Toutes les routes nécessitent une session valide
- Les utilisateurs ne peuvent accéder qu'aux données de leur tenant
- Les rôles déterminent les permissions d'accès

## Rate Limiting

- 100 requêtes par minute par utilisateur
- 1000 requêtes par heure par utilisateur

## Versioning

L'API utilise le versioning par URL. La version actuelle est v1 (implicite).

## Support

Pour toute question ou problème avec l'API, contactez l'équipe de développement.
