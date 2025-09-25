import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './db';

// L'authentification utilise maintenant la base de données Prisma

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Rechercher l'utilisateur dans la base de données
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              tenant: true,
              agency: true,
            },
          });

          if (!user || !user.isActive) {
            return null;
          }

          // Vérifier le mot de passe
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name || user.fullname,
            role: user.role,
            pressingId: user.tenantId,
            agenceId: user.agencyId,
            pressing: user.tenant ? { id: user.tenant.id, name: user.tenant.name } : null,
            agence: user.agency ? { id: user.agency.id, name: user.agency.name } : null,
          };
        } catch (error) {
          console.error('Erreur d\'authentification:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.pressingId = user.pressingId;
        token.agenceId = user.agenceId;
        token.pressing = user.pressing;
        token.agence = user.agence;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.pressingId = token.pressingId as string;
        session.user.agenceId = token.agenceId as string;
        session.user.pressing = token.pressing as any;
        session.user.agence = token.agence as any;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
};
