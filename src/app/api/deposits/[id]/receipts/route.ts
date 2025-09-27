import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { type, format } = body;

    // Vérifier que le dépôt existe
    const deposit = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        agency: true,
        tenant: true,
        items: {
          include: {
            service: true
          }
        },
        payments: true,
        createdBy: true
      }
    });

    if (!deposit) {
      return NextResponse.json(
        { error: 'Dépôt non trouvé' },
        { status: 404 }
      );
    }

    // Créer le reçu dans la base de données
    const receipt = await prisma.receipt.create({
      data: {
        depositId: id,
        type: type || 'DEPOSIT',
        format: format || 'A4',
        status: 'GENERATED',
        content: generateReceiptContent(deposit, type, format),
        generatedAt: new Date(),
        generatedBy: 'system' // À remplacer par l'ID de l'utilisateur connecté
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Reçu généré avec succès',
      data: receipt
    });
  } catch (error) {
    console.error('Erreur génération reçu:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du reçu' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Récupérer tous les reçus pour ce dépôt
    const receipts = await prisma.receipt.findMany({
      where: { depositId: id },
      orderBy: { generatedAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      data: receipts
    });
  } catch (error) {
    console.error('Erreur récupération reçus:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des reçus' },
      { status: 500 }
    );
  }
}

function generateReceiptContent(deposit: any, type: string, format: string): string {
  // Cette fonction génère le contenu HTML du reçu
  // En production, vous utiliseriez un moteur de template comme Handlebars ou React Server Components
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const typeText = {
    'DEPOSIT': 'REÇU DE DÉPÔT',
    'PAYMENT': 'REÇU DE PAIEMENT',
    'DELIVERY': 'REÇU DE LIVRAISON'
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Reçu - ${deposit.orderNumber}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
          margin-bottom: 20px;
        }
        .header h1 {
          font-size: 24px;
          margin: 0;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .section {
          margin-bottom: 20px;
        }
        .section h3 {
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f5f5f5;
        }
        .total {
          font-weight: bold;
          font-size: 18px;
          border-top: 2px solid #333;
          padding-top: 10px;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ccc;
          font-size: 12px;
          color: #666;
        }
        @media print {
          body { margin: 0; padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${deposit.tenant.name}</h1>
        <p>${deposit.agency.name}</p>
        <p><strong>${typeText[type] || 'REÇU'}</strong></p>
        <p>N° ${deposit.orderNumber} | Date: ${formatDate(deposit.createdAt)}</p>
      </div>

      <div class="info-grid">
        <div class="section">
          <h3>Informations Client</h3>
          <p><strong>Nom:</strong> ${deposit.customer.fullname}</p>
          <p><strong>Téléphone:</strong> ${deposit.customer.phone}</p>
          ${deposit.customer.email ? `<p><strong>Email:</strong> ${deposit.customer.email}</p>` : ''}
        </div>
        <div class="section">
          <h3>Informations de Collecte</h3>
          <p><strong>Adresse:</strong> ${deposit.customer.address || 'N/A'}</p>
          <p><strong>Date:</strong> ${deposit.pickupDate ? formatDate(deposit.pickupDate) : 'N/A'}</p>
          ${deposit.notes ? `<p><strong>Notes:</strong> ${deposit.notes}</p>` : ''}
        </div>
      </div>

      <div class="section">
        <h3>Articles Déposés</h3>
        <table>
          <thead>
            <tr>
              <th>Article</th>
              <th>Catégorie</th>
              <th>Quantité</th>
              <th>Prix Unitaire</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${deposit.items.map((item: any) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.service?.category || 'N/A'}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(Number(item.unitPrice))}</td>
                <td>${formatCurrency(Number(item.totalPrice))}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h3>Résumé Financier</h3>
        <p>Sous-total: ${formatCurrency(Number(deposit.totalAmount))}</p>
        ${Number(deposit.discountAmount) > 0 ? `<p>Remise: -${formatCurrency(Number(deposit.discountAmount))}</p>` : ''}
        ${Number(deposit.taxAmount) > 0 ? `<p>Taxes: ${formatCurrency(Number(deposit.taxAmount))}</p>` : ''}
        <p class="total">Total: ${formatCurrency(Number(deposit.totalAmount))}</p>
        <p>Payé: ${formatCurrency(deposit.payments.reduce((sum: number, payment: any) => sum + Number(payment.amount), 0))}</p>
      </div>

      <div class="footer">
        <p>Merci pour votre confiance. Nous nous engageons à traiter vos vêtements avec le plus grand soin.</p>
        <p>Pour toute question, contactez-nous au ${deposit.agency.name}.</p>
        <p>Reçu généré le ${formatDate(new Date())} par ${deposit.createdBy?.fullname || 'Système'}</p>
      </div>
    </body>
    </html>
  `;
}
