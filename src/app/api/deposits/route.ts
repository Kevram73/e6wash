import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Récupérer l'utilisateur actuel pour obtenir son tenantId
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tenantId: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const filters: any = {
      tenantId: currentUser.tenantId // Toujours filtrer par tenant de l'utilisateur connecté
    };
    
    // Les autres filtres sont autorisés
    if (searchParams.get('agencyId')) {
      filters.agencyId = searchParams.get('agencyId');
    }
    if (searchParams.get('customerId')) {
      filters.customerId = searchParams.get('customerId');
    }
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status');
    }
    if (searchParams.get('paymentStatus')) {
      filters.paymentStatus = searchParams.get('paymentStatus');
    }

    const [deposits, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: limit,
        where: {
          ...filters,
          deletedAt: null
        },
        include: {
          customer: {
            select: {
              id: true,
              fullname: true,
              phone: true,
              email: true
            }
          },
          agency: {
            select: {
              id: true,
              name: true
            }
          },
          tenant: {
            select: {
              id: true,
              name: true
            }
          },
          items: {
            include: {
              service: {
                select: {
                  name: true,
                  type: true,
                  category: true
                }
              }
            }
          },
          payments: true,
          createdBy: {
            select: {
              id: true,
              fullname: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.order.count({
        where: {
          ...filters,
          deletedAt: null
        }
      })
    ]);

    // Transformer les données pour correspondre à l'interface Deposit
    const transformedDeposits = deposits.map(order => ({
      id: order.id,
      depositNumber: order.orderNumber,
      customerId: order.customerId,
      customerName: order.customer.fullname,
      customerPhone: order.customer.phone,
      customerEmail: order.customer.email,
      agencyId: order.agencyId,
      agencyName: order.agency.name,
      tenantId: order.tenantId,
      tenantName: order.tenant.name,
      
      collectionAddress: order.customer.address || '',
      collectionDate: order.pickupDate || order.createdAt,
      collectionTime: '09:00', // Valeur par défaut
      collectionNotes: order.notes,
      
      deliveryAddress: order.customer.address || '',
      deliveryDate: order.deliveryDate,
      deliveryTime: '17:00', // Valeur par défaut
      deliveryNotes: order.notes,
      
      items: order.items.map(item => ({
        id: item.id,
        name: item.name,
        category: item.service.category,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
        description: item.notes,
        status: 'PENDING' as const
      })),
      
      subtotal: Number(order.totalAmount),
      discountAmount: Number(order.discountAmount),
      taxAmount: Number(order.taxAmount),
      totalAmount: Number(order.totalAmount),
      paidAmount: order.payments.reduce((sum, payment) => sum + Number(payment.amount), 0),
      remainingAmount: Number(order.totalAmount) - order.payments.reduce((sum, payment) => sum + Number(payment.amount), 0),
      
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      
      createdById: order.createdById || '',
      createdByName: order.createdBy?.fullname || '',
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      
      receipts: [] // Les reçus seront chargés séparément
    }));

    return NextResponse.json({
      success: true,
      data: {
        deposits: transformedDeposits,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Erreur API deposits:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Récupérer l'utilisateur actuel pour obtenir son tenantId
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tenantId: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const body = await request.json();
    
    // Créer la commande (qui représente un dépôt)
    const order = await prisma.order.create({
      data: {
        tenantId: currentUser.tenantId, // Utiliser le tenantId de l'utilisateur connecté
        agencyId: body.agencyId,
        customerId: body.customerId,
        orderNumber: `DEP-${Date.now()}`,
        totalAmount: body.totalAmount,
        discountAmount: body.discountAmount || 0,
        taxAmount: body.taxAmount || 0,
        status: 'NEW',
        paymentStatus: 'PENDING',
        paymentMethod: body.paymentMethod,
        notes: body.collectionNotes || body.deliveryNotes,
        pickupDate: body.collectionDate,
        deliveryDate: body.deliveryDate,
        createdById: session.user.id // Utiliser l'ID de l'utilisateur connecté
      },
      include: {
        customer: true,
        agency: true,
        tenant: true,
        createdBy: true
      }
    });

    // Créer les articles de la commande
    if (body.items && body.items.length > 0) {
      await Promise.all(
        body.items.map((item: any) =>
          prisma.orderItem.create({
            data: {
              orderId: order.id,
              serviceId: item.serviceId || 'default-service',
              name: item.name,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              category: item.category,
              notes: item.description
            }
          })
        )
      );
    }

    // Créer le paiement si un montant est payé
    if (body.paidAmount > 0) {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          agencyId: body.agencyId,
          userId: session.user.id, // Utiliser l'ID de l'utilisateur connecté
          amount: body.paidAmount,
          method: body.paymentMethod || 'CASH',
          status: body.paidAmount >= body.totalAmount ? 'PAID' : 'PARTIAL',
          notes: 'Paiement initial'
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Dépôt créé avec succès',
      data: order
    });
  } catch (error) {
    console.error('Erreur création deposit:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du dépôt' },
      { status: 500 }
    );
  }
}
