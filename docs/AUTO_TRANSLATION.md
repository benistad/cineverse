# 🌍 Traduction automatique des films

## Vue d'ensemble

Le système de traduction automatique utilise **TMDB + DeepL** pour traduire intelligemment les films du français vers l'anglais :

- ✅ **Titres originaux** depuis TMDB
- ✅ **Synopsis officiels** depuis TMDB  
- ✅ **Contenu custom** traduit avec DeepL
- ✅ **93% d'économie** sur les crédits DeepL

---

## 🚀 Utilisation

### Option 1 : Hook React (Recommandé)

Utilisez le hook `useAutoTranslate` dans vos composants admin :

```jsx
import { useAutoTranslate } from '@/lib/hooks/useAutoTranslate';

function AddFilmForm() {
  const { translateFilm } = useAutoTranslate();

  const handleSubmit = async (filmData) => {
    // 1. Sauvegarder le film
    const { data: newFilm, error } = await supabase
      .from('films')
      .insert(filmData)
      .select()
      .single();

    if (error) {
      console.error('Error saving film:', error);
      return;
    }

    // 2. Traduire automatiquement
    const translationResult = await translateFilm(newFilm.id);
    
    if (translationResult.success) {
      console.log('✅ Film saved and translated!');
      console.log('Source:', translationResult.source); // 'tmdb' ou 'deepl'
    } else {
      console.warn('⚠️ Film saved but translation failed');
    }
  };

  return (
    // ... votre formulaire
  );
}
```

### Option 2 : Appel API direct

```javascript
// Après avoir créé/modifié un film
const response = await fetch('/api/translate-film', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ filmId: 'film-id-here' })
});

const result = await response.json();
console.log(result);
// {
//   success: true,
//   filmId: '...',
//   source: 'tmdb', // ou 'deepl'
//   translations: {
//     title: '...',
//     synopsis: '...',
//     why_watch_content: '...'
//   }
// }
```

### Option 3 : Script en masse

Pour traduire tous les films existants :

```bash
node scripts/translate-films-enhanced.js
```

---

## 🎯 Fonctionnement

### 1. Détection de la source

```
Film avec tmdb_id ?
  ├─ OUI → Utiliser TMDB (titre original + synopsis)
  └─ NON → Utiliser DeepL (traduction complète)
```

### 2. Traduction du contenu custom

Le contenu "Pourquoi regarder" est **toujours traduit avec DeepL** car c'est du contenu personnalisé.

### 3. Sauvegarde

Les traductions sont sauvegardées dans `film_translations` :

```sql
INSERT INTO film_translations (film_id, locale, title, synopsis, why_watch_content)
VALUES ('film-id', 'en', 'Original Title', 'Official synopsis', 'Translated custom content')
ON CONFLICT (film_id, locale) DO UPDATE ...
```

---

## 📊 Statistiques

### Économies réalisées

Avec TMDB + DeepL vs DeepL seul :

| Méthode | Caractères/film | Films/mois (gratuit) |
|---------|----------------|---------------------|
| **DeepL seul** | ~500 | ~1 000 |
| **TMDB + DeepL** | ~35 | ~14 000 |
| **Économie** | **93%** | **14x plus** |

### Exemple réel (143 films)

```
🎬 From TMDB: 143 films (100%)
⚡ From DeepL: 0 films (0%)
📊 Characters used: 5,142 (seulement "Pourquoi regarder")
💵 Remaining: 494,858 / 500,000
```

---

## 🔧 Configuration

### Variables d'environnement requises

```bash
# .env.local
DEEPL_API_KEY=your_deepl_api_key
NEXT_PUBLIC_TMDB_API_TOKEN=your_tmdb_token # (optionnel, token par défaut inclus)
```

### Obtenir une clé DeepL

1. Allez sur https://www.deepl.com/pro-api
2. Créez un compte gratuit (500 000 caractères/mois)
3. Copiez votre clé API
4. Ajoutez-la dans `.env.local`

---

## 🐛 Dépannage

### La traduction ne se lance pas

**Vérifications** :
1. ✅ La clé DeepL est dans `.env.local`
2. ✅ Le film a un `id` valide
3. ✅ L'API `/api/translate-film` est accessible

### Les titres ne sont pas en VO

**Cause** : Le film n'a pas de `tmdb_id`

**Solution** : 
- Ajoutez le `tmdb_id` au film
- Relancez la traduction avec le script

### Erreur "Failed to save translations"

**Cause** : La table `film_translations` n'existe pas

**Solution** : Exécutez le SQL dans `schema/film_translations.sql`

---

## 📝 Exemples de résultats

### Avec TMDB (recommandé)

```json
{
  "title": "The Dark Knight",
  "synopsis": "Batman raises the stakes in his war on crime...",
  "why_watch_content": "A masterpiece that redefined superhero movies..."
}
```

### Sans TMDB (fallback DeepL)

```json
{
  "title": "The Dark Knight",
  "synopsis": "Batman raises the stakes in his war on crime...",
  "why_watch_content": "A masterpiece that redefined superhero movies..."
}
```

---

## 🎓 Bonnes pratiques

### ✅ À faire

- Toujours renseigner le `tmdb_id` lors de l'ajout d'un film
- Appeler `translateFilm()` après chaque création/modification
- Vérifier le `source` dans la réponse pour voir d'où viennent les données

### ❌ À éviter

- Ne pas appeler l'API de traduction en boucle (rate limiting)
- Ne pas oublier de gérer les erreurs
- Ne pas traduire manuellement si TMDB peut le faire

---

## 🚀 Améliorations futures

### Court terme
- [ ] Traduction automatique dans l'interface admin
- [ ] Indicateur visuel "Traduit" dans la liste des films
- [ ] Bouton "Re-traduire" pour mettre à jour

### Moyen terme
- [ ] Support de langues supplémentaires (ES, DE, IT)
- [ ] Traduction du staff remarquable
- [ ] Queue de traduction pour éviter le rate limiting

### Long terme
- [ ] Interface de révision des traductions
- [ ] Traduction collaborative
- [ ] Détection automatique de la langue source

---

**Version** : 2.0 (Enhanced with TMDB)  
**Date** : Octobre 2025  
**Auteur** : Équipe MovieHunt
