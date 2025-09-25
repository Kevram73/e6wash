import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'FCFA'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency === 'FCFA' ? 'XOF' : currency,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Order statuses
    'NEW': 'bg-blue-100 text-blue-800',
    'PROCESSING': 'bg-yellow-100 text-yellow-800',
    'READY': 'bg-indigo-100 text-indigo-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'CANCELLED': 'bg-red-100 text-red-800',
    
    // Payment statuses
    'PENDING': 'bg-gray-100 text-gray-800',
    'PAID': 'bg-green-100 text-green-800',
    'PARTIAL': 'bg-yellow-100 text-yellow-800',
    'REFUNDED': 'bg-red-100 text-red-800',
    
    // Tenant statuses
    'ACTIVE': 'bg-green-100 text-green-800',
    'SUSPENDED': 'bg-yellow-100 text-yellow-800',
    'INACTIVE': 'bg-red-100 text-red-800',
  }
  
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function getStatusText(status: string): string {
  const texts: Record<string, string> = {
    // Order statuses
    'NEW': 'Nouveau',
    'PROCESSING': 'En cours',
    'READY': 'Prêt',
    'COMPLETED': 'Terminé',
    'CANCELLED': 'Annulé',
    
    // Payment statuses
    'PENDING': 'En attente',
    'PAID': 'Payé',
    'PARTIAL': 'Partiel',
    'REFUNDED': 'Remboursé',
    
    // Tenant statuses
    'ACTIVE': 'Actif',
    'SUSPENDED': 'Suspendu',
    'INACTIVE': 'Inactif',
  }
  
  return texts[status] || status
}
