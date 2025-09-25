import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const countries = await prisma.country.findMany({
      orderBy: { name: 'asc' }
    });

    return NextResponse.json({
      success: true,
      data: {
        countries,
        pagination: { page: 1, limit: countries.length, total: countries.length, pages: 1 }
      }
    });
  } catch (error) {
    console.error('Erreur API countries:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const country = await prisma.country.create({
      data: {
        name: body.name,
        code: body.code
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Pays créé avec succès',
      data: country
    });
  } catch (error) {
    console.error('Erreur création countries:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du pays' },
      { status: 500 }
    );
  }
}
