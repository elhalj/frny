# FRNY Frontend

Frontend du projet FRNY – une plateforme e-commerce moderne.

## 🚀 Fonctionnalités principales

- Interface utilisateur responsive et moderne
- Navigation avec React Router
- Authentification et gestion des sessions côté client
- Consommation d'API REST pour les produits, utilisateurs, vendeurs, commandes, etc.
- State management avec Zustand
- Intégration TailwindCSS pour le style et DaisyUI pour les composants
- Sécurité des données côté frontend (ex : gestion des tokens en localStorage/cookies)

## 🛠️ Stack technique

- **React 19** (avec hooks)
- **TypeScript**
- **Vite** (développement et build)
- **TailwindCSS** & **DaisyUI**
- **Zustand** (state management simple)
- **Axios** (requêtes HTTP)
- **Lucide-react** (icônes modernes)
- **ESLint** (linting et qualité de code)

## 📁 Structure du projet

```
frny/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── store/
│   ├── utils/
│   └── App.tsx
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── ...
```

## ⚡ Installation et démarrage

1. Clone ce dépôt
2. Installe les dépendances :

```bash
npm install
```

3. Lance le serveur de dev :

```bash
npm run dev
```

4. Pour builder l’app :

```bash
npm run build
```

## 🌍 Variables d’environnement

Crée un fichier `.env` selon tes besoins (voir `.env.example` si disponible).  
Paramètre typique :

- URL de l’API backend : `VITE_API_URL=http://localhost:5000`

## 🤝 Contribuer

Les contributions sont bienvenues !  
Merci de proposer une issue ou une PR si tu veux améliorer le projet.

## 📄 Licence

Ce projet est sous licence MIT – voir le fichier [LICENSE](./LICENSE) pour plus d’infos.
