# Web3 Toolkit MVP

Starter project en **Next.js + TypeScript + Prisma** pour lancer rapidement un SaaS Web3 avec :

- login / register
- ajout de wallets
- dashboard multi-wallet
- profit tracker simplifié
- airdrop tracker mocké
- réglage de webhook Discord

## Stack

- Next.js 15
- React 19
- TypeScript
- Prisma
- SQLite
- Tailwind CSS
- JWT cookie auth

## Lancer le projet

### 1) Installer les dépendances

```bash
npm install
```

### 2) Copier le fichier d'environnement

```bash
cp .env.example .env
```

Sous Windows PowerShell :

```powershell
Copy-Item .env.example .env
```

### 3) Initialiser la base

```bash
npm run db:push
npm run db:seed
```

### 4) Lancer le serveur

```bash
npm run dev
```

Puis ouvre :

```text
http://localhost:3000
```

## Compte démo

- email : `demo@web3toolkit.local`
- mot de passe : `demo1234`

## Structure utile

```text
app/
  (auth)/login
  (auth)/register
  dashboard
  api/
components/
lib/
prisma/
scripts/
```

## Ce que fait vraiment ce MVP

### Déjà prêt

- authentification simple avec cookie JWT
- ajout de wallets stockés en base
- dashboard avec total USD et nombre de wallets
- vue airdrop mockée pour préparer la vraie intégration
- sauvegarde d'un webhook Discord par utilisateur

### À brancher ensuite

- récupération réelle des balances via Alchemy / Moralis / Birdeye / RPC
- historique de portfolio
- cron jobs / workers
- alertes prix / whale / airdrop en temps réel
- abonnements Stripe / crypto
- rôles admin / team

## Idées de next step

### 1. Données réelles blockchain
Ajouter un service `lib/providers/` pour brancher :
- Ethereum / Base / Arbitrum : ethers + RPC
- Solana : helius ou autre provider
- prix tokens : CoinGecko, Birdeye, Dexscreener

### 2. Jobs asynchrones
Ajouter :
- Redis
- BullMQ
- worker dédié
- cron

### 3. Passage à PostgreSQL
Changer dans `prisma/schema.prisma` :

```prisma
provider = "postgresql"
```

Puis mettre une vraie `DATABASE_URL`.

## Test Discord worker

Met un webhook dans `.env`, puis :

```bash
npx tsx scripts/discord-worker.ts
```

## Notes

- Le `profit tracker` est volontairement simple dans cette base.
- Le `airdrop tracker` est mocké pour te laisser brancher ton propre système de scoring.
- Le projet est pensé comme une **fondation rapide**, pas comme une plateforme prod finie.
