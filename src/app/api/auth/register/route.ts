import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { RegistrationFormData } from '@/lib/types/registration';

export async function POST(request: NextRequest) {
  try {
    const body: RegistrationFormData = await request.json();

    // Validation des données
    if (!body.ownerEmail || !body.ownerPassword || !body.businessName) {
      return NextResponse.json(
        { error: 'Données manquantes' },
        { status: 400 }
      );
    }

    if (body.ownerPassword !== body.confirmPassword) {
      return NextResponse.json(
        { error: 'Les mots de passe ne correspondent pas' },
        { status: 400 }
      );
    }

    if (!body.acceptTerms || !body.acceptPrivacy) {
      return NextResponse.json(
        { error: 'Vous devez accepter les conditions d\'utilisation' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: body.ownerEmail }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Vérifier si le nom d'entreprise existe déjà
    const existingTenant = await prisma.tenant.findFirst({
      where: { name: body.businessName }
    });

    if (existingTenant) {
      return NextResponse.json(
        { error: 'Un pressing avec ce nom existe déjà' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(body.ownerPassword, 12);

    // Créer le tenant (entreprise)
    const tenant = await prisma.tenant.create({
      data: {
        name: body.businessName,
        subdomain: body.businessName.toLowerCase().replace(/\s+/g, '-'),
        status: 'ACTIVE',
        settings: {
          businessType: body.businessType,
          registrationNumber: body.businessRegistrationNumber,
          address: body.businessAddress,
          city: body.businessCity,
          country: body.businessCountry,
          phone: body.businessPhone,
          email: body.businessEmail,
          website: body.businessWebsite,
          bankName: body.bankName,
          bankAccountNumber: body.bankAccountNumber,
          bankAccountHolder: body.bankAccountHolder,
          subscriptionPlan: body.subscriptionPlan,
          pressingType: body.pressingType,
        }
      }
    });

    // Créer l'utilisateur propriétaire
    const user = await prisma.user.create({
      data: {
        fullname: `${body.ownerFirstName} ${body.ownerLastName}`,
        email: body.ownerEmail,
        phone: body.ownerPhone,
        password: hashedPassword,
        role: 'OWNER',
        isActive: true,
        tenantId: tenant.id,
        emailVerified: null,
      }
    });

    // Créer l'agence principale
    const agency = await prisma.agency.create({
      data: {
        name: `${body.businessName} - Agence Principale`,
        address: body.businessAddress,
        city: body.businessCity,
        phone: body.businessPhone,
        email: body.businessEmail,
        code: `AG${Date.now().toString().slice(-6)}`, // Code unique pour l'agence
        isActive: true,
        tenantId: tenant.id,
        isMainAgency: true,
      }
    });

    // Créer les services
    // const services = await Promise.all(
    //   body.services.map(service =>
    //     prisma.service.create({
    //       data: {
    //         name: service.name,
    //         type: service.type,
    //         category: service.category,
    //         description: service.description,
    //         price: service.price,
    //         isActive: service.isActive,
    //         tenantId: tenant.id,
    //       }
    //     })
    //   )
    // );

    // Créer les paramètres de fidélité par défaut
    // await prisma.loyaltySettings.create({
    //   data: {
    //     tenantId: tenant.id,
    //     isActive: true,
    //     pointsPerCurrency: 1.0,
    //     currencyPerPoint: 100.0,
    //     minimumPointsForRedeem: 100,
    //     expiryMonths: 12,
    //     welcomeBonus: 0,
    //     birthdayBonus: 0,
    //     tiers: [
    //       {
    //         name: 'Bronze',
    //         minPoints: 0,
    //         maxPoints: 999,
    //         benefits: ['Accès aux promotions de base']
    //       },
    //       {
    //         name: 'Argent',
    //         minPoints: 1000,
    //         maxPoints: 4999,
    //         benefits: ['5% de réduction', 'Livraison gratuite']
    //       },
    //       {
    //         name: 'Or',
    //         minPoints: 5000,
    //         maxPoints: 9999,
    //         benefits: ['10% de réduction', 'Livraison gratuite', 'Service prioritaire']
    //       },
    //       {
    //         name: 'Platine',
    //         minPoints: 10000,
    //         maxPoints: -1,
    //         benefits: ['15% de réduction', 'Livraison gratuite', 'Service prioritaire', 'Accès VIP']
    //       }
    //     ]
    //   }
    // });

    // Créer un template de reçu par défaut
    // await prisma.receiptTemplate.create({
    //   data: {
    //     name: 'Template Standard',
    //     type: 'DEPOSIT',
    //     format: 'A4',
    //     template: `
    //       <div class="receipt-template">
    //         <h1>{{tenantName}}</h1>
    //         <h2>REÇU DE DÉPÔT</h2>
    //         <p>N° {{depositNumber}}</p>
    //         <p>Date: {{date}}</p>
    //         <h3>Client: {{customerName}}</h3>
    //         <h3>Articles:</h3>
    //         {{#each items}}
    //           <p>{{name}} - {{quantity}}x {{price}} = {{total}}</p>
    //         {{/each}}
    //         <h3>Total: {{totalAmount}}</h3>
    //         <p>Merci pour votre confiance!</p>
    //       </div>
    //     `,
    //     isActive: true,
    //     tenantId: tenant.id,
    //   }
    // });

    // Générer un token d'activation (optionnel)
    const activationToken = `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès',
      data: {
        tenantId: tenant.id,
        userId: user.id,
        agencyId: agency.id,
        activationToken,
        services: body.services.length
      }
    });

  } catch (error) {
    console.error('Erreur inscription:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte' },
      { status: 500 }
    );
  }
}