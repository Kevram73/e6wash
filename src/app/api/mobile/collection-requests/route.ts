import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const collectionRequestSchema = z.object({
  customerId: z.string(),
  tenantId: z.string(),
  collectionAddress: z.string().min(5),
  collectionDate: z.string(), // ISO date string
  collectionTime: z.string(), // HH:MM format
  collectionNotes: z.string().optional(),
  items: z.array(z.object({
    name: z.string(),
    category: z.string(),
    estimatedWeight: z.number().optional(),
    description: z.string().optional()
  })).min(1),
  promoCode: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation des données
    const validatedData = collectionRequestSchema.parse(body);
    
    // Vérifier que le client existe
    const customer = await prisma.customer.findUnique({
      where: { id: validatedData.customerId },
      include: { tenant: true }
    });
    
    if (!customer) {
      return NextResponse.json(
        { error: 'Client non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier le code promo si fourni
    let promoDiscount = 0;
    if (validatedData.promoCode) {
      const promo = await prisma.promo.findFirst({
        where: {
          code: validatedData.promoCode,
          tenantId: validatedData.tenantId,
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() }
        }
      });
      
      if (promo) {
        // Calculer la remise (simplifié)
        promoDiscount = promo.discountType === 'PERCENTAGE' 
          ? (promo.discountValue / 100) * 1000 // Estimation basée sur 1000 FCFA
          : promo.discountValue;
      }
    }
    
    // Créer la demande de collecte
    const collectionRequest = await prisma.collectionRequest.create({
      data: {
        tenantId: validatedData.tenantId,
        customerId: validatedData.customerId,
        collectionAddress: validatedData.collectionAddress,
        collectionDate: new Date(validatedData.collectionDate),
        collectionTime: validatedData.collectionTime,
        collectionNotes: validatedData.collectionNotes,
        status: 'PENDING',
        promoCode: validatedData.promoCode,
        promoDiscount: promoDiscount,
        estimatedItems: validatedData.items.length,
        items: validatedData.items // Stocker les articles estimés
      }
    });
    
    // Créer les articles de la demande
    await Promise.all(
      validatedData.items.map((item, index) =>
        prisma.collectionRequestItem.create({
          data: {
            collectionRequestId: collectionRequest.id,
            name: item.name,
            category: item.category,
            estimatedWeight: item.estimatedWeight,
            description: item.description,
            order: index + 1
          }
        })
      )
    );
    
    return NextResponse.json({
      success: true,
      message: 'Demande de collecte créée avec succès',
      data: {
        requestId: collectionRequest.id,
        status: collectionRequest.status,
        collectionDate: collectionRequest.collectionDate,
        collectionTime: collectionRequest.collectionTime,
        estimatedItems: collectionRequest.estimatedItems
      }
    });
    
  } catch (error) {
    console.error('Erreur création demande collecte:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la création de la demande' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const tenantId = searchParams.get('tenantId');
    
    if (!customerId || !tenantId) {
      return NextResponse.json(
        { error: 'customerId et tenantId requis' },
        { status: 400 }
      );
    }
    
    const requests = await prisma.collectionRequest.findMany({
      where: {
        customerId: customerId,
        tenantId: tenantId
      },
      include: {
        items: true,
        assignedCollector: {
          select: {
            id: true,
            fullname: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({
      success: true,
      data: requests
    });
    
  } catch (error) {
    console.error('Erreur récupération demandes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des demandes' },
      { status: 500 }
    );
  }
}
