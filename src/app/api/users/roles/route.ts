import { NextRequest, NextResponse } from 'next/server';
import { PREDEFINED_ROLES } from '@/lib/types/user-management';

export async function GET(request: NextRequest) {
  try {
    // Retourner les rôles prédéfinis
    return NextResponse.json({
      success: true,
      data: PREDEFINED_ROLES
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des rôles:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des rôles' },
      { status: 500 }
    );
  }
}
