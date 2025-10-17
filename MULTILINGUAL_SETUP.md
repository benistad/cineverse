# Configuration Multilingue MovieHunt (FR/EN)

## 📋 Vue d'ensemble

MovieHunt supporte maintenant deux langues : **Français (par défaut)** et **Anglais**.

### Fonctionnalités implémentées

✅ **Détection automatique de la langue**
- Détection via l'en-tête `Accept-Language` du navigateur
- Les visiteurs des USA voient automatiquement le contenu en anglais (si disponible)
- Cookie `NEXT_LOCALE` pour mémoriser la préférence

✅ **Sélecteur de langue dans la navbar**
- Icône globe avec drapeaux 🇫🇷 🇺🇸
- Changement instantané de langue
- Disponible en desktop et mobile

✅ **Interface traduite**
- Navigation (navbar, footer)
- Boutons et labels
- Messages système

✅ **Contenu des films traduit**
- Titre
- Synopsis
- "Pourquoi regarder"
- "Ce qu'on n'a pas aimé"
- Staff remarquable

✅ **Interface d'administration**
- Page dédiée : `/admin/translations`
- Gestion facile des traductions anglaises
- Indicateur visuel des films traduits

---

## 🚀 Installation

### 1. Créer les tables dans Supabase

Connectez-vous à votre dashboard Supabase et exécutez les scripts SQL :

#### a) Table des traductions de films
```sql
-- Copier et exécuter le contenu de schema/film_translations.sql
```

#### b) Table des traductions du staff
```sql
-- Copier et exécuter le contenu de schema/staff_translations.sql
```

### 2. Vérifier l'installation

```sql
-- Vérifier que les tables existent
SELECT table_name FROM information_schema.tables 
WHERE table_name IN ('film_translations', 'staff_translations');
```

---

## 📝 Utilisation

### Pour les administrateurs

#### Accéder à l'interface de traduction
1. Connectez-vous à l'admin
2. Allez sur `/admin/translations`
3. Sélectionnez un film dans la liste
4. Remplissez les champs en anglais
5. Cliquez sur "Sauvegarder"

#### Indicateurs visuels
- ✅ **Icône verte** = Film déjà traduit
- **Pas d'icône** = Film non traduit

### Pour les visiteurs

#### Changement de langue
1. Cliquez sur l'icône globe 🌍 dans la navbar
2. Sélectionnez la langue souhaitée
3. La page se recharge avec la nouvelle langue

#### Détection automatique
- Les visiteurs avec navigateur en anglais voient automatiquement le contenu en anglais
- Les visiteurs français voient le contenu en français
- La préférence est sauvegardée dans un cookie

---

## 🏗️ Architecture technique

### Structure des fichiers

```
src/
├── i18n/
│   └── request.js              # Configuration next-intl
├── contexts/
│   └── LanguageContext.jsx     # Context React pour la langue
├── hooks/
│   └── useTranslations.js      # Hook pour accéder aux traductions
├── lib/
│   └── translations.js         # Helpers pour récupérer les traductions
├── components/
│   └── LanguageSelector.jsx    # Sélecteur de langue
└── middleware.js               # Détection et gestion de la langue

messages/
├── fr.json                     # Traductions françaises de l'interface
└── en.json                     # Traductions anglaises de l'interface

schema/
├── film_translations.sql       # Table des traductions de films
├── staff_translations.sql      # Table des traductions du staff
└── README_TRANSLATIONS.md      # Documentation SQL
```

### Base de données

#### Table `film_translations`
- Stocke les traductions des films
- Clé unique : `(film_id, locale)`
- Fallback automatique vers le français si traduction manquante

#### Table `staff_translations`
- Stocke les traductions du staff remarquable
- Clé unique : `(staff_id, locale)`
- Fallback automatique vers le français

### Middleware
- Détecte la langue du visiteur
- Définit le cookie `NEXT_LOCALE`
- Appliqué sur toutes les routes publiques

---

## 🔧 Développement

### Ajouter une nouvelle traduction d'interface

1. Modifier `messages/fr.json` et `messages/en.json`
2. Utiliser dans un composant :

```jsx
import { useTranslations } from '@/hooks/useTranslations';

function MyComponent() {
  const { t } = useTranslations();
  
  return <h1>{t('nav.blog')}</h1>;
}
```

### Récupérer un film avec traduction

```javascript
import { getFilmWithTranslation } from '@/lib/translations';

const film = await getFilmWithTranslation(filmId, 'en');
// Le film aura les champs traduits si disponibles
```

### Sauvegarder une traduction

```javascript
import { saveFilmTranslation } from '@/lib/translations';

await saveFilmTranslation(filmId, 'en', {
  title: 'English Title',
  synopsis: 'English synopsis...',
  why_watch_content: 'Why watch...',
  what_we_didnt_like: 'What we didn\'t like...'
});
```

---

## 🎯 Prochaines étapes (optionnel)

### Phase 1 : Traductions de base
- [ ] Traduire les 20 films les mieux notés
- [ ] Traduire les films "Hunted by MovieHunt"
- [ ] Traduire la page "Quel film regarder"

### Phase 2 : Traductions avancées
- [ ] Traduire les pages statiques (Comment nous travaillons, etc.)
- [ ] Traduire les genres de films
- [ ] Ajouter des traductions automatiques via API (DeepL, Google Translate)

### Phase 3 : SEO international
- [ ] Créer des URLs localisées (`/en/films/...`)
- [ ] Ajouter des balises hreflang
- [ ] Créer un sitemap multilingue

---

## 🐛 Dépannage

### Le sélecteur de langue n'apparaît pas
- Vérifier que `LanguageProvider` est bien dans `ClientLayout.jsx`
- Vérifier la console pour des erreurs JavaScript

### Les traductions ne s'affichent pas
- Vérifier que les tables SQL ont été créées
- Vérifier que les traductions existent dans la base
- Vérifier le cookie `NEXT_LOCALE` dans les DevTools

### Erreur "Translation key not found"
- La clé n'existe pas dans `messages/fr.json` ou `messages/en.json`
- Ajouter la clé manquante dans les deux fichiers

---

## 📊 Statistiques

### Commandes SQL utiles

```sql
-- Nombre de films traduits
SELECT COUNT(*) FROM film_translations WHERE locale = 'en';

-- Pourcentage de films traduits
SELECT 
  ROUND(
    (SELECT COUNT(*) FROM film_translations WHERE locale = 'en')::numeric / 
    (SELECT COUNT(*) FROM films)::numeric * 100, 
    2
  ) as percentage_translated;

-- Films non traduits
SELECT f.id, f.title 
FROM films f
LEFT JOIN film_translations ft ON f.id = ft.film_id AND ft.locale = 'en'
WHERE ft.id IS NULL
ORDER BY f.title;
```

---

## 📞 Support

Pour toute question ou problème :
1. Consulter ce document
2. Vérifier les logs de la console
3. Vérifier les tables Supabase
4. Contacter l'équipe de développement

---

**Version** : 1.0  
**Date** : Octobre 2025  
**Auteur** : Équipe MovieHunt
