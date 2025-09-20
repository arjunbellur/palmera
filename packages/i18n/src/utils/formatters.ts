import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';

const locales = {
  en: enUS,
  fr: fr,
};

export function formatCurrency(
  amount: number,
  currency: string = 'XOF',
  language: string = 'en'
): string {
  const currencySymbols: Record<string, string> = {
    XOF: 'FCFA',
    USD: '$',
    EUR: '€',
  };

  const symbol = currencySymbols[currency] || currency;
  
  if (language === 'fr') {
    return `${amount.toLocaleString('fr-FR')} ${symbol}`;
  }
  
  return `${symbol} ${amount.toLocaleString('en-US')}`;
}

export function formatDate(
  date: string | Date,
  formatString: string = 'PPP',
  language: string = 'en'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const locale = locales[language as keyof typeof locales] || locales.en;
  
  return format(dateObj, formatString, { locale });
}

export function formatTime(
  date: string | Date,
  formatString: string = 'p',
  language: string = 'en'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const locale = locales[language as keyof typeof locales] || locales.en;
  
  return format(dateObj, formatString, { locale });
}

export function formatRelativeTime(
  date: string | Date,
  language: string = 'en'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const locale = locales[language as keyof typeof locales] || locales.en;
  
  return formatDistanceToNow(dateObj, { 
    addSuffix: true, 
    locale 
  });
}

export function formatNumber(
  number: number,
  language: string = 'en'
): string {
  if (language === 'fr') {
    return number.toLocaleString('fr-FR');
  }
  
  return number.toLocaleString('en-US');
}

export function formatPhoneNumber(
  phoneNumber: string,
  country: string = 'SN'
): string {
  // Basic phone number formatting for Senegal
  if (country === 'SN') {
    // Remove all non-digits
    const digits = phoneNumber.replace(/\D/g, '');
    
    // Format as +221 XX XXX XX XX
    if (digits.startsWith('221')) {
      return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)}`;
    } else if (digits.startsWith('77') || digits.startsWith('78') || digits.startsWith('76') || digits.startsWith('70')) {
      return `+221 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
    }
  }
  
  return phoneNumber;
}

export function formatFileSize(
  bytes: number,
  language: string = 'en'
): string {
  const units = language === 'fr' 
    ? ['octets', 'Ko', 'Mo', 'Go', 'To']
    : ['bytes', 'KB', 'MB', 'GB', 'TB'];
  
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}
