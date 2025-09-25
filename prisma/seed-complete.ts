import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding complet...');

  // 1. Créer les pays
  console.log('📍 Création des pays...');
  const countries = await Promise.all([
    prisma.country.upsert({
      where: { code: 'FR' },
      update: {},
      create: {
        code: 'FR',
        name: 'France',
        currency: 'EUR',
        phoneCode: '+33'
      }
    }),
    prisma.country.upsert({
      where: { code: 'CM' },
      update: {},
      create: {
        code: 'CM',
        name: 'Cameroun',
        currency: 'XAF',
        phoneCode: '+237'
      }
    }),
    prisma.country.upsert({
      where: { code: 'SN' },
      update: {},
      create: {
        code: 'SN',
        name: 'Sénégal',
        currency: 'XOF',
        phoneCode: '+221'
      }
    })
  ]);

  // 2. Créer les tenants (pressings)
  console.log('🏢 Création des tenants...');
  const tenants = await Promise.all([
    prisma.tenant.upsert({
      where: { subdomain: 'pressing-central' },
      update: {},
      create: {
        name: 'Pressing Central',
        subdomain: 'pressing-central',
        domain: 'pressing-central.e6wash.com',
        contactEmail: 'contact@pressing-central.com',
        contactPhone: '+33123456789',
        address: {
          street: '123 Rue de la République',
          city: 'Paris',
          postalCode: '75001',
          country: 'France'
        },
        subscriptionPlan: 'PREMIUM',
        subscriptionStatus: 'ACTIVE',
        subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 an
        isActive: true,
        settings: {
          currency: 'EUR',
          timezone: 'Europe/Paris',
          language: 'fr'
        }
      }
    }),
    prisma.tenant.upsert({
      where: { subdomain: 'clean-express' },
      update: {},
      create: {
        name: 'Clean Express',
        subdomain: 'clean-express',
        domain: 'clean-express.e6wash.com',
        contactEmail: 'info@clean-express.com',
        contactPhone: '+33198765432',
        address: {
          street: '456 Avenue des Champs',
          city: 'Lyon',
          postalCode: '69001',
          country: 'France'
        },
        subscriptionPlan: 'BASIC',
        subscriptionStatus: 'ACTIVE',
        subscriptionExpiresAt: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 6 mois
        isActive: true,
        settings: {
          currency: 'EUR',
          timezone: 'Europe/Paris',
          language: 'fr'
        }
      }
    }),
    prisma.tenant.upsert({
      where: { subdomain: 'laverie-pro' },
      update: {},
      create: {
        name: 'Laverie Pro',
        subdomain: 'laverie-pro',
        domain: 'laverie-pro.e6wash.com',
        contactEmail: 'contact@laverie-pro.com',
        contactPhone: '+237123456789',
        address: {
          street: '789 Boulevard du Centenaire',
          city: 'Douala',
          postalCode: '00237',
          country: 'Cameroun'
        },
        subscriptionPlan: 'ENTERPRISE',
        subscriptionStatus: 'ACTIVE',
        subscriptionExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
        settings: {
          currency: 'XAF',
          timezone: 'Africa/Douala',
          language: 'fr'
        }
      }
    })
  ]);

  // 3. Créer les utilisateurs
  console.log('👥 Création des utilisateurs...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = await Promise.all([
    // Super Admin
    prisma.user.upsert({
      where: { email: 'admin@e6wash.com' },
      update: {},
      create: {
        email: 'admin@e6wash.com',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
        isActive: true,
        emailVerified: true
      }
    }),
    // Admin du pressing central
    prisma.user.upsert({
      where: { email: 'admin@pressing-central.com' },
      update: {},
      create: {
        email: 'admin@pressing-central.com',
        password: hashedPassword,
        firstName: 'Jean',
        lastName: 'Martin',
        role: 'ADMIN',
        tenantId: tenants[0].id,
        isActive: true,
        emailVerified: true
      }
    }),
    // Employé du pressing central
    prisma.user.upsert({
      where: { email: 'employe@pressing-central.com' },
      update: {},
      create: {
        email: 'employe@pressing-central.com',
        password: hashedPassword,
        firstName: 'Marie',
        lastName: 'Dubois',
        role: 'EMPLOYEE',
        tenantId: tenants[0].id,
        isActive: true,
        emailVerified: true
      }
    }),
    // Collecteur
    prisma.user.upsert({
      where: { email: 'collecteur@pressing-central.com' },
      update: {},
      create: {
        email: 'collecteur@pressing-central.com',
        password: hashedPassword,
        firstName: 'Pierre',
        lastName: 'Durand',
        role: 'COLLECTOR',
        tenantId: tenants[0].id,
        isActive: true,
        emailVerified: true
      }
    })
  ]);

  // 4. Créer les agences
  console.log('🏪 Création des agences...');
  const agencies = await Promise.all([
    prisma.agency.upsert({
      where: { code: 'AG001' },
      update: {},
      create: {
        name: 'Agence Centre',
        code: 'AG001',
        address: {
          street: '123 Rue de la Paix',
          city: 'Paris',
          postalCode: '75002',
          country: 'France'
        },
        contactPhone: '+33123456780',
        contactEmail: 'centre@pressing-central.com',
        managerId: users[1].id,
        tenantId: tenants[0].id,
        isActive: true,
        services: ['Nettoyage à sec', 'Repassage', 'Blanchisserie'],
        operatingHours: {
          monday: { open: '08:00', close: '18:00' },
          tuesday: { open: '08:00', close: '18:00' },
          wednesday: { open: '08:00', close: '18:00' },
          thursday: { open: '08:00', close: '18:00' },
          friday: { open: '08:00', close: '18:00' },
          saturday: { open: '09:00', close: '17:00' },
          sunday: { open: '10:00', close: '16:00' }
        }
      }
    }),
    prisma.agency.upsert({
      where: { code: 'AG002' },
      update: {},
      create: {
        name: 'Agence Nord',
        code: 'AG002',
        address: {
          street: '456 Avenue du Nord',
          city: 'Paris',
          postalCode: '75018',
          country: 'France'
        },
        contactPhone: '+33123456781',
        contactEmail: 'nord@pressing-central.com',
        managerId: users[1].id,
        tenantId: tenants[0].id,
        isActive: true,
        services: ['Nettoyage à sec', 'Repassage'],
        operatingHours: {
          monday: { open: '08:00', close: '18:00' },
          tuesday: { open: '08:00', close: '18:00' },
          wednesday: { open: '08:00', close: '18:00' },
          thursday: { open: '08:00', close: '18:00' },
          friday: { open: '08:00', close: '18:00' },
          saturday: { open: '09:00', close: '17:00' },
          sunday: { open: '10:00', close: '16:00' }
        }
      }
    })
  ]);

  // 5. Créer les clients
  console.log('👤 Création des clients...');
  const customers = await Promise.all([
    prisma.customer.upsert({
      where: { email: 'marie.dubois@email.com' },
      update: {},
      create: {
        firstName: 'Marie',
        lastName: 'Dubois',
        email: 'marie.dubois@email.com',
        phone: '+33123456789',
        address: {
          street: '789 Rue de la Victoire',
          city: 'Paris',
          postalCode: '75009',
          country: 'France'
        },
        tenantId: tenants[0].id,
        isActive: true,
        loyaltyPoints: 150,
        totalOrders: 12,
        totalSpent: 450.00
      }
    }),
    prisma.customer.upsert({
      where: { email: 'jean.martin@email.com' },
      update: {},
      create: {
        firstName: 'Jean',
        lastName: 'Martin',
        email: 'jean.martin@email.com',
        phone: '+33198765432',
        address: {
          street: '321 Avenue des Champs',
          city: 'Paris',
          postalCode: '75008',
          country: 'France'
        },
        tenantId: tenants[0].id,
        isActive: true,
        loyaltyPoints: 75,
        totalOrders: 8,
        totalSpent: 320.00
      }
    }),
    prisma.customer.upsert({
      where: { email: 'sophie.laurent@email.com' },
      update: {},
      create: {
        firstName: 'Sophie',
        lastName: 'Laurent',
        email: 'sophie.laurent@email.com',
        phone: '+33155555555',
        address: {
          street: '654 Boulevard Saint-Germain',
          city: 'Paris',
          postalCode: '75006',
          country: 'France'
        },
        tenantId: tenants[0].id,
        isActive: true,
        loyaltyPoints: 200,
        totalOrders: 15,
        totalSpent: 680.00
      }
    })
  ]);

  // 6. Créer les services
  console.log('🛠️ Création des services...');
  const services = await Promise.all([
    prisma.service.upsert({
      where: { id: 'svc-001' },
      update: {},
      create: {
        id: 'svc-001',
        name: 'Nettoyage à sec',
        description: 'Nettoyage professionnel à sec pour vêtements délicats',
        price: 15.00,
        category: 'Nettoyage',
        duration: 24, // heures
        tenantId: tenants[0].id,
        isActive: true,
        features: ['Nettoyage professionnel', 'Repassage inclus', 'Emballage protecteur'],
        popularity: 85
      }
    }),
    prisma.service.upsert({
      where: { id: 'svc-002' },
      update: {},
      create: {
        id: 'svc-002',
        name: 'Repassage',
        description: 'Repassage professionnel de tous types de vêtements',
        price: 8.00,
        category: 'Repassage',
        duration: 2,
        tenantId: tenants[0].id,
        isActive: true,
        features: ['Repassage professionnel', 'Plis parfaits', 'Livraison rapide'],
        popularity: 70
      }
    }),
    prisma.service.upsert({
      where: { id: 'svc-003' },
      update: {},
      create: {
        id: 'svc-003',
        name: 'Blanchisserie',
        description: 'Service de blanchisserie complet',
        price: 12.00,
        category: 'Blanchisserie',
        duration: 48,
        tenantId: tenants[0].id,
        isActive: true,
        features: ['Lavage professionnel', 'Séchage', 'Repassage'],
        popularity: 60
      }
    })
  ]);

  // 7. Créer les commandes
  console.log('📦 Création des commandes...');
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        orderNumber: 'ORD-001',
        customerId: customers[0].id,
        tenantId: tenants[0].id,
        agencyId: agencies[0].id,
        status: 'COMPLETED',
        totalAmount: 45.00,
        pickupDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 jours
        deliveryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 jour
        notes: 'Vêtements délicats, attention particulière',
        items: {
          create: [
            {
              serviceId: services[0].id,
              quantity: 2,
              unitPrice: 15.00,
              totalPrice: 30.00,
              description: 'Costume homme - Nettoyage à sec'
            },
            {
              serviceId: services[1].id,
              quantity: 1,
              unitPrice: 8.00,
              totalPrice: 8.00,
              description: 'Chemise - Repassage'
            }
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-002',
        customerId: customers[1].id,
        tenantId: tenants[0].id,
        agencyId: agencies[0].id,
        status: 'IN_PROGRESS',
        totalAmount: 32.00,
        pickupDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        deliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        notes: 'Livraison urgente demandée',
        items: {
          create: [
            {
              serviceId: services[2].id,
              quantity: 1,
              unitPrice: 12.00,
              totalPrice: 12.00,
              description: 'Linge de maison - Blanchisserie'
            },
            {
              serviceId: services[1].id,
              quantity: 2,
              unitPrice: 8.00,
              totalPrice: 16.00,
              description: 'Chemises - Repassage'
            }
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        orderNumber: 'ORD-003',
        customerId: customers[2].id,
        tenantId: tenants[0].id,
        agencyId: agencies[1].id,
        status: 'PENDING',
        totalAmount: 28.00,
        pickupDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        notes: 'Première commande',
        items: {
          create: [
            {
              serviceId: services[0].id,
              quantity: 1,
              unitPrice: 15.00,
              totalPrice: 15.00,
              description: 'Robe - Nettoyage à sec'
            },
            {
              serviceId: services[1].id,
              quantity: 1,
              unitPrice: 8.00,
              totalPrice: 8.00,
              description: 'Blouse - Repassage'
            }
          ]
        }
      }
    })
  ]);

  // 8. Créer les tâches
  console.log('📋 Création des tâches...');
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Collecte commande ORD-001',
        description: 'Collecter la commande ORD-001 chez le client Marie Dubois',
        type: 'COLLECTION',
        status: 'COMPLETED',
        priority: 'HIGH',
        assignedToId: users[3].id, // Collecteur
        tenantId: tenants[0].id,
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        orderId: orders[0].id
      }
    }),
    prisma.task.create({
      data: {
        title: 'Traitement commande ORD-002',
        description: 'Traiter la commande ORD-002 - Blanchisserie et repassage',
        type: 'PROCESSING',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        assignedToId: users[2].id, // Employé
        tenantId: tenants[0].id,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        orderId: orders[1].id
      }
    }),
    prisma.task.create({
      data: {
        title: 'Livraison commande ORD-001',
        description: 'Livrer la commande ORD-001 au client',
        type: 'DELIVERY',
        status: 'PENDING',
        priority: 'HIGH',
        assignedToId: users[3].id, // Collecteur
        tenantId: tenants[0].id,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        orderId: orders[0].id
      }
    })
  ]);

  // 9. Créer l'inventaire
  console.log('📦 Création de l\'inventaire...');
  const inventory = await Promise.all([
    prisma.inventory.create({
      data: {
        name: 'Détergent professionnel',
        category: 'Produits de nettoyage',
        quantity: 50,
        unit: 'LITRE',
        unitPrice: 25.00,
        supplier: 'CleanPro Solutions',
        tenantId: tenants[0].id,
        minStock: 10,
        maxStock: 100,
        location: 'Entrepôt A - Étagère 1'
      }
    }),
    prisma.inventory.create({
      data: {
        name: 'Cintres métalliques',
        category: 'Accessoires',
        quantity: 200,
        unit: 'PIECE',
        unitPrice: 2.50,
        supplier: 'Hanger Plus',
        tenantId: tenants[0].id,
        minStock: 50,
        maxStock: 500,
        location: 'Entrepôt B - Étagère 3'
      }
    }),
    prisma.inventory.create({
      data: {
        name: 'Sacs de protection',
        category: 'Emballage',
        quantity: 1000,
        unit: 'PIECE',
        unitPrice: 0.50,
        supplier: 'PackPro',
        tenantId: tenants[0].id,
        minStock: 200,
        maxStock: 2000,
        location: 'Entrepôt A - Étagère 2'
      }
    })
  ]);

  // 10. Créer les notifications
  console.log('🔔 Création des notifications...');
  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        title: 'Nouvelle commande reçue',
        message: 'La commande ORD-003 a été créée par Sophie Laurent',
        type: 'ORDER_CREATED',
        userId: users[1].id, // Admin
        tenantId: tenants[0].id,
        isRead: false,
        data: {
          orderId: orders[2].id,
          customerName: 'Sophie Laurent'
        }
      }
    }),
    prisma.notification.create({
      data: {
        title: 'Stock faible',
        message: 'Le stock de détergent professionnel est faible (10L restants)',
        type: 'LOW_STOCK',
        userId: users[1].id, // Admin
        tenantId: tenants[0].id,
        isRead: false,
        data: {
          inventoryId: inventory[0].id,
          currentStock: 10,
          minStock: 10
        }
      }
    }),
    prisma.notification.create({
      data: {
        title: 'Tâche assignée',
        message: 'Une nouvelle tâche de collecte vous a été assignée',
        type: 'TASK_ASSIGNED',
        userId: users[3].id, // Collecteur
        tenantId: tenants[0].id,
        isRead: true,
        data: {
          taskId: tasks[2].id,
          taskTitle: 'Livraison commande ORD-001'
        }
      }
    })
  ]);

  // 11. Créer les conversations
  console.log('💬 Création des conversations...');
  const conversations = await Promise.all([
    prisma.conversation.create({
      data: {
        title: 'Support Client - Marie Dubois',
        type: 'SUPPORT',
        tenantId: tenants[0].id,
        participants: {
          create: [
            {
              userId: customers[0].id,
              role: 'CUSTOMER'
            },
            {
              userId: users[1].id,
              role: 'SUPPORT'
            }
          ]
        },
        messages: {
          create: [
            {
              content: 'Bonjour, j\'aimerais savoir l\'état de ma commande ORD-001',
              senderId: customers[0].id,
              senderType: 'CUSTOMER'
            },
            {
              content: 'Bonjour Marie, votre commande est prête et sera livrée demain matin.',
              senderId: users[1].id,
              senderType: 'USER'
            }
          ]
        }
      }
    }),
    prisma.conversation.create({
      data: {
        title: 'Demande de service - Jean Martin',
        type: 'SERVICE_REQUEST',
        tenantId: tenants[0].id,
        participants: {
          create: [
            {
              userId: customers[1].id,
              role: 'CUSTOMER'
            },
            {
              userId: users[2].id,
              role: 'EMPLOYEE'
            }
          ]
        },
        messages: {
          create: [
            {
              content: 'Bonjour, je souhaiterais un devis pour nettoyer un costume de mariage',
              senderId: customers[1].id,
              senderType: 'CUSTOMER'
            }
          ]
        }
      }
    })
  ]);

  // 12. Créer les promotions
  console.log('🎯 Création des promotions...');
  const promotions = await Promise.all([
    prisma.promotion.create({
      data: {
        title: 'Offre Nouveau Client',
        description: '20% de réduction sur votre première commande',
        code: 'WELCOME20',
        type: 'PERCENTAGE',
        value: 20,
        minOrderAmount: 30.00,
        maxDiscount: 50.00,
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 jours
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
        tenantId: tenants[0].id,
        isActive: true,
        usageLimit: 100,
        usedCount: 15
      }
    }),
    prisma.promotion.create({
      data: {
        title: 'Fidélité Premium',
        description: '10€ de réduction pour les clients fidèles',
        code: 'LOYALTY10',
        type: 'FIXED',
        value: 10.00,
        minOrderAmount: 50.00,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 jours
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours
        tenantId: tenants[0].id,
        isActive: true,
        usageLimit: 50,
        usedCount: 8
      }
    })
  ]);

  // 13. Créer les groupes de fidélité
  console.log('⭐ Création des groupes de fidélité...');
  const loyaltyGroups = await Promise.all([
    prisma.loyaltyGroup.create({
      data: {
        name: 'Bronze',
        description: 'Niveau d\'entrée',
        minPoints: 0,
        maxPoints: 99,
        discountPercentage: 5,
        tenantId: tenants[0].id,
        isActive: true
      }
    }),
    prisma.loyaltyGroup.create({
      data: {
        name: 'Argent',
        description: 'Niveau intermédiaire',
        minPoints: 100,
        maxPoints: 299,
        discountPercentage: 10,
        tenantId: tenants[0].id,
        isActive: true
      }
    }),
    prisma.loyaltyGroup.create({
      data: {
        name: 'Or',
        description: 'Niveau premium',
        minPoints: 300,
        maxPoints: 999,
        discountPercentage: 15,
        tenantId: tenants[0].id,
        isActive: true
      }
    }),
    prisma.loyaltyGroup.create({
      data: {
        name: 'Platine',
        description: 'Niveau VIP',
        minPoints: 1000,
        maxPoints: 9999,
        discountPercentage: 20,
        tenantId: tenants[0].id,
        isActive: true
      }
    })
  ]);

  // 14. Créer les abonnements
  console.log('💳 Création des abonnements...');
  const subscriptions = await Promise.all([
    prisma.subscription.create({
      data: {
        name: 'Plan Basique',
        description: 'Plan d\'entrée pour petits pressings',
        price: 29.99,
        billingCycle: 'MONTHLY',
        features: {
          maxUsers: 5,
          maxAgencies: 2,
          maxOrders: 100,
          support: 'EMAIL'
        },
        isActive: true,
        tenantId: tenants[1].id // Clean Express
      }
    }),
    prisma.subscription.create({
      data: {
        name: 'Plan Premium',
        description: 'Plan complet pour pressings moyens',
        price: 79.99,
        billingCycle: 'MONTHLY',
        features: {
          maxUsers: 15,
          maxAgencies: 5,
          maxOrders: 500,
          support: 'PRIORITY'
        },
        isActive: true,
        tenantId: tenants[0].id // Pressing Central
      }
    }),
    prisma.subscription.create({
      data: {
        name: 'Plan Entreprise',
        description: 'Plan avancé pour grandes chaînes',
        price: 199.99,
        billingCycle: 'MONTHLY',
        features: {
          maxUsers: 50,
          maxAgencies: 20,
          maxOrders: 2000,
          support: 'DEDICATED'
        },
        isActive: true,
        tenantId: tenants[2].id // Laverie Pro
      }
    })
  ]);

  console.log('✅ Seeding complet terminé avec succès!');
  console.log(`📊 Données créées:`);
  console.log(`   - ${countries.length} pays`);
  console.log(`   - ${tenants.length} tenants`);
  console.log(`   - ${users.length} utilisateurs`);
  console.log(`   - ${agencies.length} agences`);
  console.log(`   - ${customers.length} clients`);
  console.log(`   - ${services.length} services`);
  console.log(`   - ${orders.length} commandes`);
  console.log(`   - ${tasks.length} tâches`);
  console.log(`   - ${inventory.length} articles d'inventaire`);
  console.log(`   - ${notifications.length} notifications`);
  console.log(`   - ${conversations.length} conversations`);
  console.log(`   - ${promotions.length} promotions`);
  console.log(`   - ${loyaltyGroups.length} groupes de fidélité`);
  console.log(`   - ${subscriptions.length} abonnements`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
