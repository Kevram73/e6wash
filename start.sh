#!/bin/bash

echo "🚀 Démarrage d'E6Wash SaaS..."

# Vérifier si .env existe
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp env.example .env
    echo "⚠️  Veuillez configurer votre base de données dans .env"
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npm run db:generate

# Appliquer le schéma à la base de données
echo "🗄️  Application du schéma à la base de données..."
npm run db:push

# Peupler avec des données de test
echo "🌱 Peuplement avec des données de test..."
npm run db:seed

# Lancer l'application
echo "🎉 Lancement de l'application..."
npm run dev
