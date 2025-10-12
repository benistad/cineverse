# 🎨 Charte Graphique MovieHunt

## 📝 Police de caractères

### Famille de police
**Poppins** (Google Fonts)
- Poids disponibles : 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

### Tailles de police

#### Navigation
- **Logo** : `text-2xl` (24px) - Bold (700)
- **Liens de navigation** : `text-sm` (14px) - Medium (500)
- **Dropdown menu** : `text-sm` (14px) - Regular (400)

#### Hero Section
- **Titre principal (H1)** : `text-5xl md:text-6xl` (48px / 60px) - ExtraBold (800)
- **Sous-titre (H2)** : `text-xl md:text-2xl` (20px / 24px) - Regular (400)
- **Paragraphe** : `text-xl md:text-2xl` (20px / 24px) - Regular (400)
- **Bouton CTA** : `text-lg` (18px) - SemiBold (600)

#### Sections de films
- **Titres de section (H2)** : `text-3xl md:text-4xl` (30px / 36px) - Bold (700)
- **Liens "Voir tout"** : `text-base` (16px) - Medium (500)

#### Cartes de films
- **Titre du film** : `text-xl` (20px) - Bold (700)
- **Métadonnées** : `text-sm` (14px) - Regular (400)
- **Synopsis** : `text-sm` (14px) - Regular (400)

---

## 🎨 Palette de couleurs

### Couleurs principales

#### Indigo (Couleur de marque)
- **indigo-600** : `#4F46E5` 
  - Usage : Boutons CTA, liens actifs
  - Tailwind : `bg-indigo-600`, `text-indigo-600`

- **indigo-700** : `#4338CA`
  - Usage : Logo, hover des boutons
  - Tailwind : `bg-indigo-700`, `text-indigo-700`

- **indigo-800** : `#3730A3`
  - Usage : Titres principaux (H1, H2)
  - Tailwind : `text-indigo-800`

#### Orange (Accent)
- **Orange MovieHunt** : `#FEBE29`
  - Usage : Mots-clés importants, accents, éléments de marque
  - CSS : `color: #FEBE29` ou `var(--color-orange-accent)`

### Couleurs de texte

#### Gris
- **gray-600** : `#4B5563`
  - Usage : Texte secondaire, liens navigation
  - Tailwind : `text-gray-600`

- **gray-700** : `#374151`
  - Usage : Texte principal, menu mobile
  - Tailwind : `text-gray-700`

- **gray-800** : `#1F2937`
  - Usage : Texte dans search bar
  - Tailwind : `text-gray-800`

- **gray-900** : `#111827`
  - Usage : Titres de cartes
  - Tailwind : `text-gray-900`

### Couleurs de fond

#### Backgrounds clairs
- **gray-50** : `#F9FAFB`
  - Usage : Fond général
  - Tailwind : `bg-gray-50`

- **gray-100** : `#F3F4F6`
  - Usage : Search bar, éléments interactifs
  - Tailwind : `bg-gray-100`

- **blue-50** : `#EFF6FF`
  - Usage : Gradient de fond (début)
  - Tailwind : `from-blue-50`

- **indigo-50** : `#EEF2FF`
  - Usage : Hover states, états actifs
  - Tailwind : `bg-indigo-50`, `hover:bg-indigo-50`

- **indigo-100** : `#E0E7FF`
  - Usage : Gradient de fond (fin)
  - Tailwind : `to-indigo-100`

#### Backgrounds blancs
- **white** : `#FFFFFF`
  - Usage : Cartes, navbar, dropdown
  - Tailwind : `bg-white`

### Couleurs d'état

#### Focus
- **indigo-300** : `#A5B4FC`
  - Usage : Ring de focus sur inputs
  - Tailwind : `focus:ring-indigo-300`

#### Bordures
- **gray-200** : `#E5E7EB`
  - Usage : Bordures subtiles, séparateurs
  - Tailwind : `border-gray-200`

---

## 🎭 Styles d'interface

### Boutons

#### Bouton CTA principal
```css
bg-indigo-600 
hover:bg-indigo-700 
text-white 
text-lg 
font-semibold 
rounded-full 
px-8 py-4 
shadow-lg 
transform hover:scale-105 
transition-all duration-300
```

#### Liens "Voir tout"
```css
text-indigo-600 
hover:text-indigo-800 
font-medium 
group
/* Avec flèche animée */
```

### Cartes

#### Carte de film
```css
bg-white 
rounded-xl 
shadow-md 
overflow-hidden 
transition-all duration-300 
hover:scale-102 
hover:shadow-xl
```

### Navigation

#### Navbar
```css
bg-white 
shadow-lg 
sticky top-0 
z-50
```

#### Liens de navigation
```css
text-gray-600 
hover:text-indigo-700 
transition-colors duration-200
```

#### Dropdown menu
```css
bg-white 
rounded-md 
shadow-lg 
ring-1 ring-gray-200
```

### Inputs

#### Search bar
```css
bg-gray-100 
text-gray-800 
rounded-full 
py-2 pl-10 pr-4 
focus:outline-none 
focus:ring-2 
focus:ring-indigo-300 
transition-all duration-300
```

---

## 🌈 Gradients

### Gradient de fond principal
```css
bg-gradient-to-br from-blue-50 to-indigo-100
```

### Gradient hero section
```css
bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50
```

---

## ✨ Animations et transitions

### Transitions standards
- **Durée** : `duration-200` (200ms) pour les interactions rapides
- **Durée** : `duration-300` (300ms) pour les animations plus fluides
- **Easing** : `ease-in-out` pour les transformations

### Hover effects

#### Logo
```css
group-hover:rotate-6 
transition-transform duration-300
```

#### Icônes
```css
group-hover:scale-110 
transition-transform
```

#### Flèches
```css
group-hover:translate-x-1 
transition-transform
```

#### Cartes
```css
hover:scale-102 
transition-all duration-300
```

---

## 📐 Espacements

### Padding
- **Sections** : `py-16 px-4`
- **Cartes** : `p-4`
- **Boutons** : `px-8 py-4` (CTA), `px-3 py-2` (navigation)

### Margin
- **Entre sections** : `space-y-8`
- **Entre éléments de navigation** : `space-x-6`

### Border radius
- **Cartes** : `rounded-xl` (12px)
- **Boutons CTA** : `rounded-full`
- **Search bar** : `rounded-full`
- **Dropdown** : `rounded-md` (6px)

---

## 🎯 Hiérarchie visuelle

### Ordre d'importance des couleurs
1. **Indigo-800** : Titres principaux
2. **Indigo-600/700** : Actions principales (boutons, liens)
3. **Orange #FEBE29** : Accents et mots-clés importants
4. **Gray-600/700** : Texte secondaire
5. **Gray-400** : Icônes et éléments désactivés

### Ordre d'importance typographique
1. **H1** : 48-60px, ExtraBold
2. **H2** : 30-36px, Bold
3. **Boutons CTA** : 18px, SemiBold
4. **Titres de cartes** : 20px, Bold
5. **Corps de texte** : 14-16px, Regular

---

## 📱 Responsive

### Breakpoints Tailwind
- **sm** : 640px
- **md** : 768px
- **lg** : 1024px
- **xl** : 1280px

### Adaptations
- Logo : `text-2xl` (fixe)
- Hero H1 : `text-5xl` → `md:text-6xl`
- Hero H2/P : `text-xl` → `md:text-2xl`
- Titres sections : `text-3xl` → `md:text-4xl`

---

## 🔍 Accessibilité

### Contraste
- Tous les textes respectent WCAG AA (4.5:1 minimum)
- Indigo-800 sur blanc : ✅ Excellent contraste
- Gray-600 sur blanc : ✅ Bon contraste

### Focus states
- Ring indigo visible sur tous les éléments interactifs
- `focus:ring-2 focus:ring-indigo-300`

### Hover states
- Changements de couleur clairs et visibles
- Transitions fluides pour meilleure UX

---

*Dernière mise à jour : 12 octobre 2025*
