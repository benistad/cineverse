# API Documentation - MovieHunt

## Films API

### GET /api/films/[slug]

Récupère les informations d'un film par son slug.

**Paramètres :**
- `slug` (string) : Le slug du film (ex: "deepwater", "inception")

**Réponse :**
- **200 OK** : Retourne les données du film en JSON
- **404 Not Found** : Film non trouvé
- **400 Bad Request** : Paramètre slug manquant
- **500 Internal Server Error** : Erreur serveur

**Exemple d'utilisation :**
```bash
curl http://localhost:3000/api/films/deepwater
```

**Structure de la réponse (succès) :**
```json
{
  "title": "Heretic",
  "slug": "heretic",
  "score": 6,
  "hunted": false,
  "hidden_gem": false,
  "sections": [
    {
      "heading": "Pourquoi le voir ?",
      "content": "• La performance de Hugh Grant dans un rôle inhabituel\n• L'histoire"
    },
    {
      "heading": "Notre avis",
      "content": "Contenu de la critique..."
    },
    {
      "heading": "Casting",
      "content": "Hugh Grant (Acteur), Sophie Thatcher (Actrice)"
    }
  ],
  "genres": [
    "Horreur",
    "Thriller"
  ],
  "year": 2024
}
```

**Champs obligatoires :**
- `title` : Titre du film
- `slug` : Identifiant URL-friendly
- `score` : Note sur 10
- `hunted` : Badge "Hunted by MovieHunt" (true/false)
- `hidden_gem` : Film méconnu à découvrir (true/false)
- `sections` : Array des sections de contenu

**Champs optionnels :**
- `genres` : Array des genres (omis si aucun genre)
- `year` : Année de sortie (omis si date inconnue)
- `runtime` : Durée en minutes (non implémenté actuellement)

**Sections disponibles :**
- **"Pourquoi le voir ?"** : Contenu éditorial sur les points forts
- **"Notre avis"** : Critique ou points négatifs
- **"Casting"** : Équipe technique remarquable (format: "Nom (Rôle)")

**Badges spéciaux :**
- **`hunted`** : `true` si le film a le badge "Hunted by MovieHunt" (films exceptionnels)
- **`hidden_gem`** : `true` si le film fait partie des perles rares méconnues

**Structure de la réponse (erreur) :**
```json
{
  "error": "Film not found"
}
```

### GET /api/films/[slug]/json

Alternative avec extension `.json` explicite. Même fonctionnalité que l'endpoint précédent.

**Exemple d'utilisation :**
```bash
curl http://localhost:3000/api/films/deepwater/json
```

## Fonctionnalités

### Recherche par slug
L'API recherche d'abord par slug exact, puis par titre si le slug n'existe pas.

### Cache
Les réponses sont mises en cache pendant 1 heure (`Cache-Control: public, max-age=3600`).

### Sécurité
- Accès public en lecture seule
- Aucune authentification requise
- Méthodes POST, PUT, DELETE interdites (405 Method Not Allowed)

### Données incluses
- Informations complètes du film
- Équipe technique remarquable (remarkable_staff)
- Métadonnées TMDB
- Contenu éditorial (pourquoi regarder, critiques)

## Utilisation pour le scrapping

Cet endpoint est parfait pour votre IA de scrapping car il fournit :
- Données structurées en JSON
- Toutes les informations nécessaires en une seule requête
- Fallback intelligent par titre
- Cache pour optimiser les performances

**Exemple de scrapping Python :**
```python
import requests

def get_film_data(slug):
    response = requests.get(f"http://localhost:3000/api/films/{slug}")
    if response.status_code == 200:
        return response.json()
    elif response.status_code == 404:
        print(f"Film '{slug}' non trouvé")
        return None
    else:
        print(f"Erreur {response.status_code}")
        return None

# Utilisation
film = get_film_data("heretic")
if film:
    print(f"Titre: {film['title']}")
    print(f"Note: {film['score']}/10")
    print(f"Hunted: {film['hunted']}")
    print(f"Genres: {', '.join(film.get('genres', []))}")
    
    # Parcourir les sections
    for section in film['sections']:
        print(f"\n{section['heading']}:")
        print(section['content'])
```
