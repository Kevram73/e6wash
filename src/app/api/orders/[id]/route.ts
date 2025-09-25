// API Route pour une commande spécifique

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Mock data (en production, ceci viendrait d'une base de données)
const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-20240923-001',
    customerId: '1',
    customerName: 'Jean Dupont',
    customerPhone: '+237 6XX XXX XXX',
    serviceId: '1',
    serviceName: 'Pressing au Kilo',
    status: 'pending',
    totalAmount: 15000,
    paymentMethod: 'mobile_money',
    paymentStatus: 'pending',
    collectionType: 'pickup',
    collectionDate: '2024-09-23T10:00:00',
    estimatedDelivery: '2024-09-24T18:00:00',
    createdAt: '2024-09-23T09:30:00',
    updatedAt: '2024-09-23T09:30:00',
  },
  {
    id: '2',
    orderNumber: 'ORD-20240922-002',
    customerId: '2',
    customerName: 'Marie Claire',
    customerPhone: '+237 6XX XXX XXX',
    serviceId: '2',
    serviceName: 'Nettoyage à Sec',
    status: 'in_progress',
    totalAmount: 25000,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    collectionType: 'dropoff',
    collectionDate: '2024-09-22T14:00:00',
    estimatedDelivery: '2024-09-25T12:00:00',
    createdAt: '2024-09-22T11:00:00',
    updatedAt: '2024-09-22T11:00:00',
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const order = mockOrders.find(o => o.id === params.id);
    
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Erreur API order:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const orderIndex = mockOrders.findIndex(o => o.id === params.id);
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour la commande
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: mockOrders[orderIndex],
      message: 'Commande mise à jour avec succès',
    });
  } catch (error) {
    console.error('Erreur mise à jour order:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour de la commande' },
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
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const orderIndex = mockOrders.findIndex(o => o.id === params.id);
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Commande non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer la commande
    mockOrders.splice(orderIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Commande supprimée avec succès',
    });
  } catch (error) {
    console.error('Erreur suppression order:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression de la commande' },
      { status: 500 }
    );
  }
}