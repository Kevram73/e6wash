import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Schéma de validation pour la mise à jour d'une promotion
const updatePromotionSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  type: z.enum(['percentage', 'fixed_amount', 'free_delivery', 'buy_one_get_one']).optional(),
  value: z.number().min(0).optional(),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
  usageLimit: z.number().min(1).optional(),
  applicableServices: z.array(z.string()).optional(),
});

// GET /api/promotions/[id] - Récupérer une promotion par ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const promotion = await prisma.promotion.findUnique({
      where: { id: params.id },
    });

    if (!promotion) {
      return NextResponse.json(
        { success: false, error: 'Promotion non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: promotion,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la promotion:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération de la promotion' },
      { status: 500 }
    );
  }
}

// PUT /api/promotions/[id] - Mettre à jour une promotion
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Valider les données
    const validatedData = updatePromotionSchema.parse(body);

    // Vérifier que la promotion existe
    const existingPromotion = await prisma.promotion.findUnique({
      where: { id: params.id },
    });

    if (!existingPromotion) {
      return NextResponse.json(
        { success: false, error: 'Promotion non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier les dates si elles sont fournies
    const startDate = validatedData.startDate || existingPromotion.startDate;
    const endDate = validatedData.endDate || existingPromotion.endDate;

    if (new Date(endDate) <= new Date(startDate)) {
      return NextResponse.json(
        { success: false, error: 'La date de fin doit être après la date de début' },
        { status: 400 }
      );
    }

    // Mettre à jour la promotion
    const promotion = await prisma.promotion.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      data: promotion,
      message: 'Promotion mise à jour avec succès',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Données invalides', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Erreur lors de la mise à jour de la promotion:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour de la promotion' },
      { status: 500 }
    );
  }
}

// DELETE /api/promotions/[id] - Supprimer une promotion
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier que la promotion existe
    const existingPromotion = await prisma.promotion.findUnique({
      where: { id: params.id },
    });

    if (!existingPromotion) {
      return NextResponse.json(
        { success: false, error: 'Promotion non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer la promotion
    await prisma.promotion.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Promotion supprimée avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la promotion:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression de la promotion' },
      { status: 500 }
    );
  }
}
