import NextAuth from 'next-auth';
import { Pressing, Agence } from './index';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      pressingId?: string;
      agenceId?: string;
      pressing?: Pressing;
      agence?: Agence;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    pressingId?: string;
    agenceId?: string;
    pressing?: Pressing;
    agence?: Agence;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    pressingId?: string;
    agenceId?: string;
    pressing?: Pressing;
    agence?: Agence;
  }
}
