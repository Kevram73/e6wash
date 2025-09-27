import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
  fullname: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  password: z.string().min(6),
  address: z.string().min(5),
  city: z.string().min(2),
  countryId: z.string().optional(),
  tenantId: z.string() // Le pressing où le client s'inscrit
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validation des données
    const validatedData = registerSchema.parse(body);
    
    // Vérifier que le tenant existe
    const tenant = await prisma.tenant.findUnique({
      where: { id: validatedData.tenantId }
    });
    
    if (!tenant) {
      return NextResponse.json(
        { error: 'Pressing non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        email: validatedData.email,
        tenantId: validatedData.tenantId
      }
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cet email existe déjà' },
        { status: 400 }
      );
    }
    
    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    
    // Créer le client
    const customer = await prisma.customer.create({
      data: {
        tenantId: validatedData.tenantId,
        fullname: validatedData.fullname,
        email: validatedData.email,
        phone: validatedData.phone,
        address: validatedData.address,
        city: validatedData.city,
        countryId: validatedData.countryId,
        isActive: true,
        notes: 'Client mobile'
      }
    });
    
    // Créer l'utilisateur mobile
    const user = await prisma.user.create({
      data: {
        tenantId: validatedData.tenantId,
        fullname: validatedData.fullname,
        email: validatedData.email,
        phone: validatedData.phone,
        password: hashedPassword,
        role: 'CLIENT',
        isActive: true,
        emailVerified: null,
        customerId: customer.id // Lier l'utilisateur au client
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès',
      data: {
        userId: user.id,
        customerId: customer.id,
        fullname: user.fullname,
        email: user.email
      }
    });
    
  } catch (error) {
    console.error('Erreur inscription mobile:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte' },
      { status: 500 }
    );
  }
}
