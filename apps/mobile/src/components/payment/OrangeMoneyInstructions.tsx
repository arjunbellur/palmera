import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Clipboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';

interface OrangeMoneyInstructionsProps {
  reference: string;
  amount: number;
  currency: string;
  instructions: {
    ussd: string;
    app: string;
    web: string;
  };
  onCheckStatus: () => void;
}

export function OrangeMoneyInstructions({
  reference,
  amount,
  currency,
  instructions,
  onCheckStatus,
}: OrangeMoneyInstructionsProps) {
  const copyReference = async () => {
    try {
      await Clipboard.setString(reference);
      Alert.alert('Copied', 'Reference number copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy reference number');
    }
  };

  const dialUSSD = () => {
    const ussdUrl = `tel:${instructions.ussd}`;
    Linking.openURL(ussdUrl).catch(() => {
      Alert.alert('Error', 'Unable to open phone dialer');
    });
  };

  const openOrangeMoneyApp = () => {
    // Try to open Orange Money app
    const appUrl = 'orange-money://';
    const webUrl = 'https://orange-money.sn';
    
    Linking.openURL(appUrl).catch(() => {
      // Fallback to web version
      Linking.openURL(webUrl).catch(() => {
        Alert.alert('Error', 'Unable to open Orange Money');
      });
    });
  };

  return (
    <Card style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="phone-portrait" size={32} color="#FF6B35" />
          </View>
          <Text style={styles.title}>Complete Your Payment</Text>
          <Text style={styles.amount}>
            {amount.toLocaleString()} {currency}
          </Text>
        </View>

        {/* Reference Number */}
        <View style={styles.referenceContainer}>
          <Text style={styles.referenceLabel}>Reference Number</Text>
          <View style={styles.referenceRow}>
            <Text style={styles.referenceText}>{reference}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={copyReference}>
              <Ionicons name="copy-outline" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.methodsContainer}>
          <Text style={styles.methodsTitle}>Choose your payment method:</Text>
          
          {/* USSD Method */}
          <TouchableOpacity style={styles.methodCard} onPress={dialUSSD}>
            <View style={styles.methodIcon}>
              <Text style={styles.methodIconText}>*</Text>
            </View>
            <View style={styles.methodContent}>
              <Text style={styles.methodTitle}>USSD Code</Text>
              <Text style={styles.methodDescription}>
                Dial the code below on your phone
              </Text>
              <View style={styles.ussdContainer}>
                <Text style={styles.ussdCode}>{instructions.ussd}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* App Method */}
          <TouchableOpacity style={styles.methodCard} onPress={openOrangeMoneyApp}>
            <View style={styles.methodIcon}>
              <Ionicons name="phone-portrait" size={20} color="#FF6B35" />
            </View>
            <View style={styles.methodContent}>
              <Text style={styles.methodTitle}>Orange Money App</Text>
              <Text style={styles.methodDescription}>
                Open the Orange Money app and enter the reference number
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Web Method */}
          <TouchableOpacity 
            style={styles.methodCard} 
            onPress={() => Linking.openURL('https://orange-money.sn')}
          >
            <View style={styles.methodIcon}>
              <Ionicons name="globe-outline" size={20} color="#FF6B35" />
            </View>
            <View style={styles.methodContent}>
              <Text style={styles.methodTitle}>Web Portal</Text>
              <Text style={styles.methodDescription}>
                Complete payment on the Orange Money web portal
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Status Check */}
        <TouchableOpacity style={styles.statusButton} onPress={onCheckStatus}>
          <Text style={styles.statusButtonText}>Check Payment Status</Text>
        </TouchableOpacity>

        {/* Note */}
        <View style={styles.noteContainer}>
          <Ionicons name="information-circle" size={20} color="#3B82F6" />
          <View style={styles.noteContent}>
            <Text style={styles.noteTitle}>Important Note</Text>
            <Text style={styles.noteText}>
              Your booking will be confirmed automatically once payment is received. 
              You can check the status anytime using the button above.
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  amount: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  referenceContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  referenceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  referenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  referenceText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'monospace',
    flex: 1,
  },
  copyButton: {
    padding: 8,
    marginLeft: 12,
  },
  methodsContainer: {
    marginBottom: 24,
  },
  methodsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodIconText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B35',
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  methodDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  ussdContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ussdCode: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#374151',
  },
  statusButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  statusButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  noteContainer: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 8,
    padding: 16,
  },
  noteContent: {
    flex: 1,
    marginLeft: 12,
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E40AF',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#1D4ED8',
    lineHeight: 20,
  },
});
