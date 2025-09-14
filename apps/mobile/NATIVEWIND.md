# NativeWind Setup for Palmera Mobile

This mobile app now uses **NativeWind** to bring Tailwind CSS to React Native, creating consistency with the web dashboards.

## What's Included

### 🎨 **Design System Integration**
- Uses the same design tokens as web apps (`packages/tokens`)
- Consistent colors, spacing, typography across all platforms
- Shared Tailwind configuration via `packages/ui/tailwind.config.js`

### 📱 **NativeWind Features**
- Tailwind CSS classes work directly in React Native components
- Responsive design utilities
- Dark mode support (when configured)
- Optimized for mobile performance

## Usage Examples

### Basic Styling
```tsx
import { View, Text } from 'react-native';

export default function MyComponent() {
  return (
    <View className="flex-1 bg-background p-6">
      <Text className="text-2xl font-bold text-text mb-4">
        Hello NativeWind!
      </Text>
    </View>
  );
}
```

### Using Design Tokens
```tsx
<View className="bg-primary rounded-lg p-4">
  <Text className="text-white font-semibold">Primary Button</Text>
</View>

<View className="bg-surface border border-border rounded-lg p-4">
  <Text className="text-text">Card Content</Text>
</View>
```

### Interactive Elements
```tsx
<TouchableOpacity className="bg-primary rounded-lg p-4 active:bg-primary/80">
  <Text className="text-white text-center font-semibold">
    Touchable Button
  </Text>
</TouchableOpacity>
```

## Available Design Tokens

### Colors
- **Brand**: `midnight`, `palm`, `ivory`, `sandstone`, `gold`
- **Semantic**: `primary`, `secondary`, `accent`, `background`, `surface`
- **Text**: `text`, `textSecondary`, `textMuted`
- **Status**: `success`, `warning`, `error`, `info`

### Spacing
- Uses consistent spacing scale: `p-2`, `p-4`, `p-6`, etc.
- Margin utilities: `m-2`, `mx-4`, `my-6`, etc.

### Typography
- Font sizes: `text-sm`, `text-base`, `text-lg`, `text-xl`, etc.
- Font weights: `font-normal`, `font-medium`, `font-semibold`, `font-bold`

## Configuration Files

- `tailwind.config.js` - Tailwind configuration with design tokens
- `babel.config.js` - Includes NativeWind babel plugin
- `metro.config.js` - Metro bundler configuration for NativeWind
- `global.css` - Tailwind CSS imports
- `nativewind-env.d.ts` - TypeScript declarations

## Development

1. **Start the app**: `npm run start`
2. **Use Tailwind classes**: Apply classes directly to React Native components
3. **Hot reload**: Changes to Tailwind classes update automatically
4. **TypeScript**: Full IntelliSense support for Tailwind classes

## Benefits

✅ **Consistency**: Same styling system across web and mobile  
✅ **Productivity**: Familiar Tailwind syntax for React Native  
✅ **Maintainability**: Centralized design tokens  
✅ **Performance**: Optimized for mobile rendering  
✅ **Developer Experience**: Great TypeScript support  

## Examples in App

Check out these example components:
- `src/components/NativeWindExample.tsx` - Basic NativeWind usage
- `src/components/DesignTokensExample.tsx` - Design tokens showcase

## Next Steps

1. Migrate existing StyleSheet components to NativeWind classes
2. Create reusable component library using design tokens
3. Implement responsive design patterns
4. Add dark mode support
