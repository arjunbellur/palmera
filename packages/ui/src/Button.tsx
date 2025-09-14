import { Pressable, Text } from 'react-native';

type Props = {
  children: React.ReactNode;
  variant?: 'primary'|'outline';
  onPress?: () => void;
  className?: string;
};

export function Button({ children, variant='primary', onPress, className }: Props) {
  const base = 'px-4 py-3 rounded-xl';
  const style = variant === 'primary' ? 'bg-brand' : 'border border-brand';
  const text  = variant === 'primary' ? 'text-white' : 'text-brand';
  return (
    <Pressable onPress={onPress} className={`${base} ${style} ${className ?? ''}`}>
      <Text className={`${text} font-semibold text-base`}>{children as any}</Text>
    </Pressable>
  );
}
