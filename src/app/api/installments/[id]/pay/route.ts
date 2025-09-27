import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { amount, method, notes } = body;

    // Vérifier que l'échéance existe
    const installment = await prisma.paymentInstallment.findUnique({
      where: { id },
      include: {
        deposit: {
          include: {
            customer: true,
            agency: true
          }
        }
      }
    });

    if (!installment) {
      return NextResponse.json(
        { error: 'Échéance non trouvée' },
        { status: 404 }
      );
    }

    if (installment.status === 'PAID') {
      return NextResponse.json(
        { error: 'Cette échéance est déjà payée' },
        { status: 400 }
      );
    }

    // Enregistrer le paiement
    const payment = await prisma.payment.create({
      data: {
        orderId: installment.depositId,
        agencyId: installment.deposit.agencyId,
        userId: 'system', // À remplacer par l'ID de l'utilisateur connecté
        amount: amount,
        method: method,
        status: amount >= installment.amount ? 'PAID' : 'PARTIAL',
        notes: notes || `Paiement échéance ${installment.installmentNumber}`,
        installmentId: id
      }
    });

    // Mettre à jour l'échéance
    const updatedInstallment = await prisma.paymentInstallment.update({
      where: { id },
      data: {
        status: amount >= installment.amount ? 'PAID' : 'PARTIAL',
        paidDate: new Date(),
        paymentMethod: method,
        notes: notes
      }
    });

    // Vérifier si toutes les échéances sont payées
    const allInstallments = await prisma.paymentInstallment.findMany({
      where: { depositId: installment.depositId }
    });

    const allPaid = allInstallments.every(inst => inst.status === 'PAID');

    if (allPaid) {
      // Mettre à jour le statut du dépôt
      await prisma.order.update({
        where: { id: installment.depositId },
        data: {
          paymentStatus: 'PAID'
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Paiement enregistré avec succès',
      data: {
        payment,
        installment: updatedInstallment,
        allPaid
      }
    });
  } catch (error) {
    console.error('Erreur paiement échéance:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement du paiement' },
      { status: 500 }
    );
  }
}
