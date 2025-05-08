# MovieHunt - Application de Notation de Films

MovieHunt est une application web qui permet de noter des films, de sélectionner des membres remarquables du casting et de l'équipe technique (MovieHunt's Picks), et de partager ces informations avec le public. L'application est construite avec Next.js 14, Supabase et l'API TMDB.

## Fonctionnalités

### Partie Publique
- Affichage des derniers films notés sur la page d'accueil
- Pages détaillées pour chaque film avec :
  - Poster et backdrop
  - Synopsis
  - Note sur 10
  - Bande-annonce YouTube
  - Liste du "Remarkable Staff" (acteurs, réalisateurs, etc. sélectionnés)

### Partie Admin (privée)
- Authentification via Supabase
- Recherche de films via l'API TMDB
- Notation des films sur 10
- Sélection manuelle des membres remarquables du casting et de l'équipe technique
- Sauvegarde des données dans Supabase

## Technologies Utilisées

- **Frontend** : Next.js 14 (App Router), React, TailwindCSS
- **Backend** : Supabase (PostgreSQL, Auth)
- **API** : TMDB (The Movie Database)
- **Déploiement** : Vercel

## Configuration

### Prérequis

- Node.js 18+
- Compte Supabase
- Compte TMDB

### Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase

# TMDB
NEXT_PUBLIC_TMDB_API_KEY=votre_clé_api_tmdb
TMDB_API_TOKEN=votre_token_api_tmdb
```

### Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

## Structure de la Base de Données Supabase

### Table `films`
- id (uuid, primary key)
- tmdb_id (integer, not null)
- title (text, not null)
- slug (text, not null)
- synopsis (text)
- poster_url (text)
- backdrop_url (text)
- note_sur_10 (integer, not null)
- youtube_trailer_key (text)
- date_ajout (timestamp with time zone, default: now())

### Table `remarkable_staff`
- id (uuid, primary key)
- film_id (uuid, foreign key references films.id)
- nom (text, not null)
- role (text, not null)
- photo_url (text)

## Déploiement

L'application peut être facilement déployée sur Vercel :

```bash
npm run build
vercel deploy
```
