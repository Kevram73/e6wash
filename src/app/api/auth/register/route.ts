import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullname: z.string().min(2),
  name: z.string().min(2),
  role: z.enum(['ADMIN', 'OWNER', 'EMPLOYEE', 'CAISSIER', 'MANAGER', 'COLLECTOR', 'CLIENT']),
  tenantId: z.string().optional(),
  agencyId: z.string().optional(),
  phone: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        fullname: validatedData.fullname,
        name: validatedData.name,
        role: validatedData.role,
        tenantId: validatedData.tenantId,
        agencyId: validatedData.agencyId,
        phone: validatedData.phone,
        isActive: true,
        status: true,
      },
      include: {
        tenant: true,
        agency: true,
      },
    });

    // Retourner l'utilisateur sans le mot de passe
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json({
      message: 'Utilisateur créé avec succès',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
