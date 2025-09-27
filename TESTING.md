# Guide de Tests E6Wash

## 🧪 Configuration Jest

Ce projet utilise Jest pour les tests unitaires et d'intégration, configuré pour Next.js et TypeScript.

### Structure des Tests

```
src/__tests__/
├── basic/              # Tests unitaires de base
│   ├── math.test.ts
│   ├── date.test.ts
│   └── currency.test.ts
├── utils/              # Tests des utilitaires
│   ├── api-helpers.test.ts
│   ├── chatbot-utils.test.ts
│   └── test-utils.tsx
├── api/                # Tests des APIs
│   ├── finance.test.ts
│   └── chatbot.test.ts
├── frontend/           # Tests des composants React
│   ├── components/
│   └── pages/
└── integration/        # Tests d'intégration
    └── chatbot-flow.test.ts
```

## 🚀 Scripts de Test

### Exécuter tous les tests
```bash
npm test
```

### Mode watch (développement)
```bash
npm run test:watch
```

### Tests avec couverture
```bash
npm run test:coverage
```

### Tests API uniquement
```bash
npm run test:api
```

### Tests frontend uniquement
```bash
npm run test:frontend
```

## 📋 Tests Actuellement Fonctionnels

### ✅ Tests de Base (27/27 ✓)
- **Math operations** - Tests des opérations mathématiques
- **Date formatting** - Tests du formatage des dates
- **Currency formatting** - Tests du formatage des devises
- **API helpers** - Tests des utilitaires d'API
- **Chatbot utils** - Tests des utilitaires du chatbot

### 🔧 Tests à Configurer

#### APIs
- **Finance API** - Tests des endpoints de finance
- **Chatbot API** - Tests de l'API du chatbot
- **Authentication** - Tests d'authentification

#### Frontend
- **ChatbotInterface** - Tests du composant chatbot
- **FinancePage** - Tests de la page finance
- **Forms** - Tests des formulaires

#### Intégration
- **Chatbot Flow** - Tests de flux complet du chatbot
- **User Workflows** - Tests des workflows utilisateur

## 📦 Dépendances de Test

```json
{
  "devDependencies": {
    "jest": "^30.1.3",
    "jest-environment-jsdom": "^30.1.2",
    "@testing-library/react": "^16.3.0",
    "@testing-library/jest-dom": "^6.8.0",
    "@testing-library/user-event": "^14.6.1",
    "supertest": "^7.1.4",
    "@types/jest": "^30.0.0",
    "@types/supertest": "^6.0.3"
  }
}
```

## 🛠️ Configuration

### jest.config.js
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // ... autres configurations
}

module.exports = createJestConfig(customJestConfig)
```

### jest.setup.js
```javascript
import '@testing-library/jest-dom'

// Mocks pour Next.js
jest.mock('next/router', () => ({ ... }))
jest.mock('next-auth/react', () => ({ ... }))
```

## 📝 Exemples de Tests

### Test Unitaire Simple
```typescript
describe('Currency formatting', () => {
  it('should format currency correctly', () => {
    const result = formatCurrency(1000)
    expect(result).toContain('1 000')
    expect(result).toContain('F CFA')
  })
})
```

### Test d'API (Mocked)
```typescript
describe('/api/chatbot', () => {
  it('should handle greeting', async () => {
    const request = new NextRequest('http://localhost/api/chatbot', {
      method: 'POST',
      body: JSON.stringify({ message: 'Bonjour' })
    })
    
    const response = await chatbotHandler(request)
    expect(response.status).toBe(200)
  })
})
```

### Test de Composant React
```typescript
describe('ChatbotInterface', () => {
  it('should render correctly', () => {
    render(<ChatbotInterface />)
    expect(screen.getByText('Assistant E6Wash')).toBeInTheDocument()
  })
})
```

## 🎯 Meilleures Pratiques

### 1. Nommage des Tests
- Utilisez `describe` pour grouper les tests
- Noms descriptifs avec `should` + action attendue
- Tests organisés par fonctionnalité

### 2. Structure AAA
```typescript
it('should calculate total correctly', () => {
  // Arrange
  const items = [{ price: 100 }, { price: 200 }]
  
  // Act
  const total = calculateTotal(items)
  
  // Assert
  expect(total).toBe(300)
})
```

### 3. Mocking
- Mocker les dépendances externes (APIs, base de données)
- Utiliser `jest.fn()` pour les fonctions mockées
- Nettoyer les mocks avec `jest.clearAllMocks()`

### 4. Isolation
- Chaque test doit être indépendant
- Utiliser `beforeEach` et `afterEach` pour la configuration
- Éviter les tests dépendants de l'ordre d'exécution

## 🐛 Debugging des Tests

### Logs et Debug
```typescript
it('should debug values', () => {
  const result = someFunction()
  console.log('Debug result:', result)
  expect(result).toBeDefined()
})
```

### Tests en mode watch
```bash
npm run test:watch -- --verbose
```

### Coverage détaillé
```bash
npm run test:coverage -- --collectCoverageFrom="src/**/*.{ts,tsx}"
```

## 🔄 CI/CD

Les tests sont exécutés automatiquement :
- Sur chaque commit
- Dans les pull requests
- Avant les déploiements

### Commandes pour CI
```bash
# Tests complets avec coverage
npm run test:coverage

# Tests uniquement (sans watch)
npm test -- --watchAll=false
```

---

📊 **Statut Actuel : 27 tests passent ✅**

💡 Pour ajouter de nouveaux tests, suivez la structure existante et utilisez les utilitaires dans `test-utils.tsx`.
