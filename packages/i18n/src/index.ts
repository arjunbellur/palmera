// i18n configuration and utilities
export { i18n } from './i18n';
export { useTranslation } from './hooks/useTranslation';
export { TranslationProvider } from './components/TranslationProvider';

// Locale data
export * from './locales/en';
export * from './locales/fr';

// Utilities
export { formatCurrency, formatDate, formatTime } from './utils/formatters';
