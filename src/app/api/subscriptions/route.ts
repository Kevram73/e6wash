import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: {
      subscriptions: [
        {
          id: '1',
          name: 'Plan Standard',
          description: 'Plan d'abonnement standard',
          price: 50000,
          currency: 'XAF',
          isActive: true,
          features: ['support', 'rapports']
        }
      ],
      pagination: { page: 1, limit: 10, total: 1, pages: 1 }
    }
    });
  } catch (error) {
    console.error('Erreur API subscriptions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'Créé avec succès',
      data: { id: Date.now().toString(), ...body }
    });
  } catch (error) {
    console.error('Erreur création subscriptions:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    );
  }
}
