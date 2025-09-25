import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateLoyaltySettingsSchema = z.object({
  isActive: z.boolean().optional(),
  pointsPerCurrency: z.number().min(0).optional(),
  currencyPerPoint: z.number().min(0).optional(),
  minimumPointsForRedeem: z.number().min(0).optional(),
  expiryMonths: z.number().min(1).optional(),
  welcomeBonus: z.number().min(0).optional(),
  birthdayBonus: z.number().min(0).optional(),
  tiers: z.array(z.any()).optional(),
  rules: z.array(z.string()).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const settings = await prisma.loyaltySettings.findUnique({
      where: { id: params.id },
    });

    if (!settings) {
      return NextResponse.json(
        { error: 'Paramètres de fidélité non trouvés' },
        { status: 404 }
      );
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Erreur lors de la récupération des paramètres de fidélité:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateLoyaltySettingsSchema.parse(body);

    // Vérifier si les paramètres existent
    const existingSettings = await prisma.loyaltySettings.findUnique({
      where: { id: params.id },
    });

    if (!existingSettings) {
      return NextResponse.json(
        { error: 'Paramètres de fidélité non trouvés' },
        { status: 404 }
      );
    }

    // Mettre à jour les paramètres
    const settings = await prisma.loyaltySettings.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json({
      message: 'Paramètres de fidélité mis à jour avec succès',
      settings,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des paramètres de fidélité:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Vérifier si les paramètres existent
    const existingSettings = await prisma.loyaltySettings.findUnique({
      where: { id: params.id },
    });

    if (!existingSettings) {
      return NextResponse.json(
        { error: 'Paramètres de fidélité non trouvés' },
        { status: 404 }
      );
    }

    // Supprimer les paramètres
    await prisma.loyaltySettings.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      message: 'Paramètres de fidélité supprimés avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression des paramètres de fidélité:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
