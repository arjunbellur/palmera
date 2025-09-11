import { PaymentAdapter } from './interfaces/payment-adapter.interface';
import { StripeAdapter } from './adapters/stripe.adapter';
import { FlutterwaveAdapter } from './adapters/flutterwave.adapter';
import { OrangeMoneyAdapter } from './adapters/orange-money.adapter';
import { PaystackAdapter } from './adapters/paystack.adapter';

export type PaymentProvider = 'stripe' | 'flutterwave' | 'orange_money' | 'paystack';

export interface PaymentRegistry {
  getAdapter(provider: PaymentProvider): PaymentAdapter;
  getProviderForCountry(country: string): PaymentProvider;
  getSupportedProviders(): PaymentProvider[];
  getSupportedCountries(): string[];
}

export class PaymentRegistryImpl implements PaymentRegistry {
  private adapters: Map<PaymentProvider, PaymentAdapter> = new Map();

  constructor(
    private stripeAdapter: StripeAdapter,
    private flutterwaveAdapter: FlutterwaveAdapter,
    private orangeMoneyAdapter: OrangeMoneyAdapter,
    private paystackAdapter: PaystackAdapter,
  ) {
    this.adapters.set('stripe', stripeAdapter);
    this.adapters.set('flutterwave', flutterwaveAdapter);
    this.adapters.set('orange_money', orangeMoneyAdapter);
    this.adapters.set('paystack', paystackAdapter);
  }

  getAdapter(provider: PaymentProvider): PaymentAdapter {
    const adapter = this.adapters.get(provider);
    if (!adapter) {
      throw new Error(`Payment provider ${provider} not supported`);
    }
    return adapter;
  }

  getProviderForCountry(country: string): PaymentProvider {
    // Country-specific payment provider mapping
    const countryProviderMap: Record<string, PaymentProvider> = {
      // West Africa - Orange Money primary
      'SN': 'orange_money', // Senegal
      'CI': 'orange_money', // Côte d'Ivoire
      'ML': 'orange_money', // Mali
      'BF': 'orange_money', // Burkina Faso
      'NE': 'orange_money', // Niger
      'GN': 'orange_money', // Guinea
      
      // Nigeria - Flutterwave primary
      'NG': 'flutterwave',
      
      // Ghana - Flutterwave primary
      'GH': 'flutterwave',
      
      // Kenya - Flutterwave primary
      'KE': 'flutterwave',
      
      // South Africa - Stripe primary
      'ZA': 'stripe',
      
      // Default fallback
      'DEFAULT': 'stripe',
    };

    return countryProviderMap[country] || countryProviderMap['DEFAULT'];
  }

  getSupportedProviders(): PaymentProvider[] {
    return Array.from(this.adapters.keys());
  }

  getSupportedCountries(): string[] {
    const countries = new Set<string>();
    
    // Add countries supported by each provider
    this.adapters.forEach((adapter) => {
      // This would need to be implemented in each adapter
      // For now, we'll use the hardcoded mapping
    });

    return [
      'SN', 'CI', 'ML', 'BF', 'NE', 'GN', // Orange Money countries
      'NG', 'GH', 'KE', // Flutterwave countries
      'ZA', 'US', 'GB', 'FR', 'DE', // Stripe countries
    ];
  }

  /**
   * Get the best payment provider for a given country and preferences
   */
  getBestProvider(
    country: string,
    preferences?: {
      preferredMethods?: string[];
      currency?: string;
      amount?: number;
    }
  ): PaymentProvider {
    const defaultProvider = this.getProviderForCountry(country);
    
    if (!preferences) {
      return defaultProvider;
    }

    // Check if default provider supports the requirements
    const defaultAdapter = this.getAdapter(defaultProvider);
    
    if (preferences.currency && !defaultAdapter.getSupportedCurrencies().includes(preferences.currency)) {
      // Find alternative provider that supports the currency
      for (const [provider, adapter] of this.adapters) {
        if (adapter.supportsCountry(country) && 
            adapter.getSupportedCurrencies().includes(preferences.currency)) {
          return provider;
        }
      }
    }

    if (preferences.preferredMethods) {
      const defaultMethods = defaultAdapter.getSupportedMethods();
      const hasPreferredMethod = preferences.preferredMethods.some(method => 
        defaultMethods.includes(method)
      );
      
      if (!hasPreferredMethod) {
        // Find provider that supports preferred methods
        for (const [provider, adapter] of this.adapters) {
          if (adapter.supportsCountry(country)) {
            const methods = adapter.getSupportedMethods();
            const hasMethod = preferences.preferredMethods.some(method => 
              methods.includes(method)
            );
            if (hasMethod) {
              return provider;
            }
          }
        }
      }
    }

    return defaultProvider;
  }

  /**
   * Get available payment methods for a country
   */
  getAvailableMethods(country: string): Array<{
    provider: PaymentProvider;
    methods: string[];
    currencies: string[];
  }> {
    const available: Array<{
      provider: PaymentProvider;
      methods: string[];
      currencies: string[];
    }> = [];

    for (const [provider, adapter] of this.adapters) {
      if (adapter.supportsCountry(country)) {
        available.push({
          provider,
          methods: adapter.getSupportedMethods(),
          currencies: adapter.getSupportedCurrencies(),
        });
      }
    }

    return available;
  }
}
