// API Route pour la connexion

import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur dans la base de données
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        tenant: { select: { id: true, name: true, subdomain: true } },
        agency: { select: { id: true, name: true, code: true } }
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    // Vérifier si l'utilisateur est actif
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, error: 'Compte désactivé' },
        { status: 401 }
      );
    }

    // Mettre à jour la dernière connexion
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Créer le JWT
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret');
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      name: user.name,
      fullname: user.fullname,
      role: user.role,
      tenantId: user.tenantId,
      agencyId: user.agencyId,
      tenant: user.tenant,
      agency: user.agency,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);

    // Retourner la réponse
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          fullname: user.fullname,
          role: user.role,
          tenantId: user.tenantId,
          agencyId: user.agencyId,
          tenant: user.tenant,
          agency: user.agency,
        },
        token,
        expiresIn: 24 * 60 * 60, // 24 heures en secondes
      },
      message: 'Connexion réussie',
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
