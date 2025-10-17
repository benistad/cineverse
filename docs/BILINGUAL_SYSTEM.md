# 🌍 Système Bilingue FR/EN - MovieHunt

## 📋 Vue d'ensemble

MovieHunt est maintenant **100% bilingue** avec traduction automatique via TMDB (gratuit) + DeepL (avec glossaire cinématographique).

---

## ✅ Traduction automatique pour nouveaux films

### Interface Admin

**Accès** : `/admin/translations`

**Workflow** :
1. Sélectionner un film dans la liste
2. Cliquer sur **✨ Auto-traduire**
3. La traduction est générée automatiquement :
   - **Titre** : Original title depuis TMDB
   - **Synopsis** : Synopsis anglais depuis TMDB (gratuit)
   - **Genres** : Genres anglais depuis TMDB (gratuit)
   - **Pourquoi regarder** : Traduit via DeepL avec glossaire cinématographique
4. Possibilité de modifier manuellement si besoin
5. Sauvegarder

### API Endpoint

**URL** : `POST /api/translate-film`

**Body** :
```json
{
  "filmId": "uuid-du-film"
}
```

**Réponse** :
```json
{
  "success": true,
  "source": "tmdb",
  "translations": {
    "title": "Inception",
    "synopsis": "A thief who steals corporate secrets...",
    "genres": "Science Fiction, Action, Thriller",
    "why_watch_content": "For its direction by Christopher Nolan..."
  }
}
```

### Script Batch

Pour traduire tous les films d'un coup :

```bash
node scripts/translate-films-enhanced.js
```

Pour mettre à jour uniquement les genres :

```bash
node scripts/update-genres-translations.js
```

---

## 🎯 Éléments traduits automatiquement

### Via TMDB (gratuit, 0 coût)

| Élément | Français | Anglais |
|---------|----------|---------|
| **Titre** | Inception | Inception (original title) |
| **Synopsis** | Un voleur qui... | A thief who... |
| **Genres** | Science-Fiction, Action, Thriller | Science Fiction, Action, Thriller |

### Via DeepL (avec glossaire)

| Élément | Français | Anglais |
|---------|----------|---------|
| **Pourquoi regarder** | Pour la réalisation... | For its direction... |
| | Pour la photographie... | For its cinematography... |

### Via fichiers de messages

| Élément | Français | Anglais |
|---------|----------|---------|
| Labels | Date d'ajout: | Added on: |
| | Genre: | Genre: |
| Sections | Bande-annonce | Trailer |
| | Staff Remarquable | Staff Pick |
| | Synopsis | Synopsis |
| | Pourquoi regarder ce film ? | Why Watch This Film? |
| | Ce que nous n'avons pas aimé | What We Didn't Like |

---

## 🎬 Bandes-annonces multilingues

**Logique** :
- **Locale FR** : Priorité VF, fallback VO
- **Locale EN** : Priorité VO, fallback VF

**Source** : TMDB API (récupération automatique selon la langue)

---

## 📊 Base de données

### Table `film_translations`

```sql
CREATE TABLE film_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  film_id UUID REFERENCES films(id) ON DELETE CASCADE,
  locale VARCHAR(5) NOT NULL,
  title TEXT,
  synopsis TEXT,
  genres TEXT,
  why_watch_content TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(film_id, locale)
);
```

**Statistiques** :
- 143 films traduits
- 100% avec genres en anglais
- 100% avec synopsis TMDB

---

## 🔍 SEO - État actuel

### ✅ Ce qui est optimisé

**Métadonnées** :
- ✅ `title` : Titre + année + "Critique et avis | MovieHunt"
- ✅ `description` : Note + synopsis + casting
- ✅ `openGraph` : Titre, description, image, type
- ✅ `canonical` : URL canonique
- ✅ Schema.org : MovieSchema avec microdata

**Structure sémantique** :
- ✅ `<article>` pour le film
- ✅ `<section>` pour chaque partie
- ✅ `itemProp` pour données structurées
- ✅ Hiérarchie H1 > H2 > H3 > H4

### 🎯 Recommandations SEO avancées

#### 1. Ajouter `hreflang` (Important)

**Pourquoi** :
- Évite les pénalités de contenu dupliqué
- Google affiche la bonne langue selon la localisation
- Améliore le classement international

**Implémentation** :
```javascript
// Dans generateMetadata()
alternates: {
  languages: {
    'fr': `https://www.moviehunt.fr/films/${params.slug}`,
    'en': `https://www.moviehunt.fr/en/films/${params.slug}`,
    'x-default': `https://www.moviehunt.fr/films/${params.slug}`
  }
}
```

#### 2. URLs séparées `/en/films/...` (Très important)

**Pourquoi** :
- **2x plus de pages indexées** (FR + EN)
- Meilleur classement Google.com (EN) vs Google.fr (FR)
- Analytics plus précis (trafic FR vs EN)
- URLs plus claires

**Implémentation** :
```
FR : /films/inception → Google.fr
EN : /en/films/inception → Google.com
```

#### 3. OpenGraph traduit (Important)

**Pourquoi** :
- Meilleur CTR sur réseaux sociaux
- Plus de partages (contenu dans la bonne langue)
- Google utilise les signaux sociaux

**Implémentation** :
```javascript
// Dans generateMetadata()
const locale = cookies().get('NEXT_LOCALE')?.value || 'fr';

if (locale === 'en') {
  // Récupérer la traduction
  const translation = await getTranslation(film.id);
  
  return {
    title: `${translation.title} (${year}) | MovieHunt`,
    description: `Rating: ${film.note_sur_10}/10. ${translation.synopsis}`,
    openGraph: {
      title: `${translation.title} (${year}) | MovieHunt`,
      description: `Rating: ${film.note_sur_10}/10. ${translation.synopsis}`,
      locale: 'en_US'
    }
  };
}
```

---

## 📈 Statistiques de traduction

**Coûts DeepL** :
- Synopsis : **0€** (TMDB gratuit)
- Genres : **0€** (TMDB gratuit)
- Titre : **0€** (TMDB gratuit)
- Pourquoi regarder : ~500 caractères/film × 143 films = **71,500 caractères**

**Économies** :
- Sans TMDB : ~300,000 caractères DeepL
- Avec TMDB : ~71,500 caractères DeepL
- **Économie : 76%** 💰

---

## 🎨 Glossaire cinématographique

**Termes traduits automatiquement** :

| Français | Anglais |
|----------|---------|
| Pour la réalisation | For its direction |
| Pour la photographie | For its cinematography |
| Pour la mise en scène | For its staging |
| Pour le montage | For its editing |
| Pour la bande originale | For its soundtrack |

**Fichier** : `src/lib/translation/glossary.js`

**Documentation** : `docs/GLOSSARY_GUIDE.md`

---

## 🚀 Workflow complet

### Pour un nouveau film

1. **Créer le film** dans l'admin (données en français)
2. **Aller dans** `/admin/translations`
3. **Sélectionner** le film
4. **Cliquer** sur ✨ Auto-traduire
5. **Vérifier** la traduction (optionnel)
6. **Sauvegarder**

✅ Le film est maintenant bilingue !

### Pour mettre à jour tous les films

```bash
node scripts/translate-films-enhanced.js
```

---

## 📝 Fichiers importants

| Fichier | Description |
|---------|-------------|
| `src/app/api/translate-film/route.js` | API de traduction |
| `src/lib/translation/glossary.js` | Glossaire cinématographique |
| `src/lib/translation/tmdb-enhanced.js` | Logique TMDB + DeepL |
| `scripts/translate-films-enhanced.js` | Script batch traduction |
| `scripts/update-genres-translations.js` | Script mise à jour genres |
| `src/app/admin/translations/page.jsx` | Interface admin |
| `messages/fr.json` | Traductions interface FR |
| `messages/en.json` | Traductions interface EN |

---

## ✅ Checklist avant publication

- [ ] Film créé en français
- [ ] Traduction automatique lancée
- [ ] Vérification qualité traduction
- [ ] Bande-annonce présente (FR et EN)
- [ ] Genres corrects
- [ ] Synopsis cohérent
- [ ] "Pourquoi regarder" traduit avec glossaire

---

## 🎉 Résultat final

**Page film 100% bilingue** :
- ✅ Titre traduit
- ✅ Genres traduits
- ✅ Synopsis traduit
- ✅ Pourquoi regarder traduit
- ✅ Ce qu'on n'a pas aimé traduit
- ✅ Bande-annonce adaptée (VF/VO)
- ✅ Tous les labels traduits
- ✅ SEO préservé
- ✅ Structure sémantique intacte

**Coût** : Minimal (76% d'économie grâce à TMDB)

**Qualité** : Excellente (glossaire cinématographique)

**Maintenance** : Simple (1 clic pour traduire)

---

**Version** : 1.0  
**Dernière mise à jour** : Octobre 2025  
**Auteur** : MovieHunt Team
