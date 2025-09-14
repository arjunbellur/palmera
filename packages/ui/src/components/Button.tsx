import { Pressable, Text, ViewStyle, TextStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  variant?: 'primary'|'outline';
  onPress?: () => void;
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function Button({ children, variant='primary', onPress, className, style, textStyle }: Props) {
  // Using traditional styles for consistent styling
  const baseStyles: ViewStyle = {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  };
  
  const variantStyles: ViewStyle = variant === 'primary' 
    ? { backgroundColor: '#f97316' } 
    : { borderWidth: 1, borderColor: '#f97316' };
  
  const textStyles: TextStyle = {
    fontWeight: '600',
    fontSize: 16,
    color: variant === 'primary' ? '#ffffff' : '#f97316',
    textAlign: 'center',
  };

  return (
    <Pressable 
      onPress={onPress} 
      style={[baseStyles, variantStyles, style]}
    >
      <Text style={[textStyles, textStyle]}>{children}</Text>
    </Pressable>
  );
}