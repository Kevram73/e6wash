import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signIn } from 'next-auth/react';

export async function POST(request: NextRequest) {
  try {
    const { email, password, tenantId } = await request.json();
    
    if (!email || !password || !tenantId) {
      return NextResponse.json(
        { error: 'Email, mot de passe et pressing requis' },
        { status: 400 }
      );
    }
    
    // Trouver l'utilisateur
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        tenantId: tenantId,
        role: 'CLIENT' // Seuls les clients peuvent se connecter via mobile
      },
      include: {
        customer: true,
        tenant: {
          select: {
            name: true,
            subdomain: true
          }
        }
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }
    
    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }
    
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Compte désactivé' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        userId: user.id,
        customerId: user.customerId,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        tenantId: user.tenantId,
        tenantName: user.tenant.name,
        tenantSubdomain: user.tenant.subdomain,
        address: user.customer?.address,
        city: user.customer?.city
      }
    });
    
  } catch (error) {
    console.error('Erreur connexion mobile:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
}
