import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Schéma de validation pour la création d'un plan d'abonnement
const createSubscriptionPlanSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().min(1, 'La description est requise'),
  price: z.number().min(0, 'Le prix doit être positif'),
  currency: z.string().default('XAF'),
  billingCycle: z.enum(['MONTHLY', 'YEARLY']),
  features: z.array(z.string()),
  maxUsers: z.number().min(1, 'Le nombre maximum d\'utilisateurs doit être au moins 1'),
  maxAgences: z.number().min(1, 'Le nombre maximum d\'agences doit être au moins 1'),
  maxOrders: z.number().min(0, 'Le nombre maximum de commandes doit être positif'),
  isPopular: z.boolean().default(false),
});

// GET /api/subscriptions/plans - Récupérer tous les plans d'abonnement
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const isActive = searchParams.get('isActive');

    const skip = (page - 1) * limit;

    // Construire les filtres
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isActive !== null && isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    // Récupérer les plans
    const [plans, total] = await Promise.all([
      prisma.subscriptionPlan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { price: 'asc' },
      }),
      prisma.subscriptionPlan.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        items: plans,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des plans d\'abonnement:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des plans d\'abonnement' },
      { status: 500 }
    );
  }
}

// POST /api/subscriptions/plans - Créer un nouveau plan d'abonnement
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Valider les données
    const validatedData = createSubscriptionPlanSchema.parse(body);

    // Créer le plan
    const plan = await prisma.subscriptionPlan.create({
      data: {
        ...validatedData,
        isActive: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: plan,
      message: 'Plan d\'abonnement créé avec succès',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Données invalides', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la création du plan d\'abonnement:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création du plan d\'abonnement' },
      { status: 500 }
    );
  }
}
