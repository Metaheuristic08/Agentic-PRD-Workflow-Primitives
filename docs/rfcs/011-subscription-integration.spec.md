# RFC-011: Subscription Integration

**Status:** Ready for Implementation  
**Created:** October 2025  
**Complexity:** L  
**Estimated Duration:** 1.5 semanas  
**Dependencies:** RFC-003

---

## Resumen

Este RFC implementa el sistema completo de suscripción usando RevenueCat, incluyendo pantalla de pricing con beneficios Pro, flujo de compra nativo (iOS StoreKit/Android Play Billing), validación de receipts, restore purchases, y actualización del estado de suscripción del usuario.

**Objetivo:** Usuarios pueden ver beneficios Pro, comprar suscripción anual ($24.99), restaurar compras, y el sistema valida/actualiza estado automáticamente.

---

## Características Cubiertas

- **F-053:** Integración de RevenueCat SDK
- **F-054:** Pantalla de pricing/benefits Pro
- **F-055:** Flujo de compra de subscripción
- **F-056:** Activación inmediata de features Pro
- **F-057:** Manejo de errores de pago
- **F-058:** Restore Purchases

---

## Especificaciones Técnicas

### 1. Subscription Types

**`src/features/subscription/types/subscription.ts`:**
```typescript
export type SubscriptionStatus = 'free' | 'pro';

export interface SubscriptionProduct {
  identifier: string;
  title: string;
  description: string;
  priceString: string;
  price: number;
  currencyCode: string;
}

export interface SubscriptionInfo {
  status: SubscriptionStatus;
  productIdentifier: string | null;
  expirationDate: Date | null;
  isActive: boolean;
}

export interface SubscriptionState {
  products: SubscriptionProduct[];
  currentSubscription: SubscriptionInfo | null;
  isLoading: boolean;
  error: string | null;
}

export const PRO_BENEFITS = [
  {
    icon: 'all-inclusive',
    title: 'Pins Ilimitados',
    description: 'Crea tantos pins como quieras sin límites',
  },
  {
    icon: 'collections',
    title: 'Colecciones Ilimitadas',
    description: 'Organiza tus memorias en colecciones infinitas',
  },
  {
    icon: 'palette',
    title: 'Estilos Premium de Mapa',
    description: 'Acceso a todos los estilos de mapa (vintage, acuarela, minimalista)',
  },
  {
    icon: 'emoji-events',
    title: 'Iconos Custom',
    description: 'Personaliza tus pins con +10 packs de iconos temáticos',
  },
  {
    icon: 'cloud-upload',
    title: 'Exportación de Alta Calidad',
    description: 'Exporta tus mapas en 4K y crea pósters imprimibles',
  },
  {
    icon: 'support-agent',
    title: 'Soporte Prioritario',
    description: 'Respuesta en menos de 24 horas',
  },
];
```

### 2. Subscription Service

**`src/features/subscription/services/subscriptionService.ts`:**
```typescript
import Purchases, {PurchasesPackage, CustomerInfo} from 'react-native-purchases';
import {SubscriptionProduct, SubscriptionInfo} from '../types/subscription';
import {logger} from '@/shared/utils/logger';
import {trackEvent} from '@/services/analytics/mixpanel';

const PRODUCT_ID_ANNUAL = 'atlas_pro_annual';
const ENTITLEMENT_ID = 'pro';

class SubscriptionService {
  async getOfferings(): Promise<SubscriptionProduct[]> {
    try {
      const offerings = await Purchases.getOfferings();
      
      if (!offerings.current || offerings.current.availablePackages.length === 0) {
        logger.warn('No subscription offerings available');
        return [];
      }

      return offerings.current.availablePackages.map(pkg => this.mapPackageToProduct(pkg));
    } catch (error) {
      logger.error('Error fetching offerings', error as Error);
      throw error;
    }
  }

  async purchasePackage(pkg: PurchasesPackage): Promise<CustomerInfo> {
    try {
      trackEvent('purchase_initiated', {
        productId: pkg.product.identifier,
        price: pkg.product.price,
      });

      const {customerInfo} = await Purchases.purchasePackage(pkg);

      trackEvent('purchase_completed', {
        productId: pkg.product.identifier,
        isPro: this.isPro(customerInfo),
      });

      logger.info('Purchase successful', {
        productId: pkg.product.identifier,
      });

      return customerInfo;
    } catch (error: any) {
      if (error.userCancelled) {
        trackEvent('purchase_cancelled');
        logger.info('Purchase cancelled by user');
      } else {
        trackEvent('purchase_failed', {
          error: error.message,
          code: error.code,
        });
        logger.error('Purchase error', error);
      }
      throw error;
    }
  }

  async restorePurchases(): Promise<CustomerInfo> {
    try {
      trackEvent('restore_purchases_initiated');

      const customerInfo = await Purchases.restorePurchases();

      trackEvent('restore_purchases_completed', {
        isPro: this.isPro(customerInfo),
      });

      logger.info('Purchases restored', {
        isPro: this.isPro(customerInfo),
      });

      return customerInfo;
    } catch (error) {
      logger.error('Error restoring purchases', error as Error);
      throw error;
    }
  }

  async getCustomerInfo(): Promise<CustomerInfo> {
    try {
      return await Purchases.getCustomerInfo();
    } catch (error) {
      logger.error('Error getting customer info', error as Error);
      throw error;
    }
  }

  getSubscriptionInfo(customerInfo: CustomerInfo): SubscriptionInfo {
    const isPro = this.isPro(customerInfo);
    const proEntitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];

    return {
      status: isPro ? 'pro' : 'free',
      productIdentifier: proEntitlement?.productIdentifier || null,
      expirationDate: proEntitlement?.expirationDate
        ? new Date(proEntitlement.expirationDate)
        : null,
      isActive: isPro,
    };
  }

  isPro(customerInfo: CustomerInfo): boolean {
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  }

  private mapPackageToProduct(pkg: PurchasesPackage): SubscriptionProduct {
    return {
      identifier: pkg.product.identifier,
      title: pkg.product.title,
      description: pkg.product.description,
      priceString: pkg.product.priceString,
      price: pkg.product.price,
      currencyCode: pkg.product.currencyCode,
    };
  }

  async identifyUser(userId: string): Promise<void> {
    try {
      await Purchases.logIn(userId);
      logger.info('User identified in RevenueCat', {userId});
    } catch (error) {
      logger.error('Error identifying user', error as Error, {userId});
    }
  }

  async logout(): Promise<void> {
    try {
      await Purchases.logOut();
      logger.info('User logged out from RevenueCat');
    } catch (error) {
      logger.error('Error logging out', error as Error);
    }
  }
}

export const subscriptionService = new SubscriptionService();
```

### 3. Redux Subscription Slice

**`src/features/subscription/subscriptionSlice.ts`:**
```typescript
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {SubscriptionState, SubscriptionInfo} from './types/subscription';
import {subscriptionService} from './services/subscriptionService';

const initialState: SubscriptionState = {
  products: [],
  currentSubscription: null,
  isLoading: false,
  error: null,
};

export const fetchSubscriptionProducts = createAsyncThunk(
  'subscription/fetchProducts',
  async (_, {rejectWithValue}) => {
    try {
      return await subscriptionService.getOfferings();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const purchaseSubscription = createAsyncThunk(
  'subscription/purchase',
  async (packageIndex: number, {getState, rejectWithValue}) => {
    try {
      const state = getState() as any;
      const pkg = state.subscription.products[packageIndex];
      
      if (!pkg) {
        throw new Error('Package not found');
      }

      const customerInfo = await subscriptionService.purchasePackage(pkg);
      return subscriptionService.getSubscriptionInfo(customerInfo);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const restorePurchases = createAsyncThunk(
  'subscription/restore',
  async (_, {rejectWithValue}) => {
    try {
      const customerInfo = await subscriptionService.restorePurchases();
      return subscriptionService.getSubscriptionInfo(customerInfo);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkSubscriptionStatus = createAsyncThunk(
  'subscription/checkStatus',
  async (_, {rejectWithValue}) => {
    try {
      const customerInfo = await subscriptionService.getCustomerInfo();
      return subscriptionService.getSubscriptionInfo(customerInfo);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Fetch Products
    builder
      .addCase(fetchSubscriptionProducts.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchSubscriptionProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchSubscriptionProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Purchase
    builder
      .addCase(purchaseSubscription.pending, state => {
        state.isLoading = true;
      })
      .addCase(purchaseSubscription.fulfilled, (state, action) => {
        state.currentSubscription = action.payload;
        state.isLoading = false;
      })
      .addCase(purchaseSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Restore
    builder
      .addCase(restorePurchases.pending, state => {
        state.isLoading = true;
      })
      .addCase(restorePurchases.fulfilled, (state, action) => {
        state.currentSubscription = action.payload;
        state.isLoading = false;
      })
      .addCase(restorePurchases.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Check Status
    builder
      .addCase(checkSubscriptionStatus.fulfilled, (state, action) => {
        state.currentSubscription = action.payload;
      });
  },
});

export const {clearError} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
```

### 4. Pricing Screen

**`src/features/subscription/screens/PricingScreen.tsx`:**
```typescript
import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/store';
import {
  fetchSubscriptionProducts,
  purchaseSubscription,
  restorePurchases,
} from '../subscriptionSlice';
import {PRO_BENEFITS} from '../types/subscription';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PricingScreen: React.FC = () => {
  const dispatch = useDispatch();
  const {products, isLoading, error} = useSelector((state: RootState) => state.subscription);

  useEffect(() => {
    dispatch(fetchSubscriptionProducts());
  }, [dispatch]);

  const handlePurchase = async () => {
    if (products.length > 0) {
      await dispatch(purchaseSubscription(0)); // First product (annual)
    }
  };

  const handleRestore = async () => {
    await dispatch(restorePurchases());
  };

  const annualProduct = products[0]; // Assuming annual is first

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Atlas Pro</Text>
        <Text style={styles.subtitle}>Desbloquea todas las funciones</Text>
      </View>

      {/* Benefits */}
      <View style={styles.benefitsContainer}>
        {PRO_BENEFITS.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <View style={styles.benefitIconContainer}>
              <Icon name={benefit.icon} size={24} color="#007AFF" />
            </View>
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>{benefit.title}</Text>
              <Text style={styles.benefitDescription}>{benefit.description}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Pricing */}
      {annualProduct && (
        <View style={styles.pricingContainer}>
          <View style={styles.priceCard}>
            <Text style={styles.priceAmount}>{annualProduct.priceString}</Text>
            <Text style={styles.pricePeriod}>/ año</Text>
          </View>
          <Text style={styles.priceNote}>
            Equivalente a {(annualProduct.price / 12).toFixed(2)} {annualProduct.currencyCode}/mes
          </Text>
        </View>
      )}

      {/* CTA */}
      <TouchableOpacity
        style={styles.purchaseButton}
        onPress={handlePurchase}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.purchaseButtonText}>Suscribirse Ahora</Text>
        )}
      </TouchableOpacity>

      {/* Restore */}
      <TouchableOpacity style={styles.restoreButton} onPress={handleRestore}>
        <Text style={styles.restoreButtonText}>Restaurar Compras</Text>
      </TouchableOpacity>

      {/* Error */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Legal */}
      <View style={styles.legalContainer}>
        <Text style={styles.legalText}>
          La suscripción se renovará automáticamente. Puedes cancelar en cualquier momento desde la
          configuración de tu cuenta.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    opacity: 0.9,
  },
  benefitsContainer: {
    padding: 20,
  },
  benefitItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  benefitIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  pricingContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  priceCard: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  priceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  pricePeriod: {
    fontSize: 20,
    color: '#666',
    marginLeft: 8,
  },
  priceNote: {
    fontSize: 14,
    color: '#999',
  },
  purchaseButton: {
    backgroundColor: '#007AFF',
    marginHorizontal: 20,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  restoreButton: {
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  restoreButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    marginHorizontal: 20,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    color: '#C62828',
    textAlign: 'center',
  },
  legalContainer: {
    padding: 20,
    marginTop: 20,
  },
  legalText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default PricingScreen;
```

---

## Criterios de Aceptación Técnicos

### ✅ Subscription Display
- [ ] Products fetched from RevenueCat
- [ ] Price displayed in user's currency
- [ ] Benefits clearly listed
- [ ] Loading states shown

### ✅ Purchase Flow
- [ ] Native payment sheet appears
- [ ] Biometric authentication works
- [ ] Success confirmation shown
- [ ] User status updated to Pro immediately

### ✅ Error Handling
- [ ] Payment declined error shown
- [ ] Network error handled gracefully
- [ ] User cancellation handled
- [ ] Retry option available

### ✅ Restore Purchases
- [ ] Works after reinstall
- [ ] Works on new device
- [ ] Status validated with RevenueCat
- [ ] Confirmation message shown

### ✅ Tests
- [ ] Unit tests: subscriptionService
- [ ] Integration tests: Redux slice
- [ ] E2E test: Complete purchase flow (sandbox)

---

## Tiempo Estimado

| Tarea | Tiempo |
|:------|:-------|
| Subscription types | 2 horas |
| subscriptionService | 8 horas |
| Redux subscription slice | 6 horas |
| PricingScreen | 8 horas |
| Error handling | 4 horas |
| RevenueCat webhook setup | 4 horas |
| Testing (sandbox) | 10 horas |
| **TOTAL** | **~42 horas (~1.5 semanas)** |

---

## Próximo RFC

**RFC-012: Tier Limits & Upgrade Flow**  
Depende de: RFC-011

---

**¡Sistema de suscripción completo y robusto!** 💳
