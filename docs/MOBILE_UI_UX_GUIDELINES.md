# 📱 Palmera Mobile UI/UX Design Guidelines

## iOS Human Interface Guidelines Compliance

### Touch Targets
- **Minimum**: 44pt × 44pt (iOS standard)
- **Comfortable**: 48pt × 48pt
- **Spacious**: 56pt × 56pt

### Spacing System (8pt Grid)

```typescript
xs:  4pt  (0.25rem) - Icon padding, tight spacing
sm:  8pt  (0.5rem)  - Component internal spacing
md:  16pt (1rem)    - Standard spacing between elements
lg:  24pt (1.5rem)  - Section spacing
xl:  32pt (2rem)    - Major section spacing
2xl: 48pt (3rem)    - Page margins
3xl: 64pt (4rem)    - Hero sections
```

### Typography Scale

```typescript
// Heading Hierarchy
Display: 48pt (3rem)    - Hero titles
H1:      36pt (2.25rem) - Page titles
H2:      28pt (1.75rem) - Section titles
H3:      22pt (1.375rem)- Subsection titles
H4:      18pt (1.125rem)- Card titles

// Body Text
Large:   18pt (1.125rem)- Emphasis text
Base:    16pt (1rem)    - Body text
Small:   14pt (0.875rem)- Secondary text
Caption: 12pt (0.75rem) - Captions, labels
```

### Component Sizing

#### Buttons
```typescript
// Primary Button
Height: 48pt
Padding: 16pt horizontal, 12pt vertical
Font: 16pt semibold
Border Radius: 12pt

// Secondary Button  
Height: 44pt
Padding: 16pt horizontal, 10pt vertical
Font: 15pt medium
Border Radius: 10pt

// Small Button
Height: 36pt
Padding: 12pt horizontal, 8pt vertical
Font: 14pt medium
Border Radius: 8pt
```

#### Cards
```typescript
Padding: 16pt
Border Radius: 16pt
Shadow: 0 4pt 12pt rgba(0,0,0,0.08)
Spacing between cards: 12pt
```

#### Input Fields
```typescript
Height: 48pt
Padding: 16pt horizontal, 12pt vertical
Font: 16pt regular
Border Radius: 12pt
Label margin: 8pt bottom
```

#### Tab Bar
```typescript
Height: 70pt + safe area
Item size: 44pt × 44pt (minimum)
Active pill: 80pt × 40pt
Padding: 12pt top, safe area bottom
Border Radius: 32pt
```

---

## Updated Mobile Navigation Specs

### Tab Bar
- **Total Height**: 70pt + safe area insets
- **Position**: 16pt from bottom, 16pt from sides
- **Border Radius**: 32pt (modern, spacious feel)
- **Background**: Charcoal rgba(44, 44, 44, 0.95)
- **Border**: 1pt gold with 30% opacity

### Tab Items

#### Active State
- **Size**: 80pt × 40pt (pill shape)
- **Background**: Gold (#D4AF37)
- **Icon**: 24pt, Charcoal color
- **Label**: 13pt semibold, Charcoal color
- **Padding**: 16pt horizontal, 8pt vertical
- **Border Radius**: 20pt
- **Shadow**: Gold shadow (4pt blur, 0.3 opacity)

#### Inactive State
- **Size**: 44pt × 44pt (iOS minimum)
- **Icon**: 24pt, Muted color
- **No background**
- **Centered alignment**

### Spacing
- **Between items**: Distributed evenly
- **Edge padding**: 16pt horizontal
- **Top padding**: 12pt
- **Bottom padding**: Safe area insets or 12pt minimum

---

## Content Spacing Rules

### Screen Layout
```typescript
// Page Container
Horizontal padding: 16pt
Top padding: Safe area + 16pt
Bottom padding: Safe area + tab bar + 16pt

// Sections
Margin between sections: 24pt
Section padding: 16pt

// Lists
Row height: Minimum 56pt
Row padding: 12pt vertical, 16pt horizontal
Spacing between rows: 8pt
```

### Card Layout
```typescript
// Standard Card
Width: Screen width - 32pt (16pt padding each side)
Padding: 16pt
Border radius: 16pt
Margin bottom: 12pt

// Small Card
Padding: 12pt
Border radius: 12pt
Margin bottom: 8pt

// Large Card
Padding: 20pt
Border radius: 20pt
Margin bottom: 16pt
```

---

## Color Usage by Component

### Backgrounds
```typescript
// Screen
Light: Off-White (#F9F7F4)
Dark: Midnight Blue (#191970)

// Cards
Light: White (#FFFFFF)
Dark: Charcoal (#2C2C2C)

// Elevated
Light: White with shadow
Dark: Forest Green (#2E5339)
```

### Buttons
```typescript
// Primary
Background: Gold (#D4AF37)
Text: Charcoal (#2C2C2C)
Hover: Forest Green bg, Off-White text

// Secondary
Background: Transparent
Border: Forest Green (2pt)
Text: Forest Green
Hover: Gold bg, Charcoal text

// Destructive
Background: Error red
Text: White
```

### Text Hierarchy
```typescript
Primary: Charcoal (light) / Off-White (dark)
Secondary: #666666 (light) / Sand Beige (dark)
Muted: #999999 (both modes)
Link: Gold
```

---

## Animation Timing

```typescript
// Micro-interactions
Fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
// Button press, icon changes

Standard: 300ms cubic-bezier(0.4, 0, 0.2, 1)
// Navigation, modal open/close

Slow: 500ms cubic-bezier(0.4, 0, 0.2, 1)
// Page transitions, large movements

Bounce: spring(10, 0.8, 0.5)
// Playful interactions, success states
```

---

## Accessibility

### Contrast Ratios (WCAG AA)
- **Normal text**: 4.5:1 minimum
- **Large text**: 3:1 minimum
- **UI components**: 3:1 minimum

### Touch Targets
- **Minimum**: 44pt × 44pt (iOS)
- **Recommended**: 48pt × 48pt
- **Spacing between**: 8pt minimum

### Text Sizing
- **Minimum body**: 16pt (ensures readability)
- **Support Dynamic Type**: iOS text scaling
- **Line height**: 1.5× font size (body text)

---

## Implementation Checklist

### Navigation
- ✅ Tab bar: 70pt + safe area
- ✅ Active tab: 80pt × 40pt
- ✅ Inactive tab: 44pt × 44pt
- ✅ Icon size: 24pt
- ✅ Proper spacing and padding

### Buttons
- ⏳ Primary: 48pt height
- ⏳ Secondary: 44pt height
- ⏳ 16pt horizontal padding
- ⏳ 12pt border radius

### Cards
- ⏳ 16pt padding
- ⏳ 16pt border radius
- ⏳ Proper shadows
- ⏳ 12pt spacing between

### Typography
- ⏳ 16pt minimum body
- ⏳ Proper hierarchy
- ⏳ 1.5× line height
- ⏳ Consistent weights

---

## Example Implementations

### Button Component
```tsx
<TouchableOpacity
  style={{
    height: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.gold,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  }}
  activeOpacity={0.8}
>
  <Text style={{
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.charcoal,
    letterSpacing: 0.3,
  }}>
    Book Now
  </Text>
</TouchableOpacity>
```

### Card Component
```tsx
<View style={{
  padding: 16,
  borderRadius: 16,
  backgroundColor: theme.colors.surface,
  borderWidth: 1,
  borderColor: theme.colors.border,
  shadowColor: theme.colors.gold,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 3,
  marginBottom: 12,
}}>
  {/* Card content */}
</View>
```

### Input Field
```tsx
<View style={{ marginBottom: 16 }}>
  <Text style={{
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 8,
  }}>
    Label
  </Text>
  <TextInput
    style={{
      height: 48,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      color: theme.colors.text,
    }}
    placeholderTextColor={theme.colors.textMuted}
  />
</View>
```

---

*Last Updated: October 2025*
*iOS HIG Compliant | WCAG AA Accessible*

