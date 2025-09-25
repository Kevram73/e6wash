import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Créer les pays
  const cameroon = await prisma.country.upsert({
    where: { code: 'CM' },
    update: {},
    create: {
      name: 'Cameroun',
      code: 'CM',
    },
  });

  // Créer les plans d'abonnement
  const basicPlan = await prisma.subscription.upsert({
    where: { name: 'basic' },
    update: {},
    create: {
      name: 'basic',
      price: 25000, // 25,000 FCFA
      maxAgencies: 1,
      maxUsers: 5,
      maxOrdersPerMonth: 500,
      features: ['gestion_commandes', 'rapports_basiques', 'support_email'],
    },
  });

  const premiumPlan = await prisma.subscription.upsert({
    where: { name: 'premium' },
    update: {},
    create: {
      name: 'premium',
      price: 50000, // 50,000 FCFA
      maxAgencies: 3,
      maxUsers: 15,
      maxOrdersPerMonth: 2000,
      features: ['gestion_commandes', 'rapports_avancés', 'gestion_stock', 'support_prioritaire'],
    },
  });

  const enterprisePlan = await prisma.subscription.upsert({
    where: { name: 'enterprise' },
    update: {},
    create: {
      name: 'enterprise',
      price: 100000, // 100,000 FCFA
      maxAgencies: -1, // Illimité
      maxUsers: -1, // Illimité
      maxOrdersPerMonth: -1, // Illimité
      features: ['toutes_fonctionnalités', 'api_integration', 'support_dédié', 'formation'],
    },
  });

  // Créer le super admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@e6wash.com' },
    update: {},
    create: {
      email: 'admin@e6wash.com',
      name: 'Super Admin',
      fullname: 'Super Admin E6Wash',
      password: await bcrypt.hash('admin123', 10),
      role: 'SUPER_ADMIN',
      phone: '+237 6XX XXX XXX',
      isActive: true,
      status: true,
    },
  });

  // Créer un tenant (pressing) de test
  const testTenant = await prisma.tenant.upsert({
    where: { subdomain: 'test' },
    update: {},
    create: {
      name: 'Pressing Test',
      subdomain: 'test',
      status: 'ACTIVE',
      settings: {
        workingHours: {
          start: '08:00',
          end: '18:00',
          days: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
        },
        deliveryRadius: 10,
        autoAssignCollectors: true,
        allowOnlinePayment: true,
        allowCashPayment: true,
        currency: 'FCFA',
        timezone: 'Africa/Douala',
      },
    },
  });

  // Créer l'abonnement du tenant
  const tenantSubscription = await prisma.tenantSubscription.create({
    data: {
      tenantId: testTenant.id,
      subscriptionId: premiumPlan.id,
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
      autoRenew: true,
    },
  });

  // Créer une agence principale
  const mainAgency = await prisma.agency.upsert({
    where: { code: 'AG001' },
    update: {},
    create: {
      tenantId: testTenant.id,
      name: 'Agence Principale',
      address: '123 Avenue de la Paix, Douala',
      phone: '+237 6XX XXX XXX',
      email: 'contact@pressing-test.com',
      countryId: cameroon.id,
      city: 'Douala',
      isActive: true,
      isMainAgency: true,
      code: 'AG001',
      settings: {
        workingHours: {
          start: '08:00',
          end: '18:00',
          days: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
        },
      },
      capacity: 100,
    },
  });

  // Créer l'admin du pressing
  const pressingAdmin = await prisma.user.upsert({
    where: { email: 'pressing@e6wash.com' },
    update: {},
    create: {
      email: 'pressing@e6wash.com',
      name: 'Admin Pressing',
      fullname: 'Admin Pressing Test',
      password: await bcrypt.hash('pressing123', 10),
      role: 'ADMIN',
      tenantId: testTenant.id,
      agencyId: mainAgency.id,
      phone: '+237 6XX XXX XXX',
      isActive: true,
      status: true,
    },
  });

  // Créer un agent
  const agent = await prisma.user.upsert({
    where: { email: 'agent@e6wash.com' },
    update: {},
    create: {
      email: 'agent@e6wash.com',
      name: 'Agent Test',
      fullname: 'Agent Test',
      password: await bcrypt.hash('agent123', 10),
      role: 'EMPLOYEE',
      tenantId: testTenant.id,
      agencyId: mainAgency.id,
      phone: '+237 6XX XXX XXX',
      isActive: true,
      status: true,
    },
  });

  // Créer un collecteur
  const collector = await prisma.user.upsert({
    where: { email: 'collector@e6wash.com' },
    update: {},
    create: {
      email: 'collector@e6wash.com',
      name: 'Collecteur Test',
      fullname: 'Collecteur Test',
      password: await bcrypt.hash('collector123', 10),
      role: 'COLLECTOR',
      tenantId: testTenant.id,
      agencyId: mainAgency.id,
      phone: '+237 6XX XXX XXX',
      isActive: true,
      status: true,
    },
  });

  // Créer des services
  const services = [
    {
      name: 'Lavage Chemise',
      type: 'DETAIL',
      price: 500,
      category: 'WASHING',
      description: 'Lavage et repassage d\'une chemise',
      estimatedTime: '2',
    },
    {
      name: 'Lavage Pantalon',
      type: 'DETAIL',
      price: 800,
      category: 'WASHING',
      description: 'Lavage et repassage d\'un pantalon',
      estimatedTime: '2',
    },
    {
      name: 'Lavage au Kilo',
      type: 'KILO',
      price: 1500,
      category: 'WASHING',
      description: 'Lavage au kilo (minimum 3kg)',
      estimatedTime: '4',
    },
    {
      name: 'Nettoyage à Sec',
      type: 'DETAIL',
      price: 2000,
      category: 'DRY_CLEANING',
      description: 'Nettoyage à sec pour vêtements délicats',
      estimatedTime: '24',
    },
  ];

  for (const service of services) {
    await prisma.service.create({
      data: {
        tenantId: testTenant.id,
        agencyId: mainAgency.id,
        ...service,
      },
    });
  }

  // Créer des clients de test
  const customers = [
    {
      fullname: 'Jean Dupont',
      email: 'jean.dupont@email.com',
      phone: '+237 6XX XXX XXX',
      address: '456 Rue de la République, Douala',
    },
    {
      fullname: 'Marie Martin',
      email: 'marie.martin@email.com',
      phone: '+237 6XX XXX XXX',
      address: '789 Avenue du Port, Douala',
    },
    {
      fullname: 'Pierre Nguema',
      email: 'pierre.nguema@email.com',
      phone: '+237 6XX XXX XXX',
      address: '321 Boulevard de la Liberté, Douala',
    },
  ];

  for (const customer of customers) {
    await prisma.customer.create({
      data: {
        tenantId: testTenant.id,
        agencyId: mainAgency.id,
        countryId: cameroon.id,
        city: 'Douala',
        ...customer,
      },
    });
  }

  // Créer des commandes de test
  const customers_db = await prisma.customer.findMany({
    where: { tenantId: testTenant.id },
  });

  const services_db = await prisma.service.findMany({
    where: { tenantId: testTenant.id },
  });

  for (let i = 0; i < 10; i++) {
    const customer = customers_db[Math.floor(Math.random() * customers_db.length)];
    const service = services_db[Math.floor(Math.random() * services_db.length)];
    
    const order = await prisma.order.create({
      data: {
        tenantId: testTenant.id,
        agencyId: mainAgency.id,
        customerId: customer.id,
        orderNumber: `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(i + 1).padStart(3, '0')}`,
        totalAmount: service.price,
        status: ['NEW', 'PROCESSING', 'READY', 'COMPLETED'][Math.floor(Math.random() * 4)] as any,
        paymentStatus: ['PENDING', 'PAID'][Math.floor(Math.random() * 2)] as any,
        paymentMethod: ['CASH', 'MOBILE_MONEY', 'CARD'][Math.floor(Math.random() * 3)] as any,
        pickupDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000),
        deliveryDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000),
        createdById: agent.id,
      },
    });

    // Créer les articles de commande
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        serviceId: service.id,
        name: service.name,
        quantity: 1,
        unitPrice: service.price,
        totalPrice: service.price,
        category: 'shirt',
      },
    });
  }

  // Créer des tâches de test
  const tasks = [
    {
      title: 'Vérifier le stock de détergent',
      description: 'Contrôler les niveaux de stock et commander si nécessaire',
      priority: 'HIGH',
      status: 'PENDING',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 jours
      assignedToId: agent.id,
      createdById: pressingAdmin.id,
    },
    {
      title: 'Livrer la commande #ORD-20240923-001',
      description: 'Livraison chez Jean Dupont - 5 articles',
      priority: 'URGENT',
      status: 'IN_PROGRESS',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 jour
      assignedToId: collector.id,
      createdById: agent.id,
    },
    {
      title: 'Nettoyer les machines de lavage',
      description: 'Entretien hebdomadaire des équipements',
      priority: 'MEDIUM',
      status: 'COMPLETED',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Hier
      assignedToId: agent.id,
      createdById: pressingAdmin.id,
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      completedById: agent.id,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        tenantId: testTenant.id,
        ...task,
      },
    });
  }

  // Créer des notifications de test
  const notifications = [
    {
      title: 'Stock faible détecté',
      content: 'Le stock de détergent est en dessous du seuil minimum (2 unités restantes)',
      level: 'WARNING',
      icon: '⚠️',
      link: '/inventory',
      userId: pressingAdmin.id,
      createdById: pressingAdmin.id,
      relatedType: 'Inventory',
      relatedId: 'inv-001',
    },
    {
      title: 'Nouvelle commande reçue',
      content: 'La commande #ORD-20240923-001 a été créée par Jean Dupont',
      level: 'INFO',
      icon: 'ℹ️',
      link: '/orders/ord-001',
      userId: agent.id,
      createdById: pressingAdmin.id,
      relatedType: 'Order',
      relatedId: 'ord-001',
    },
    {
      title: 'Tâche assignée',
      content: 'Une nouvelle tâche "Vérifier le stock" vous a été assignée',
      level: 'INFO',
      icon: '📋',
      link: '/tasks/task-001',
      userId: agent.id,
      createdById: pressingAdmin.id,
      relatedType: 'Task',
      relatedId: 'task-001',
    },
  ];

  for (const notification of notifications) {
    await prisma.internalNotification.create({
      data: {
        tenantId: testTenant.id,
        ...notification,
      },
    });
  }

  // Créer une conversation de test
  const conversation = await prisma.conversation.create({
    data: {
      tenantId: testTenant.id,
      title: 'Équipe Agence Principale',
      type: 'GROUP',
      createdById: pressingAdmin.id,
    },
  });

  // Ajouter des participants à la conversation
  const participants = [pressingAdmin, agent, collector];
  for (const participant of participants) {
    await prisma.conversationParticipant.create({
      data: {
        conversationId: conversation.id,
        userId: participant.id,
        isAdmin: participant.id === pressingAdmin.id,
      },
    });
  }

  // Créer des messages de test
  const messages = [
    {
      conversationId: conversation.id,
      senderId: pressingAdmin.id,
      content: 'Bonjour l\'équipe, comment se passe la journée ?',
    },
    {
      conversationId: conversation.id,
      senderId: agent.id,
      content: 'Tout va bien, nous avons reçu 5 nouvelles commandes ce matin',
    },
    {
      conversationId: conversation.id,
      senderId: collector.id,
      content: 'Parfait ! Je vais commencer les livraisons dans 30 minutes',
    },
  ];

  for (const message of messages) {
    await prisma.message.create({
      data: {
        ...message,
      },
    });
  }

  // Créer les paramètres de fidélité
  await prisma.loyaltySettings.create({
    data: {
      tenantId: testTenant.id,
      isActive: true,
      pointsPerCurrency: 1.0,
      currencyPerPoint: 100.0,
      minimumPointsForRedeem: 100,
      expiryMonths: 12,
      welcomeBonus: 50,
      birthdayBonus: 100,
      tiers: [
        {
          name: 'Bronze',
          pointsRequired: 0,
          discount: 0,
          color: '#CD7F32',
          benefits: ['Accès aux offres spéciales']
        },
        {
          name: 'Argent',
          pointsRequired: 500,
          discount: 5,
          color: '#C0C0C0',
          benefits: ['5% de réduction', 'Livraison gratuite']
        },
        {
          name: 'Or',
          pointsRequired: 1000,
          discount: 10,
          color: '#FFD700',
          benefits: ['10% de réduction', 'Livraison gratuite', 'Service prioritaire']
        },
        {
          name: 'Platine',
          pointsRequired: 2000,
          discount: 15,
          color: '#E5E4E2',
          benefits: ['15% de réduction', 'Livraison gratuite', 'Service prioritaire', 'Nettoyage gratuit']
        }
      ],
      rules: [
        '1 point par FCFA dépensé',
        'Points valables 12 mois',
        'Minimum 100 points pour rachat',
        'Bonus de bienvenue: 50 points',
        'Bonus anniversaire: 100 points'
      ],
    },
  });

  console.log('✅ Seeding terminé avec succès!');
  console.log('👤 Comptes créés:');
  console.log('   - Super Admin: admin@e6wash.com / admin123');
  console.log('   - Admin Pressing: pressing@e6wash.com / pressing123');
  console.log('   - Agent: agent@e6wash.com / agent123');
  console.log('   - Collecteur: collector@e6wash.com / collector123');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
