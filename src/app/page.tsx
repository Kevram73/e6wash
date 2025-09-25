import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import HomePage from '@/components/HomePage';

export default async function RootPage() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect('/dashboard');
  } else {
    return <HomePage />;
  }
}