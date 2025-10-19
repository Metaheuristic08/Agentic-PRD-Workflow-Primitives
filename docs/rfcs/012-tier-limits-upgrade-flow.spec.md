# RFC-012: Tier Limits & Upgrade Flow

**Status:** Ready for Implementation  
**Created:** October 2025  
**Complexity:** M  
**Estimated Duration:** 1 semana  
**Dependencies:** RFC-011

---

## Resumen

Este RFC implementa el enforcement de límites del tier gratuito (100 pins, 3 colecciones), modales de upgrade en los puntos apropiados, badges de features Pro, y manejo de downgrade cuando expira suscripción. Incluye grace period de 7 días y notificaciones por email.

**Objetivo:** Límites free tier aplicados server-side, usuarios upgradeados suavemente en momentos apropiados, y downgrade manejado sin pérdida de datos.

---

## Características Cubiertas

- **F-027:** Validación de límites tier gratuito (100 pins)
- **F-040:** Validación de límite tier gratuito (3 colecciones)
- **F-060:** Enforcement de downgrade al expirar subscripción
- **F-061:** Indicadores visuales de features Pro

---

## Especificaciones Técnicas

### 1. Limit Enforcement

**`src/features/subscription/utils/limits.ts`:**
```typescript
import {UserProfile} from '@/features/auth/types/user';

export interface TierLimits {
  maxPins: number;
  maxCollections: number;
  hasUnlimitedPins: boolean;
  hasUnlimitedCollections: boolean;
  hasPremiumMapStyles: boolean;
  hasCustomIcons: boolean;
  hasExportFeatures: boolean;
}

export function getTierLimits(userProfile: UserProfile | null): TierLimits {
  const isPro = userProfile?.subscriptionStatus === 'pro';

  return {
    maxPins: isPro ? Infinity : 100,
    maxCollections: isPro ? Infinity : 3,
    hasUnlimitedPins: isPro,
    hasUnlimitedCollections: isPro,
    hasPremiumMapStyles: isPro,
    hasCustomIcons: isPro,
    hasExportFeatures: isPro,
  };
}

export function canCreatePin(currentCount: number, userProfile: UserProfile | null): boolean {
  const limits = getTierLimits(userProfile);
  return currentCount < limits.maxPins;
}

export function canCreateCollection(
  currentCount: number,
  userProfile: UserProfile | null
): boolean {
  const limits = getTierLimits(userProfile);
  return currentCount < limits.maxCollections;
}
```

### 2. Upgrade Modal Component

**`src/features/subscription/components/UpgradeModal.tsx`:**
```typescript
import React from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface UpgradeModalProps {
  visible: boolean;
  onClose: () => void;
  feature: 'pins' | 'collections' | 'mapStyles' | 'icons';
}

const UPGRADE_MESSAGES = {
  pins: {
    title: 'Límite de Pins Alcanzado',
    message: 'Has creado 100 pins. Actualiza a Pro para crear pins ilimitados.',
    icon: 'location-on',
  },
  collections: {
    title: 'Límite de Colecciones Alcanzado',
    message: 'Ya tienes 3 colecciones. Actualiza a Pro para crear colecciones ilimitadas.',
    icon: 'collections',
  },
  mapStyles: {
    title: 'Función Pro',
    message: 'Los estilos premium de mapa son exclusivos para usuarios Pro.',
    icon: 'palette',
  },
  icons: {
    title: 'Función Pro',
    message: 'Los iconos personalizados son exclusivos para usuarios Pro.',
    icon: 'emoji-events',
  },
};

const UpgradeModal: React.FC<UpgradeModalProps> = ({visible, onClose, feature}) => {
  const navigation = useNavigation();
  const config = UPGRADE_MESSAGES[feature];

  const handleUpgrade = () => {
    onClose();
    navigation.navigate('Pricing');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.iconContainer}>
            <Icon name={config.icon} size={48} color="#007AFF" />
          </View>

          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.message}>{config.message}</Text>

          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
            <Text style={styles.upgradeButtonText}>Ver Atlas Pro</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Ahora No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  upgradeButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    marginBottom: 12,
  },
  upgradeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 16,
  },
});

export default UpgradeModal;
```

### 3. Pro Badge Component

**`src/features/subscription/components/ProBadge.tsx`:**
```typescript
import React from 'react';
import {View, Text, StyleSheet} from 'react';

interface ProBadgeProps {
  size?: 'small' | 'medium';
}

const ProBadge: React.FC<ProBadgeProps> = ({size = 'small'}) => {
  const isSmall = size === 'small';

  return (
    <View style={[styles.badge, isSmall && styles.badgeSmall]}>
      <Text style={[styles.text, isSmall && styles.textSmall]}>PRO</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  text: {
    color: '#333',
    fontSize: 12,
    fontWeight: 'bold',
  },
  textSmall: {
    fontSize: 10,
  },
});

export default ProBadge;
```

### 4. Downgrade Handler

**`src/features/subscription/services/downgradeService.ts`:**
```typescript
import firestore from '@react-native-firebase/firestore';
import {logger} from '@/shared/utils/logger';
import {trackEvent} from '@/services/analytics/mixpanel';

const GRACE_PERIOD_DAYS = 7;

class DowngradeService {
  async handleSubscriptionExpiration(userId: string): Promise<void> {
    try {
      const userRef = firestore().collection('users').doc(userId);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const userData = userDoc.data()!;
      const expirationDate = userData.subscriptionEndDate?.toDate();

      if (!expirationDate) {
        return; // No subscription
      }

      const now = new Date();
      const daysSinceExpiration = Math.floor(
        (now.getTime() - expirationDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceExpiration < GRACE_PERIOD_DAYS) {
        // Still in grace period
        logger.info('User in grace period', {
          userId,
          daysRemaining: GRACE_PERIOD_DAYS - daysSinceExpiration,
        });
        return;
      }

      // Apply downgrade
      await this.applyDowngrade(userId, userData);

      trackEvent('subscription_downgraded', {userId});
    } catch (error) {
      logger.error('Error handling subscription expiration', error as Error, {userId});
      throw error;
    }
  }

  private async applyDowngrade(userId: string, userData: any): Promise<void> {
    const pinsCollection = firestore().collection('pins');
    const collectionsCollection = firestore().collection('collections');

    // Get counts
    const pinsSnapshot = await pinsCollection.where('userId', '==', userId).get();
    const collectionsSnapshot = await collectionsCollection.where('userId', '==', userId).get();

    const pinCount = pinsSnapshot.size;
    const collectionCount = collectionsSnapshot.size;

    // Update user to free tier
    await firestore().collection('users').doc(userId).update({
      subscriptionStatus: 'free',
      subscriptionEndDate: null,
    });

    logger.info('Downgrade applied', {
      userId,
      pinCount,
      collectionCount,
      willArchivePins: pinCount > 100,
      willArchiveCollections: collectionCount > 3,
    });

    // Note: Archiving logic (making pins >100 read-only) would be implemented here
    // For MVP, we just log. Full implementation in v1.1
  }
}

export const downgradeService = new DowngradeService();
```

---

## Criterios de Aceptación Técnicos

### ✅ Limit Enforcement
- [ ] Free users blocked at 100 pins
- [ ] Free users blocked at 3 collections
- [ ] Server-side validation prevents client manipulation
- [ ] Upgrade modal shown at appropriate moments

### ✅ Upgrade Flow
- [ ] Modal appears at pin/collection limit
- [ ] "Ver Atlas Pro" navigates to pricing
- [ ] "Ahora No" dismisses modal
- [ ] Warning at 90% capacity (90 pins, 3 collections)

### ✅ Pro Badges
- [ ] Pro badge shown on locked features
- [ ] Consistent design across app
- [ ] Tappable to show upgrade modal

### ✅ Downgrade Handling
- [ ] Grace period of 7 days
- [ ] Email notifications sent (7 days before, 1 day before, on expiration)
- [ ] After grace: pins >100 read-only, collections >3 archived
- [ ] Re-upgrade restores full access immediately

### ✅ Tests
- [ ] Unit tests: limits utilities
- [ ] Integration tests: limit enforcement
- [ ] E2E test: Hit limit → see modal → upgrade

---

## Tiempo Estimado

| Tarea | Tiempo |
|:------|:-------|
| Limits utilities | 3 horas |
| UpgradeModal component | 4 horas |
| ProBadge component | 2 horas |
| Limit enforcement in pin/collection creation | 6 horas |
| downgradeService | 6 horas |
| Grace period logic | 4 horas |
| Testing | 6 horas |
| **TOTAL** | **~31 horas (~1 semana)** |

---

## Próximo RFC

**RFC-013: Onboarding & Settings**  
Depende de: RFC-003, RFC-012

---

**¡Monetización balanceada con experiencia freemium justa!** 💎
