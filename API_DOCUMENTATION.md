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
  "id": 123,
  "title": "Deepwater",
  "slug": "deepwater",
  "synopsis": "Synopsis du film...",
  "note_sur_10": 8.5,
  "release_date": "2023-01-01",
  "genres": "Action, Thriller",
  "poster_path": "/path/to/poster.jpg",
  "poster_url": "https://image.tmdb.org/t/p/w500/poster.jpg",
  "tmdb_id": 456789,
  "youtube_trailer_key": "abc123",
  "why_watch_enabled": true,
  "why_watch_content": "Contenu HTML...",
  "not_liked_enabled": false,
  "not_liked_content": null,
  "is_hunted_by_moviehunt": true,
  "is_hidden_gem": false,
  "date_ajout": "2023-12-01T10:00:00Z",
  "remarkable_staff": [
    {
      "id": 1,
      "nom": "Christopher Nolan",
      "role": "Réalisateur",
      "photo_url": "https://image.tmdb.org/t/p/w185/photo.jpg"
    }
  ]
}
```

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
film = get_film_data("deepwater")
if film:
    print(f"Titre: {film['title']}")
    print(f"Note: {film['note_sur_10']}/10")
    print(f"Synopsis: {film['synopsis']}")
```
