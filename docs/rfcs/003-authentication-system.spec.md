# RFC-003: Authentication System

**Status:** Ready for Implementation  
**Created:** October 2025  
**Complexity:** L  
**Estimated Duration:** 1.5 semanas  
**Dependencies:** RFC-001, RFC-002

---

## Resumen

Este RFC implementa el sistema completo de autenticación para Atlas Personal, incluyendo registro e inicio de sesión con email/contraseña y Google Sign-In, gestión de sesión, Redux state management, screens de autenticación, recuperación de contraseña, y manejo de perfil de usuario.

**Objetivo:** Los usuarios pueden crear cuentas, iniciar sesión, mantener sesión persistente, y gestionar su perfil de forma segura.

---

## Características Cubiertas

- **F-001:** Registro de usuario con email/contraseña
- **F-002:** Registro con Google Sign-In
- **F-003:** Inicio de sesión con email/contraseña
- **F-004:** Inicio de sesión con Google
- **F-005:** Cierre de sesión
- **F-006:** Recuperación de contraseña
- **F-007:** Perfil de usuario básico
- **F-008:** Eliminación de cuenta
- **F-009:** Exportación de datos de usuario

---

## Especificaciones Técnicas

### 1. Data Model

#### 1.1 User TypeScript Types

**`src/features/auth/types/user.ts`:**
```typescript
export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  profilePhoto: string | null;
  createdAt: Date;
  subscriptionStatus: 'free' | 'pro';
  subscriptionEndDate: Date | null;
  settings: UserSettings;
  stats: UserStats;
}

export interface UserSettings {
  defaultMapStyle: 'standard' | 'satellite';
  language: 'en' | 'es';
  theme: 'light' | 'dark' | 'auto';
}

export interface UserStats {
  totalPins: number;
  totalCollections: number;
  fogPercentageRevealed: number;
  countriesVisited: number;
}

export interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  displayName?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}
```

#### 1.2 Firestore Schema

**Collection:** `users`

```typescript
{
  uid: string (same as Firebase Auth UID),
  email: string,
  displayName: string,
  profilePhoto: string (Storage URL, optional),
  createdAt: Timestamp,
  subscriptionStatus: 'free' | 'pro',
  subscriptionEndDate: Timestamp (null if free),
  settings: {
    defaultMapStyle: 'standard' | 'satellite',
    language: 'en' | 'es',
    theme: 'light' | 'dark' | 'auto'
  },
  stats: {
    totalPins: number,
    totalCollections: number,
    fogPercentageRevealed: number,
    countriesVisited: number
  }
}
```

**Indexes:**
- Primary: `uid` (automatic)

### 2. Authentication Service Layer

**`src/features/auth/services/authService.ts`:**
```typescript
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {User, UserProfile, SignUpCredentials, SignInCredentials} from '../types/user';
import {logger} from '@/shared/utils/logger';
import {trackEvent, identifyUser} from '@/services/analytics/mixpanel';

class AuthService {
  private usersCollection = firestore().collection('users');

  constructor() {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID', // From Firebase Console
      offlineAccess: true,
    });
  }

  /**
   * Sign up with email and password
   */
  async signUpWithEmail(credentials: SignUpCredentials): Promise<User> {
    try {
      // Create Firebase Auth user
      const userCredential = await auth().createUserWithEmailAndPassword(
        credentials.email,
        credentials.password
      );

      const firebaseUser = userCredential.user;

      // Update display name if provided
      if (credentials.displayName) {
        await firebaseUser.updateProfile({displayName: credentials.displayName});
      }

      // Send email verification
      await firebaseUser.sendEmailVerification();

      // Create user profile in Firestore
      await this.createUserProfile(firebaseUser.uid, {
        email: credentials.email,
        displayName: credentials.displayName || '',
      });

      // Track signup event
      trackEvent('user_signup', {method: 'email'});
      identifyUser(firebaseUser.uid, {
        email: credentials.email,
        displayName: credentials.displayName,
      });

      logger.info('User signed up', {uid: firebaseUser.uid, method: 'email'});

      return this.mapFirebaseUser(firebaseUser);
    } catch (error: any) {
      logger.error('Sign up error', error, {email: credentials.email});
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(credentials: SignInCredentials): Promise<User> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        credentials.email,
        credentials.password
      );

      const firebaseUser = userCredential.user;

      // Update last login timestamp
      await this.updateUserProfile(firebaseUser.uid, {
        lastLoginAt: firestore.FieldValue.serverTimestamp(),
      });

      trackEvent('user_login', {method: 'email'});
      identifyUser(firebaseUser.uid);

      logger.info('User signed in', {uid: firebaseUser.uid, method: 'email'});

      return this.mapFirebaseUser(firebaseUser);
    } catch (error: any) {
      logger.error('Sign in error', error, {email: credentials.email});
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<User> {
    try {
      // Check if device supports Google Play services
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});

      // Get user info from Google
      const {idToken} = await GoogleSignin.signIn();

      // Create Firebase credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign in to Firebase
      const userCredential = await auth().signInWithCredential(googleCredential);
      const firebaseUser = userCredential.user;

      // Check if new user
      const isNewUser = userCredential.additionalUserInfo?.isNewUser;

      if (isNewUser) {
        // Create user profile for new user
        await this.createUserProfile(firebaseUser.uid, {
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL,
        });
        trackEvent('user_signup', {method: 'google'});
      } else {
        // Update last login
        await this.updateUserProfile(firebaseUser.uid, {
          lastLoginAt: firestore.FieldValue.serverTimestamp(),
        });
        trackEvent('user_login', {method: 'google'});
      }

      identifyUser(firebaseUser.uid, {
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
      });

      logger.info('User signed in with Google', {
        uid: firebaseUser.uid,
        isNewUser,
      });

      return this.mapFirebaseUser(firebaseUser);
    } catch (error: any) {
      logger.error('Google sign in error', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      const uid = auth().currentUser?.uid;

      // Sign out from Google if signed in
      const isGoogleSignedIn = await GoogleSignin.isSignedIn();
      if (isGoogleSignedIn) {
        await GoogleSignin.signOut();
      }

      // Sign out from Firebase
      await auth().signOut();

      trackEvent('user_logout');

      logger.info('User signed out', {uid});
    } catch (error: any) {
      logger.error('Sign out error', error);
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
      trackEvent('password_reset_requested', {email});
      logger.info('Password reset email sent', {email});
    } catch (error: any) {
      logger.error('Password reset error', error, {email});
      throw this.handleAuthError(error);
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(userId: string): Promise<void> {
    try {
      const user = auth().currentUser;
      if (!user || user.uid !== userId) {
        throw new Error('Unauthorized: Cannot delete another user account');
      }

      // Delete user profile from Firestore
      await this.usersCollection.doc(userId).delete();

      // TODO: Delete all user data (pins, collections, photos) - implement in cleanup Cloud Function

      // Delete Firebase Auth account
      await user.delete();

      trackEvent('account_deleted', {userId});

      logger.info('User account deleted', {userId});
    } catch (error: any) {
      logger.error('Account deletion error', error, {userId});
      throw this.handleAuthError(error);
    }
  }

  /**
   * Get user profile from Firestore
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const doc = await this.usersCollection.doc(userId).get();

      if (!doc.exists) {
        throw new Error('User profile not found');
      }

      const data = doc.data()!;

      return {
        uid: userId,
        email: data.email,
        displayName: data.displayName,
        profilePhoto: data.profilePhoto || null,
        createdAt: data.createdAt?.toDate() || new Date(),
        subscriptionStatus: data.subscriptionStatus || 'free',
        subscriptionEndDate: data.subscriptionEndDate?.toDate() || null,
        settings: data.settings || this.getDefaultSettings(),
        stats: data.stats || this.getDefaultStats(),
      };
    } catch (error: any) {
      logger.error('Error fetching user profile', error, {userId});
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    userId: string,
    updates: Partial<UserProfile>
  ): Promise<void> {
    try {
      await this.usersCollection.doc(userId).update(updates);
      logger.info('User profile updated', {userId, fields: Object.keys(updates)});
    } catch (error: any) {
      logger.error('Error updating user profile', error, {userId});
      throw error;
    }
  }

  /**
   * Create user profile in Firestore
   */
  private async createUserProfile(
    userId: string,
    data: {email: string; displayName: string; photoURL?: string | null}
  ): Promise<void> {
    await this.usersCollection.doc(userId).set({
      uid: userId,
      email: data.email,
      displayName: data.displayName,
      profilePhoto: data.photoURL || null,
      createdAt: firestore.FieldValue.serverTimestamp(),
      subscriptionStatus: 'free',
      subscriptionEndDate: null,
      settings: this.getDefaultSettings(),
      stats: this.getDefaultStats(),
    });
  }

  /**
   * Get current Firebase user
   */
  getCurrentUser(): User | null {
    const firebaseUser = auth().currentUser;
    return firebaseUser ? this.mapFirebaseUser(firebaseUser) : null;
  }

  /**
   * Map Firebase user to app User type
   */
  private mapFirebaseUser(firebaseUser: any): User {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: firebaseUser.displayName || null,
      photoURL: firebaseUser.photoURL || null,
      emailVerified: firebaseUser.emailVerified,
      createdAt: firebaseUser.metadata.creationTime
        ? new Date(firebaseUser.metadata.creationTime)
        : new Date(),
      lastLoginAt: firebaseUser.metadata.lastSignInTime
        ? new Date(firebaseUser.metadata.lastSignInTime)
        : new Date(),
    };
  }

  /**
   * Handle Firebase auth errors
   */
  private handleAuthError(error: any): Error {
    const errorCode = error.code;
    const errorMessages: Record<string, string> = {
      'auth/email-already-in-use': 'Este email ya está registrado',
      'auth/invalid-email': 'Email inválido',
      'auth/weak-password': 'La contraseña debe tener al menos 8 caracteres',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
    };

    const message = errorMessages[errorCode] || 'Error de autenticación';
    return new Error(message);
  }

  private getDefaultSettings(): UserSettings {
    return {
      defaultMapStyle: 'standard',
      language: 'es',
      theme: 'auto',
    };
  }

  private getDefaultStats(): UserStats {
    return {
      totalPins: 0,
      totalCollections: 0,
      fogPercentageRevealed: 0,
      countriesVisited: 0,
    };
  }
}

export const authService = new AuthService();
```

### 3. Redux Auth Slice

**`src/features/auth/authSlice.ts`:**
```typescript
import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import {AuthState, User, UserProfile, SignUpCredentials, SignInCredentials} from './types/user';
import {authService} from './services/authService';
import {logger} from '@/shared/utils/logger';

const initialState: AuthState = {
  user: null,
  userProfile: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async Thunks
export const signUpWithEmail = createAsyncThunk(
  'auth/signUpWithEmail',
  async (credentials: SignUpCredentials, {rejectWithValue}) => {
    try {
      const user = await authService.signUpWithEmail(credentials);
      const profile = await authService.getUserProfile(user.uid);
      return {user, profile};
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithEmail = createAsyncThunk(
  'auth/signInWithEmail',
  async (credentials: SignInCredentials, {rejectWithValue}) => {
    try {
      const user = await authService.signInWithEmail(credentials);
      const profile = await authService.getUserProfile(user.uid);
      return {user, profile};
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithGoogle = createAsyncThunk(
  'auth/signInWithGoogle',
  async (_, {rejectWithValue}) => {
    try {
      const user = await authService.signInWithGoogle();
      const profile = await authService.getUserProfile(user.uid);
      return {user, profile};
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk('auth/signOut', async (_, {rejectWithValue}) => {
  try {
    await authService.signOut();
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const sendPasswordResetEmail = createAsyncThunk(
  'auth/sendPasswordResetEmail',
  async (email: string, {rejectWithValue}) => {
    try {
      await authService.sendPasswordResetEmail(email);
      return email;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteAccount = createAsyncThunk(
  'auth/deleteAccount',
  async (userId: string, {rejectWithValue}) => {
    try {
      await authService.deleteAccount(userId);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (userId: string, {rejectWithValue}) => {
    try {
      const profile = await authService.getUserProfile(userId);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async ({userId, updates}: {userId: string; updates: Partial<UserProfile>}, {rejectWithValue}) => {
    try {
      await authService.updateUserProfile(userId, updates);
      const profile = await authService.getUserProfile(userId);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const initializeAuth = createAsyncThunk('auth/initialize', async () => {
  return new Promise<User | null>(resolve => {
    const unsubscribe = auth().onAuthStateChanged(async firebaseUser => {
      unsubscribe();
      if (firebaseUser) {
        const user = authService.getCurrentUser();
        resolve(user);
      } else {
        resolve(null);
      }
    });
  });
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: builder => {
    // Initialize Auth
    builder
      .addCase(initializeAuth.pending, state => {
        state.isLoading = true;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.isLoading = false;
      })
      .addCase(initializeAuth.rejected, state => {
        state.isLoading = false;
      });

    // Sign Up with Email
    builder
      .addCase(signUpWithEmail.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userProfile = action.payload.profile;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(signUpWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign In with Email
    builder
      .addCase(signInWithEmail.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithEmail.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userProfile = action.payload.profile;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(signInWithEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign In with Google
    builder
      .addCase(signInWithGoogle.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.userProfile = action.payload.profile;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign Out
    builder
      .addCase(signOut.fulfilled, state => {
        state.user = null;
        state.userProfile = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Password Reset
    builder
      .addCase(sendPasswordResetEmail.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendPasswordResetEmail.fulfilled, state => {
        state.isLoading = false;
      })
      .addCase(sendPasswordResetEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Account
    builder
      .addCase(deleteAccount.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, state => {
        state.user = null;
        state.userProfile = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch User Profile
    builder
      .addCase(fetchUserProfile.pending, state => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update User Profile
    builder
      .addCase(updateUserProfile.pending, state => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.isLoading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {clearError, setUser} = authSlice.actions;
export default authSlice.reducer;
```

### 4. React Components

*(Due to space constraints, showing key components summary)*

**Components to implement:**
- `LoginScreen.tsx`: Email/password login + Google Sign-In button
- `SignUpScreen.tsx`: Email/password registration
- `ForgotPasswordScreen.tsx`: Password reset email form
- `ProfileScreen.tsx`: Display and edit user profile
- `AuthLoadingScreen.tsx`: Loading state while checking auth

**Key features:**
- Form validation with react-hook-form
- Error display
- Loading states
- Navigation after auth actions

---

## Criterios de Aceptación Técnicos

### ✅ Sign Up
- [ ] User can sign up with email/password
- [ ] User can sign up with Google
- [ ] Validation prevents invalid emails and weak passwords
- [ ] User profile created in Firestore
- [ ] Email verification sent
- [ ] Success navigation to main app

### ✅ Sign In
- [ ] User can sign in with email/password
- [ ] User can sign in with Google
- [ ] Session persists across app restarts
- [ ] Error messages shown for invalid credentials
- [ ] Loading states during authentication

### ✅ Sign Out
- [ ] User can sign out
- [ ] Session cleared
- [ ] Navigation to login screen

### ✅ Password Reset
- [ ] User can request password reset
- [ ] Email sent successfully
- [ ] Confirmation message shown

### ✅ User Profile
- [ ] User can view profile
- [ ] User can edit display name and photo
- [ ] Changes persist to Firestore

### ✅ Account Deletion
- [ ] User can delete account
- [ ] Confirmation dialog required
- [ ] User data deleted from Firestore
- [ ] Firebase Auth account deleted

### ✅ Tests
- [ ] Unit tests: authService
- [ ] Integration tests: Redux slice
- [ ] E2E tests: Sign up, sign in, sign out flows

---

## Tiempo Estimado

| Tarea | Tiempo |
|:------|:-------|
| Types and interfaces | 2 horas |
| authService implementation | 8 horas |
| Redux auth slice | 6 horas |
| LoginScreen | 6 horas |
| SignUpScreen | 6 horas |
| ForgotPasswordScreen | 3 horas |
| ProfileScreen | 4 horas |
| Google Sign-In setup | 4 horas |
| Navigation integration | 3 horas |
| Testing | 10 horas |
| **TOTAL** | **~52 horas (~1.5 semanas)** |

---

## Próximo RFC

**RFC-004: Map Integration & Navigation**  
Depende de: RFC-001 ✅, RFC-002 ✅, RFC-003 ✅

---

**¡Sistema de autenticación completo y seguro!** 🔐
