'use client';

import React from 'react';
import Link from 'next/link';
import UpworkButton from '@/components/ui/UpworkButton';
import UpworkCard from '@/components/ui/UpworkCard';
import { 
  Building2, 
  Users, 
  Package, 
  Truck,
  BarChart3,
  Shield,
  Clock,
  Smartphone,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Menu,
  Search
} from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Building2,
      title: 'Gestion Multi-Tenant',
      description: 'Gérez plusieurs pressings depuis une seule plateforme',
      color: 'bg-[#f0fdf4]0'
    },
    {
      icon: Package,
      title: 'Suivi des Commandes',
      description: 'Suivi en temps réel de toutes vos commandes',
      color: 'bg-[#f0fdf4]0'
    },
    {
      icon: Users,
      title: 'Gestion des Clients',
      description: 'Base de données clients complète avec historique',
      color: 'bg-purple-500'
    },
    {
      icon: Truck,
      title: 'Service de Collecte',
      description: 'Organisez les collectes et livraisons efficacement',
      color: 'bg-orange-500'
    },
    {
      icon: BarChart3,
      title: 'Rapports & Analytics',
      description: 'Tableaux de bord détaillés et analyses de performance',
      color: 'bg-indigo-500'
    },
    {
      icon: Smartphone,
      title: 'Application Mobile',
      description: 'Accès mobile pour vos employés et clients',
      color: 'bg-pink-500'
    }
  ];

  const stats = [
    { number: '500+', label: 'Pressings Actifs' },
    { number: '50K+', label: 'Commandes Traitées' },
    { number: '99.9%', label: 'Disponibilité' },
    { number: '24/7', label: 'Support Client' }
  ];

  const testimonials = [
    {
      name: 'Marie Dubois',
      role: 'Propriétaire - Pressing Moderne',
      content: 'E6Wash a révolutionné la gestion de mon pressing. Plus simple, plus efficace !',
      rating: 5
    },
    {
      name: 'Jean Martin',
      role: 'Directeur - Clean Express',
      content: 'La plateforme est intuitive et nos clients adorent le suivi en temps réel.',
      rating: 5
    },
    {
      name: 'Sophie Laurent',
      role: 'Gérante - Laverie Pro',
      content: 'Un gain de temps considérable dans la gestion quotidienne.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* Header - Upwork Style */}
      <header className="bg-white border-b border-[#e5e5e5] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-[#14a800] rounded-lg flex items-center justify-center mr-3">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-[#2c2c2c]">E6Wash</h1>
              <span className="ml-2 text-sm text-[#737373] bg-[#f5f5f5] px-2 py-1 rounded">SaaS</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="#" className="text-[#2c2c2c] hover:text-[#14a800] font-medium">Solutions</Link>
              <Link href="#" className="text-[#2c2c2c] hover:text-[#14a800] font-medium">Tarifs</Link>
              <Link href="#" className="text-[#2c2c2c] hover:text-[#14a800] font-medium">Support</Link>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <UpworkButton variant="ghost" size="sm">Connexion</UpworkButton>
              </Link>
              <Link href="/auth/login">
                <UpworkButton size="sm">Commencer</UpworkButton>
              </Link>
              <button className="md:hidden p-2 text-[#2c2c2c]">
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Upwork Style */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#f0fdf4] text-[#14a800] text-sm font-medium mb-6">
              <Zap className="h-3 w-3 mr-1" />
              Plateforme SaaS de nouvelle génération
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2c2c2c] mb-6 leading-tight">
              Révolutionnez votre{' '}
              <span className="text-[#14a800]">
                pressing
              </span>
            </h1>
            <p className="text-xl text-[#525252] mb-8 max-w-3xl mx-auto leading-relaxed">
              La solution complète pour moderniser la gestion de votre pressing. 
              Gérez vos commandes, clients, employés et finances depuis une seule plateforme.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/login">
              <UpworkButton size="lg" className="w-full sm:w-auto">
                Essayer gratuitement
                <ArrowRight className="ml-2 h-4 w-4" />
              </UpworkButton>
            </Link>
            <UpworkButton variant="outline" size="lg" className="w-full sm:w-auto">
              Voir la démo
            </UpworkButton>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-[#2c2c2c] mb-2">{stat.number}</div>
                <div className="text-sm text-[#737373]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Upwork Style */}
      <section className="py-16 bg-[#f7f7f7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2c2c2c] mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-xl text-[#525252] max-w-2xl mx-auto">
              Une suite complète d'outils pour gérer efficacement votre pressing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <UpworkCard key={index} hover className="text-center">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2c2c2c] mb-2">{feature.title}</h3>
                  <p className="text-[#525252] leading-relaxed">
                    {feature.description}
                  </p>
                </UpworkCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section - Upwork Style */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#2c2c2c] mb-6">
                Pourquoi choisir E6Wash ?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#14a800] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-[#2c2c2c] mb-2">Gain de temps</h3>
                    <p className="text-[#525252]">Automatisez vos processus et gagnez jusqu'à 40% de temps sur la gestion administrative.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#14a800] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-[#2c2c2c] mb-2">Sécurité garantie</h3>
                    <p className="text-[#525252]">Vos données sont protégées avec un chiffrement de niveau bancaire et des sauvegardes automatiques.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#14a800] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-[#2c2c2c] mb-2">Support 24/7</h3>
                    <p className="text-[#525252]">Notre équipe d'experts est disponible à tout moment pour vous accompagner.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-[#14a800] mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-[#2c2c2c] mb-2">Évolutif</h3>
                    <p className="text-[#525252]">Adaptez la plateforme à la croissance de votre entreprise avec des fonctionnalités modulaires.</p>
                  </div>
                </div>
              </div>
            </div>
            <UpworkCard className="bg-[#14a800] text-white">
              <div className="text-center">
                <Shield className="h-16 w-16 mx-auto mb-6 opacity-90" />
                <h3 className="text-2xl font-bold mb-4">Sécurité & Fiabilité</h3>
                <p className="text-lg opacity-90 mb-6">
                  Vos données sont notre priorité. Chiffrement SSL, sauvegardes quotidiennes et conformité RGPD.
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">99.9%</div>
                    <div className="text-sm opacity-80">Uptime</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">256-bit</div>
                    <div className="text-sm opacity-80">SSL</div>
                  </div>
                </div>
              </div>
            </UpworkCard>
          </div>
        </div>
      </section>

      {/* Testimonials - Upwork Style */}
      <section className="py-16 bg-[#f7f7f7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2c2c2c] mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-[#525252]">
              Plus de 500 pressings nous font confiance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <UpworkCard key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-[#525252] mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-[#2c2c2c]">{testimonial.name}</div>
                  <div className="text-sm text-[#737373]">{testimonial.role}</div>
                </div>
              </UpworkCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Upwork Style */}
      <section className="py-16 bg-[#14a800]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à moderniser votre pressing ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Rejoignez des centaines de pressings qui ont déjà fait le choix de l'innovation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <UpworkButton size="lg" variant="secondary" className="w-full sm:w-auto">
                Commencer maintenant
                <ArrowRight className="ml-2 h-4 w-4" />
              </UpworkButton>
            </Link>
            <UpworkButton size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-[#14a800]">
              Planifier une démo
            </UpworkButton>
          </div>
        </div>
      </section>

      {/* Footer - Upwork Style */}
      <footer className="bg-[#2c2c2c] text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#14a800] rounded-lg flex items-center justify-center mr-3">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold">E6Wash</h3>
              </div>
              <p className="text-[#a3a3a3]">
                La plateforme SaaS de référence pour la gestion moderne des pressings.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Produit</h4>
              <ul className="space-y-2 text-[#a3a3a3]">
                <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Démo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <ul className="space-y-2 text-[#a3a3a3]">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Statut</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Entreprise</h4>
              <ul className="space-y-2 text-[#a3a3a3]">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#404040] mt-8 pt-8 text-center text-[#a3a3a3]">
            <p>&copy; 2024 E6Wash. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
