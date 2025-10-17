# Configuration des traductions pour MovieHunt

## Étapes d'installation

### 1. Créer les tables de traduction dans Supabase

Connectez-vous à votre dashboard Supabase et exécutez les scripts SQL suivants dans l'ordre :

#### a) Table des traductions de films
```sql
-- Exécuter le contenu de film_translations.sql
```

#### b) Table des traductions du staff
```sql
-- Exécuter le contenu de staff_translations.sql
```

### 2. Vérifier que les tables ont été créées

Vous devriez voir deux nouvelles tables :
- `film_translations` : Stocke les traductions des films
- `staff_translations` : Stocke les traductions du staff remarquable

### 3. Structure des données

#### film_translations
- `id` : UUID (clé primaire)
- `film_id` : VARCHAR (référence à films.id)
- `locale` : VARCHAR(5) ('fr' ou 'en')
- `title` : VARCHAR (titre traduit)
- `synopsis` : TEXT (synopsis traduit)
- `why_watch_content` : TEXT (contenu "Pourquoi regarder" traduit)
- `what_we_didnt_like` : TEXT (contenu "Ce qu'on n'a pas aimé" traduit)
- `created_at` : TIMESTAMP
- `updated_at` : TIMESTAMP

#### staff_translations
- `id` : UUID (clé primaire)
- `staff_id` : UUID (référence à remarkable_staff.id)
- `locale` : VARCHAR(5) ('fr' ou 'en')
- `description` : TEXT (description traduite)
- `created_at` : TIMESTAMP
- `updated_at` : TIMESTAMP

### 4. Fonctionnement

#### Langue par défaut : Français
- Les données françaises restent dans les tables principales (`films`, `remarkable_staff`)
- Pas besoin de créer des traductions FR dans `film_translations`

#### Traductions anglaises
- Stockées dans `film_translations` avec `locale = 'en'`
- Stockées dans `staff_translations` avec `locale = 'en'`

#### Détection automatique de la langue
- Le middleware détecte la langue du visiteur via l'en-tête `Accept-Language`
- Les visiteurs des USA verront automatiquement le contenu en anglais (si disponible)
- Un sélecteur de langue permet de changer manuellement

### 5. Interface d'administration

Une interface sera ajoutée dans l'admin pour :
- Voir quels films ont des traductions
- Ajouter/modifier les traductions anglaises
- Prévisualiser le contenu dans les deux langues

### 6. Fallback automatique

Si une traduction n'existe pas :
- Le contenu français est affiché par défaut
- Aucune erreur n'est générée
- L'interface reste fonctionnelle

## Commandes SQL utiles

### Vérifier les traductions existantes
```sql
SELECT f.title, ft.locale, ft.title as translated_title
FROM films f
LEFT JOIN film_translations ft ON f.id = ft.film_id
ORDER BY f.title;
```

### Compter les films traduits
```sql
SELECT locale, COUNT(*) as count
FROM film_translations
GROUP BY locale;
```

### Supprimer toutes les traductions (ATTENTION)
```sql
DELETE FROM film_translations;
DELETE FROM staff_translations;
```
