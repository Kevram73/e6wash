import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Données de base
const countries = [
  { name: 'Cameroun', code: 'CM' },
  { name: 'France', code: 'FR' },
  { name: 'Sénégal', code: 'SN' },
  { name: 'Côte d\'Ivoire', code: 'CI' },
  { name: 'Mali', code: 'ML' },
  { name: 'Burkina Faso', code: 'BF' },
  { name: 'Niger', code: 'NE' },
  { name: 'Tchad', code: 'TD' },
  { name: 'Gabon', code: 'GA' },
  { name: 'Congo', code: 'CG' },
  { name: 'RDC', code: 'CD' },
  { name: 'Rwanda', code: 'RW' },
  { name: 'Burundi', code: 'BI' },
  { name: 'Tanzanie', code: 'TZ' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Ouganda', code: 'UG' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Bénin', code: 'BJ' },
  { name: 'Togo', code: 'TG' }
];

const cities = [
  'Douala', 'Yaoundé', 'Garoua', 'Bamenda', 'Maroua', 'Ngaoundéré', 'Bertoua', 'Ebolowa', 'Kumba', 'Bafoussam',
  'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille',
  'Dakar', 'Thiès', 'Kaolack', 'Ziguinchor', 'Saint-Louis', 'Diourbel', 'Tambacounda', 'Kolda', 'Fatick', 'Matam',
  'Abidjan', 'Bouaké', 'Daloa', 'Korhogo', 'Yamoussoukro', 'San-Pédro', 'Gagnoa', 'Man', 'Divo', 'Anyama',
  'Bamako', 'Sikasso', 'Ségou', 'Mopti', 'Koutiala', 'San', 'Kati', 'Kayes', 'Kita', 'Nioro'
];

const tenantNames = [
  'Pressing Elite', 'Clean Express', 'Laundry Pro', 'Fresh Clean', 'Spotless Service',
  'Quick Wash', 'Premium Press', 'Clean Corner', 'Wash & Go', 'Fresh Start',
  'Laundry Master', 'Clean Zone', 'Express Wash', 'Spot Free', 'Clean House',
  'Wash Center', 'Fresh Press', 'Clean Spot', 'Quick Clean', 'Laundry Hub'
];

const serviceNames = [
  'Pressing au Kilo', 'Nettoyage à Sec', 'Blanchisserie', 'Repassage Express', 'Nettoyage Tapis',
  'Lavage Voiture', 'Nettoyage Bureau', 'Entretien Textile', 'Blanchiment', 'Teinture',
  'Rénovation Cuir', 'Nettoyage Rideaux', 'Lavage Couette', 'Pressing Chemise', 'Nettoyage Manteau',
  'Blanchisserie Hôtel', 'Service Express', 'Nettoyage Industriel', 'Entretien Uniforme', 'Service Premium'
];

const customerNames = [
  'Jean Dupont', 'Marie Martin', 'Pierre Durand', 'Sophie Bernard', 'Michel Leroy',
  'Isabelle Moreau', 'Philippe Petit', 'Catherine Roux', 'Alain Simon', 'Françoise Laurent',
  'Robert David', 'Monique Thomas', 'Claude Richard', 'Nicole Petit', 'Gérard Moreau',
  'Sylvie Bernard', 'André Martin', 'Jacqueline Dubois', 'Marcel Robert', 'Colette Richard'
];

const supplierNames = [
  'Fournisseur Pro', 'Distrib Clean', 'Supply Express', 'Clean Source', 'Wash Supply',
  'Fresh Distrib', 'Clean Partner', 'Supply Master', 'Distrib Plus', 'Clean Source Pro',
  'Wash Distrib', 'Fresh Supply', 'Clean Express', 'Supply Zone', 'Distrib Clean',
  'Clean Master', 'Supply Pro', 'Fresh Distrib', 'Wash Source', 'Clean Supply'
];

const taskTitles = [
  'Nettoyage urgent', 'Maintenance équipement', 'Formation personnel', 'Inventaire stock',
  'Réparation machine', 'Nettoyage profondeur', 'Formation client', 'Audit qualité',
  'Mise à jour système', 'Nettoyage spécialisé', 'Formation sécurité', 'Contrôle qualité',
  'Réparation urgente', 'Nettoyage préventif', 'Formation technique', 'Audit sécurité',
  'Maintenance préventive', 'Nettoyage express', 'Formation produit', 'Contrôle équipement'
];

const promotionNames = [
  'Réduction 20%', 'Livraison gratuite', 'Offre spéciale', 'Pack famille', 'Réduction étudiant',
  'Offre senior', 'Pack entreprise', 'Réduction fidélité', 'Offre première commande', 'Pack premium',
  'Réduction volume', 'Offre weekend', 'Pack découverte', 'Réduction parrainage', 'Offre anniversaire',
  'Pack saisonnier', 'Réduction groupe', 'Offre express', 'Pack fidélité', 'Réduction premium'
];

const notificationTitles = [
  'Nouvelle commande', 'Commande prête', 'Paiement reçu', 'Livraison effectuée', 'Nouveau client',
  'Stock faible', 'Maintenance requise', 'Formation programmée', 'Audit prévu', 'Nouvelle promotion',
  'Commande annulée', 'Paiement en retard', 'Livraison reportée', 'Client satisfait', 'Stock réapprovisionné',
  'Maintenance terminée', 'Formation complétée', 'Audit terminé', 'Promotion expirée', 'Système mis à jour'
];

const conversationTitles = [
  'Demande de tarifs', 'Problème de livraison', 'Question sur service', 'Réclamation qualité', 'Demande d\'information',
  'Problème de paiement', 'Question technique', 'Demande de devis', 'Réclamation retard', 'Information produit',
  'Demande d\'aide', 'Question facturation', 'Problème commande', 'Demande modification', 'Question livraison',
  'Réclamation service', 'Demande annulation', 'Question remboursement', 'Problème technique', 'Demande assistance'
];

async function main() {
  console.log('🌱 Début du seeding avec 20+ enregistrements par table...\n');

  // 1. Créer les pays (20)
  console.log('📍 Création des pays...');
  const createdCountries = [];
  for (const country of countries) {
    const created = await prisma.country.upsert({
      where: { code: country.code },
      update: {},
      create: country,
    });
    createdCountries.push(created);
  }
  console.log(`✅ ${createdCountries.length} pays créés`);

  // 2. Créer les tenants (20)
  console.log('🏢 Création des tenants...');
  const createdTenants = [];
  for (let i = 0; i < 20; i++) {
    const tenant = await prisma.tenant.upsert({
      where: { subdomain: `tenant-${i + 1}` },
      update: {},
      create: {
        name: tenantNames[i % tenantNames.length],
        subdomain: `tenant-${i + 1}`,
        domain: `tenant-${i + 1}.e6wash.com`,
        logo: null,
        settings: {
          currency: 'XAF',
          timezone: 'Africa/Douala',
          workingHours: {
            start: '08:00',
            end: '18:00',
            days: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
          },
          deliveryRadius: 10,
          allowCashPayment: true,
          allowOnlinePayment: true,
          autoAssignCollectors: true
        },
        status: 'ACTIVE'
      },
    });
    createdTenants.push(tenant);
  }
  console.log(`✅ ${createdTenants.length} tenants créés`);

  // 3. Créer les agences (20)
  console.log('🏪 Création des agences...');
  const createdAgencies = [];
  for (let i = 0; i < 20; i++) {
    const agency = await prisma.agency.upsert({
      where: { code: `AG${String(i + 1).padStart(3, '0')}` },
      update: {},
      create: {
        tenantId: createdTenants[i % createdTenants.length].id,
        name: `Agence ${cities[i % cities.length]}`,
        address: `${Math.floor(Math.random() * 999) + 1} Avenue ${cities[i % cities.length]}`,
        phone: `+237 6${Math.floor(Math.random() * 99)} ${Math.floor(Math.random() * 999)} ${Math.floor(Math.random() * 999)}`,
        email: `contact@agence-${i + 1}.com`,
        countryId: createdCountries[i % createdCountries.length].id,
        city: cities[i % cities.length],
        isActive: Math.random() > 0.1, // 90% actives
        code: `AG${String(i + 1).padStart(3, '0')}`,
        capacity: Math.floor(Math.random() * 200) + 50,
        isMainAgency: i % 5 === 0, // Une agence principale tous les 5
        settings: {
          workingHours: {
            start: '08:00',
            end: '18:00',
            days: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi']
          }
        }
      },
    });
    createdAgencies.push(agency);
  }
  console.log(`✅ ${createdAgencies.length} agences créées`);

  // 4. Créer les utilisateurs (25)
  console.log('👥 Création des utilisateurs...');
  const createdUsers = [];
  const roles = ['SUPER_ADMIN', 'ADMIN', 'OWNER', 'MANAGER', 'EMPLOYEE', 'CAISSIER', 'COLLECTOR'];
  
  for (let i = 0; i < 25; i++) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.upsert({
      where: { email: `user${i + 1}@example.com` },
      update: {},
      create: {
        name: `User ${i + 1}`,
        fullname: `User ${i + 1} Fullname`,
        email: `user${i + 1}@example.com`,
        password: hashedPassword,
        role: roles[i % roles.length] as any,
        tenantId: createdTenants[i % createdTenants.length].id,
        agencyId: createdAgencies[i % createdAgencies.length].id,
        phoneNumber: `+237 6${Math.floor(Math.random() * 99)} ${Math.floor(Math.random() * 999)} ${Math.floor(Math.random() * 999)}`,
        address: `${Math.floor(Math.random() * 999) + 1} Rue ${cities[i % cities.length]}`,
        isActive: Math.random() > 0.1
      },
    });
    createdUsers.push(user);
  }
  console.log(`✅ ${createdUsers.length} utilisateurs créés`);

  // 5. Créer les clients (25)
  console.log('👤 Création des clients...');
  const createdCustomers = [];
  for (let i = 0; i < 25; i++) {
    const customer = await prisma.customer.create({
      data: {
        tenantId: createdTenants[i % createdTenants.length].id,
        agencyId: createdAgencies[i % createdAgencies.length].id,
        fullname: `${customerNames[i % customerNames.length]} Fullname`,
        email: `customer${i + 1}@example.com`,
        phone: `+237 6${Math.floor(Math.random() * 99)} ${Math.floor(Math.random() * 999)} ${Math.floor(Math.random() * 999)}`,
        address: `${Math.floor(Math.random() * 999) + 1} Rue ${cities[i % cities.length]}`,
        isActive: Math.random() > 0.1
      },
    });
    createdCustomers.push(customer);
  }
  console.log(`✅ ${createdCustomers.length} clients créés`);

  // 6. Créer les services (25)
  console.log('🔧 Création des services...');
  const createdServices = [];
  const serviceCategories = ['WASHING', 'IRONING', 'DRY_CLEANING', 'REPAIR', 'OTHER'];
  const serviceTypes = ['DETAIL', 'KILO'];
  for (let i = 0; i < 25; i++) {
    const service = await prisma.service.create({
      data: {
        tenantId: createdTenants[i % createdTenants.length].id,
        name: serviceNames[i % serviceNames.length],
        description: `Description du service ${serviceNames[i % serviceNames.length]}`,
        price: Math.floor(Math.random() * 50000) + 5000,
        category: serviceCategories[i % serviceCategories.length] as any,
        type: serviceTypes[i % serviceTypes.length] as any,
        isActive: Math.random() > 0.1,
        estimatedTime: `${Math.floor(Math.random() * 24) + 1}h`
      },
    });
    createdServices.push(service);
  }
  console.log(`✅ ${createdServices.length} services créés`);

  // 7. Créer les commandes (30)
  console.log('📦 Création des commandes...');
  const createdOrders = [];
  const orderStatuses = ['NEW', 'PROCESSING', 'READY', 'COMPLETED', 'CANCELLED'];
  const orderPaymentMethods = ['CASH', 'MOBILE_MONEY', 'BANK_TRANSFER', 'CARD'];
  
  for (let i = 0; i < 30; i++) {
    const order = await prisma.order.create({
      data: {
        tenantId: createdTenants[i % createdTenants.length].id,
        agencyId: createdAgencies[i % createdAgencies.length].id,
        customerId: createdCustomers[i % createdCustomers.length].id,
        orderNumber: `ORD-${new Date().getFullYear()}${String(i + 1).padStart(4, '0')}`,
        status: orderStatuses[i % orderStatuses.length] as any,
        totalAmount: Math.floor(Math.random() * 100000) + 10000,
        paymentMethod: orderPaymentMethods[i % orderPaymentMethods.length] as any,
        paymentStatus: Math.random() > 0.2 ? 'PAID' : 'PENDING',
        pickupDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
        deliveryDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000),
        notes: `Notes pour la commande ${i + 1}`,
        createdById: createdUsers[i % createdUsers.length].id,
        updatedById: createdUsers[i % createdUsers.length].id
      },
    });
    createdOrders.push(order);
  }
  console.log(`✅ ${createdOrders.length} commandes créées`);

  // 8. Créer les éléments de commande (60)
  console.log('📋 Création des éléments de commande...');
  for (let i = 0; i < 60; i++) {
    await prisma.orderItem.create({
      data: {
        orderId: createdOrders[i % createdOrders.length].id,
        serviceId: createdServices[i % createdServices.length].id,
        name: `Article ${i + 1}`,
        quantity: Math.floor(Math.random() * 10) + 1,
        unitPrice: Math.floor(Math.random() * 20000) + 5000,
        totalPrice: Math.floor(Math.random() * 100000) + 10000,
        notes: `Notes pour l'élément ${i + 1}`
      },
    });
  }
  console.log(`✅ 60 éléments de commande créés`);

  // 9. Créer les tâches (25)
  console.log('📝 Création des tâches...');
  const createdTasks = [];
  const taskPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  const taskStatuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
  
  for (let i = 0; i < 25; i++) {
    const task = await prisma.task.create({
      data: {
        tenantId: createdTenants[i % createdTenants.length].id,
        title: taskTitles[i % taskTitles.length],
        description: `Description de la tâche ${taskTitles[i % taskTitles.length]}`,
        priority: taskPriorities[i % taskPriorities.length] as any,
        status: taskStatuses[i % taskStatuses.length] as any,
        dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000),
        assignedToId: createdUsers[i % createdUsers.length].id,
        createdById: createdUsers[i % createdUsers.length].id
      },
    });
    createdTasks.push(task);
  }
  console.log(`✅ ${createdTasks.length} tâches créées`);

  // 10. Créer l'inventaire (25)
  console.log('📦 Création de l\'inventaire...');
  const createdInventory = [];
  const inventoryCategories = ['DETERGENT', 'BAG', 'HANGER', 'EQUIPMENT', 'OTHER'];
  const units = ['L', 'kg', 'pièce', 'm²', 'g'];
  
  for (let i = 0; i < 25; i++) {
    const inventory = await prisma.inventory.create({
      data: {
        tenantId: createdTenants[i % createdTenants.length].id,
        agencyId: createdAgencies[i % createdAgencies.length].id,
        name: `Article ${i + 1}`,
        category: inventoryCategories[i % inventoryCategories.length] as any,
        currentStock: Math.floor(Math.random() * 100) + 10,
        minStock: Math.floor(Math.random() * 20) + 5,
        unit: units[i % units.length],
        unitPrice: Math.floor(Math.random() * 10000) + 1000,
        supplier: supplierNames[i % supplierNames.length],
        isLowStock: Math.random() > 0.8
      },
    });
    createdInventory.push(inventory);
  }
  console.log(`✅ ${createdInventory.length} articles d'inventaire créés`);

  // 11. Créer les notifications (25)
  console.log('🔔 Création des notifications...');
  const createdNotifications = [];
  const notificationTypes = ['ORDER', 'PAYMENT', 'DELIVERY', 'SYSTEM', 'PROMOTION'];
  
  for (let i = 0; i < 25; i++) {
    const notification = await prisma.internalNotification.create({
      data: {
        tenantId: createdTenants[i % createdTenants.length].id,
        userId: createdUsers[i % createdUsers.length].id,
        title: notificationTitles[i % notificationTitles.length],
        content: `Message de notification ${i + 1}`,
        createdById: createdUsers[i % createdUsers.length].id,
        readAt: Math.random() > 0.5 ? new Date() : null
      },
    });
    createdNotifications.push(notification);
  }
  console.log(`✅ ${createdNotifications.length} notifications créées`);

  // 12. Créer les promotions (25)
  console.log('🎉 Création des promotions...');
  const createdPromotions = [];
  const promoTypes = ['percentage', 'fixed_amount'];
  
  for (let i = 0; i < 25; i++) {
    const promotion = await prisma.promo.create({
      data: {
        tenantId: createdTenants[i % createdTenants.length].id,
        name: promotionNames[i % promotionNames.length],
        description: `Description de la promotion ${promotionNames[i % promotionNames.length]}`,
        type: promoTypes[i % promoTypes.length],
        value: Math.floor(Math.random() * 50) + 5,
        startDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000),
        isActive: Math.random() > 0.2
      },
    });
    createdPromotions.push(promotion);
  }
  console.log(`✅ ${createdPromotions.length} promotions créées`);

  // 13. Créer les groupes de fidélité (20)
  console.log('💎 Création des groupes de fidélité...');
  const createdLoyaltyGroups = [];
  for (let i = 0; i < 20; i++) {
    const loyaltyGroup = await prisma.loyalGroup.create({
      data: {
        tenantId: createdTenants[i % createdTenants.length].id,
        name: `Groupe Fidélité ${i + 1}`,
        minOrders: Math.floor(Math.random() * 20) + 5,
        discount: Math.floor(Math.random() * 200) + 50,
        isActive: Math.random() > 0.1
      },
    });
    createdLoyaltyGroups.push(loyaltyGroup);
  }
  console.log(`✅ ${createdLoyaltyGroups.length} groupes de fidélité créés`);

  // 14. Créer les abonnements (20)
  console.log('📋 Création des abonnements...');
  const createdSubscriptions = [];
  for (let i = 0; i < 20; i++) {
    const subscription = await prisma.subscription.create({
      data: {
        name: `Plan ${i + 1}`,
        price: Math.floor(Math.random() * 100000) + 20000,
        maxAgencies: Math.floor(Math.random() * 10) + 1,
        maxUsers: Math.floor(Math.random() * 50) + 5,
        maxOrdersPerMonth: Math.floor(Math.random() * 1000) + 100,
        features: {
          support: '24/7',
          analytics: true
        },
        isActive: Math.random() > 0.1
      },
    });
    createdSubscriptions.push(subscription);
  }
  console.log(`✅ ${createdSubscriptions.length} abonnements créés`);

  // 15. Créer les fournisseurs (20)
  console.log('🚚 Création des fournisseurs...');
  const createdSuppliers = [];
  for (let i = 0; i < 20; i++) {
    const supplier = await prisma.supplier.create({
      data: {
        tenantId: createdTenants[i % createdTenants.length].id,
        name: supplierNames[i % supplierNames.length],
        email: `contact@${supplierNames[i % supplierNames.length].toLowerCase().replace(/\s+/g, '')}.com`,
        phone: `+237 6${Math.floor(Math.random() * 99)} ${Math.floor(Math.random() * 999)} ${Math.floor(Math.random() * 999)}`,
        address: `${Math.floor(Math.random() * 999) + 1} Avenue ${cities[i % cities.length]}`,
        contact: `Contact ${i + 1}`,
        isActive: Math.random() > 0.1
      },
    });
    createdSuppliers.push(supplier);
  }
  console.log(`✅ ${createdSuppliers.length} fournisseurs créés`);

  // 16. Créer les abonnements tenant (25)
  console.log('💰 Création des abonnements tenant...');
  const createdTenantSubscriptions = [];
  const subscriptionStatuses = ['ACTIVE', 'SUSPENDED', 'CANCELLED', 'EXPIRED'];
  
  for (let i = 0; i < 25; i++) {
    const tenantSubscription = await prisma.tenantSubscription.create({
      data: {
        tenantId: createdTenants[i % createdTenants.length].id,
        subscriptionId: createdSubscriptions[i % createdSubscriptions.length].id,
        status: subscriptionStatuses[i % subscriptionStatuses.length] as any,
        startDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000)
      },
    });
    createdTenantSubscriptions.push(tenantSubscription);
  }
  console.log(`✅ ${createdTenantSubscriptions.length} abonnements tenant créés`);

  // 17. Créer les conversations (20)
  console.log('💬 Création des conversations...');
  const createdConversations = [];
  for (let i = 0; i < 20; i++) {
    const conversation = await prisma.conversation.create({
      data: {
        tenantId: createdTenants[i % createdTenants.length].id,
        title: conversationTitles[i % conversationTitles.length],
        type: 'DIRECT',
        isActive: Math.random() > 0.2,
        createdById: createdUsers[i % createdUsers.length].id
      },
    });
    createdConversations.push(conversation);
  }
  console.log(`✅ ${createdConversations.length} conversations créées`);

  // 18. Créer les messages (50)
  console.log('📨 Création des messages...');
  for (let i = 0; i < 50; i++) {
    await prisma.message.create({
      data: {
        conversationId: createdConversations[i % createdConversations.length].id,
        content: `Contenu du message ${i + 1}`,
        messageType: 'TEXT',
        senderId: createdUsers[i % createdUsers.length].id
      },
    });
  }
  console.log(`✅ 50 messages créés`);

  // 19. Créer les paiements (30)
  console.log('💳 Création des paiements...');
  const createdPayments = [];
  const paymentMethods = ['CASH', 'MOBILE_MONEY', 'BANK_TRANSFER', 'CARD'];
  const paymentStatuses = ['PENDING', 'PAID', 'PARTIAL', 'REFUNDED'];
  
  for (let i = 0; i < 30; i++) {
    const payment = await prisma.payment.create({
      data: {
        orderId: createdOrders[i % createdOrders.length].id,
        agencyId: createdAgencies[i % createdAgencies.length].id,
        amount: Math.floor(Math.random() * 100000) + 10000,
        method: paymentMethods[i % paymentMethods.length] as any,
        status: paymentStatuses[i % paymentStatuses.length] as any,
        transactionId: `TXN-${Date.now()}-${i}`,
        paidAt: Math.random() > 0.2 ? new Date() : null,
        userId: createdUsers[i % createdUsers.length].id
      },
    });
    createdPayments.push(payment);
  }
  console.log(`✅ ${createdPayments.length} paiements créés`);

  console.log('\n🎉 Seeding terminé avec succès !');
  console.log('\n📊 Résumé des données créées :');
  console.log(`📍 Pays: ${createdCountries.length}`);
  console.log(`🏢 Tenants: ${createdTenants.length}`);
  console.log(`🏪 Agences: ${createdAgencies.length}`);
  console.log(`👥 Utilisateurs: ${createdUsers.length}`);
  console.log(`👤 Clients: ${createdCustomers.length}`);
  console.log(`🔧 Services: ${createdServices.length}`);
  console.log(`📦 Commandes: ${createdOrders.length}`);
  console.log(`📋 Éléments de commande: 60`);
  console.log(`📝 Tâches: ${createdTasks.length}`);
  console.log(`📦 Inventaire: ${createdInventory.length}`);
  console.log(`🔔 Notifications: ${createdNotifications.length}`);
  console.log(`🎉 Promotions: ${createdPromotions.length}`);
  console.log(`💎 Groupes de fidélité: ${createdLoyaltyGroups.length}`);
  console.log(`📋 Abonnements: ${createdSubscriptions.length}`);
  console.log(`🚚 Fournisseurs: ${createdSuppliers.length}`);
  console.log(`💰 Abonnements tenant: ${createdTenantSubscriptions.length}`);
  console.log(`💬 Conversations: ${createdConversations.length}`);
  console.log(`📨 Messages: 50`);
  console.log(`💳 Paiements: ${createdPayments.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
