'use client';

import React from 'react';
import Link from 'next/link';
import UpworkCard from '@/components/ui/UpworkCard';
import UpworkButton from '@/components/ui/UpworkButton';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function AuthError() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center p-4">
      <UpworkCard className="w-full max-w-md text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-[#fef2f2] rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-[#ef4444]" />
          </div>
          <h1 className="text-2xl font-bold text-[#2c2c2c] mb-2">
            Erreur d'authentification
          </h1>
          <p className="text-[#525252]">
            Une erreur est survenue lors de la connexion. Veuillez réessayer.
          </p>
        </div>
        
        <div className="space-y-3">
          <Link href="/auth/login">
            <UpworkButton className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la connexion
            </UpworkButton>
          </Link>
          
          <Link href="/">
            <UpworkButton variant="outline" className="w-full">
              Retour à l'accueil
            </UpworkButton>
          </Link>
        </div>
        
        <div className="mt-6 p-4 bg-[#f0fdf4] rounded-lg">
          <h3 className="font-semibold text-[#14a800] mb-2">Comptes de démonstration</h3>
          <div className="text-sm text-[#15803d] space-y-1">
            <p><strong>Super Admin:</strong> admin@e6wash.com / admin123</p>
            <p><strong>Admin Pressing:</strong> pressing@e6wash.com / pressing123</p>
            <p><strong>Agent:</strong> agent@e6wash.com / agent123</p>
            <p><strong>Collecteur:</strong> collector@e6wash.com / collector123</p>
          </div>
        </div>
      </UpworkCard>
    </div>
  );
}
