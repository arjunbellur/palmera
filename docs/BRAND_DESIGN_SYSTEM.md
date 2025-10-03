# 🌴 Palmera Brand Design System

## Brand Identity

**Logo**: Golden palm tree (🌴) on deep backgrounds  
**Tagline**: "Escape. Indulge. Experience."  
**Tone**: Premium, exclusive, indulgent, modern-luxury travel

---

## Color System

### Core Palette
```typescript
Forest Green  → #2E5339  // Trust, calm, premium nature
Gold          → #D4AF37  // Luxury, accents, CTAs
Midnight Blue → #191970  // Depth, exclusivity
```

### Supporting Neutrals
```typescript
Sand Beige    → #E6D5B8  // Warm neutral backgrounds
Off-White     → #F9F7F4  // Minimal, light mode balance
Charcoal Gray → #2C2C2C  // Text/dark mode base
```

### Usage Ratios (60-25-10-5 Rule)
- **60%** Midnight Blue / Charcoal → Backgrounds, dark mode
- **25%** Forest Green → Section accents, highlights
- **10%** Gold → CTAs, highlights, dividers
- **5%** Beige/Off-White → Contrast, light mode

---

## Typography

### Font Families
- **Headings**: Playfair Display, Garamond (Serif elegance)
- **Body**: Inter, Space Grotesk (Modern sans)

### Scale
```typescript
Display → 72px (4.5rem)
H1      → 48px (3rem)
H2      → 36px (2.25rem)
H3      → 30px (1.875rem)
H4      → 24px (1.5rem)
Body    → 16px (1rem)
Small   → 14px (0.875rem)
```

---

## UI Components

### Buttons

**Primary Button**
- Background: Gold (#D4AF37)
- Text: Charcoal (#2C2C2C)
- Hover: Forest Green bg, Off-White text
- Border Radius: 8px (0.5rem)

**Secondary Button**
- Background: Transparent
- Border: Forest Green
- Text: Forest Green
- Hover: Gold bg, Charcoal text

### Cards/Containers
- Rounded corners (16px)
- Soft gold shadows
- Subtle gold borders on hover
- Light: White bg, Beige border
- Dark: Charcoal bg, Forest Green border

### Navigation
- Active state: Gold (dark mode) / Forest Green (light mode)
- Hover: Gold highlight
- Background: Charcoal with transparency
- Border: Gold with 25% opacity

---

## Platform-Specific Implementation

### Web App (Next.js + Tailwind)

**File**: `apps/web-unified/tailwind.config.js`

```javascript
colors: {
  'forest-green': '#2E5339',
  'gold': '#D4AF37',
  'midnight-blue': '#191970',
  'sand-beige': '#E6D5B8',
  'off-white': '#F9F7F4',
  'charcoal': '#2C2C2C',
}
```

**Components**:
- Homepage → Hero with midnight blue gradient, gold palm fade-in
- Search → Beige/light surfaces, gold accents
- Navigation → Forest green header, gold CTAs
- Cards → White/charcoal with gold borders

### Mobile App (React Native + Expo)

**File**: `apps/mobile/src/theme/palmeraTheme.ts`

```typescript
export const palmeraTheme = {
  colors: {
    forestGreen: '#2E5339',
    gold: '#D4AF37',
    midnightBlue: '#191970',
    // ... semantic colors
  },
  typography: {
    fontFamily: {
      heading: 'Playfair Display',
      body: 'Inter',
    },
  },
}
```

**Components**:
- Tab Navigation → Gold active state, charcoal bg with gold border
- Cards → Beige/light backgrounds, gold shadows
- Headers → Forest Green (light) / Midnight Blue (dark)

---

## Design Tokens

### Spacing (8px base unit)
```
xs  → 4px
sm  → 8px
md  → 16px
lg  → 24px
xl  → 32px
2xl → 48px
3xl → 64px
```

### Shadows (Gold-tinted)
```
sm  → rgba(212, 175, 55, 0.05)
md  → rgba(212, 175, 55, 0.15)
lg  → rgba(212, 175, 55, 0.2)
xl  → rgba(212, 175, 55, 0.25)
```

### Border Radius
```
sm     → 4px
md     → 8px
lg     → 16px
xl     → 24px
button → 8px
card   → 16px
```

---

## Light/Dark Mode

### Light Mode
- Background: Off-White (#F9F7F4)
- Surface: White (#FFFFFF)
- Primary: Forest Green (#2E5339)
- Text: Charcoal (#2C2C2C)

### Dark Mode
- Background: Midnight Blue (#191970)
- Surface: Charcoal (#2C2C2C)
- Primary: Gold (#D4AF37)
- Text: Off-White (#F9F7F4)

### Toggle Implementation
```tsx
// Web
<button onClick={() => setDarkMode(!darkMode)}>
  {darkMode ? '☀️' : '🌙'}
</button>

// Mobile
const colorScheme = useColorScheme();
const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
```

---

## Marketing Schema

### Visual Language
- Golden palm tree motif throughout
- Luxury textures (beige + midnight blue)
- Soft, elegant shadows
- Serif headlines with sans body copy

### Copy Style
- Short, indulgent, aspirational
- Examples:
  - "Your escape, your circle, your way"
  - "Discover exclusive luxury travel"
  - "Crafted for the discerning traveler"

### App Icon
- Gold palm (🌴) on forest green square
- Rounded corners
- Subtle gold border

---

## Example Screens

### 1. Homepage
```
- Hero: Midnight blue gradient
- Palm logo: Gold, fade-in animation
- Tagline: "Escape. Indulge. Experience."
- Search bar: White with gold accents
- Featured destinations: Cards with gold hover states
```

### 2. Listing Page
```
- Background: Off-white/Beige
- Cards: White with gold borders on hover
- Dividers: Gold
- Book button: Gold primary
```

### 3. Profile
```
- Header: Forest green (light) / Midnight blue (dark)
- Avatar: Gold border
- Sections: Cards with gold accents
```

### 4. Group Dashboard
```
- Background: Midnight blue
- Progress bars: Gold
- Member avatars: Forest green highlights
- Stats cards: Charcoal with gold borders
```

---

## Implementation Checklist

- ✅ Design tokens created (`packages/tokens/src/`)
- ✅ Tailwind config updated
- ✅ React Native theme created
- ✅ Mobile navigation styled
- ✅ Web homepage redesigned
- ⏳ Light/dark mode toggle
- ⏳ All component updates
- ⏳ Splash screens
- ⏳ Marketing assets

---

## Files Modified

### Core Tokens
- `packages/tokens/src/colors.ts`
- `packages/tokens/src/typography.ts`
- `packages/tokens/src/spacing.ts`
- `packages/tokens/src/index.ts`

### Web
- `apps/web-unified/tailwind.config.js`
- `apps/web-unified/src/app/page.tsx`

### Mobile
- `apps/mobile/src/theme/palmeraTheme.ts`
- `apps/mobile/src/app/(tabs)/_layout.tsx`

---

## Usage Examples

### Web Button
```tsx
<button className="px-8 py-4 bg-gold text-charcoal font-semibold rounded-button hover:bg-forest-green hover:text-off-white transition-all duration-300 shadow-gold">
  Book Now
</button>
```

### Mobile Button
```tsx
<TouchableOpacity 
  style={{
    backgroundColor: theme.colors.gold,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  }}
>
  <Text style={{
    color: theme.colors.charcoal,
    fontSize: theme.typography.fontSize.base,
    fontWeight: '600',
  }}>
    Book Now
  </Text>
</TouchableOpacity>
```

---

*Last Updated: October 2025*
*Brand Version: 1.0*

