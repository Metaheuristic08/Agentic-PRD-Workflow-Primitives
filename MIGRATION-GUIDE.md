# Migration Guide: React Native to Angular + Capacitor

## Overview

This project has been migrated from React Native to Angular + Capacitor to provide a modern WebApp experience that can be easily transformed to native Android and iOS applications.

## What Changed

### Technology Stack

| Before (React Native) | After (Angular + Capacitor) |
|:---------------------|:---------------------------|
| React Native 0.72.x | Angular 20.3.x |
| React Navigation | Angular Router |
| Redux Toolkit | Angular Services + RxJS |
| Metro Bundler | Angular CLI + Webpack |
| Native modules | Capacitor Plugins |
| Yarn | npm |

### Project Structure

**Before:**
```
src/
├── App.tsx
├── features/
├── navigation/
├── store/
└── theme/
```

**After:**
```
src/
├── app/
│   ├── features/
│   ├── core/
│   ├── shared/
│   ├── app.component.ts
│   └── app.routes.ts
├── assets/
├── index.html
└── styles.scss
```

### Key Differences

#### 1. Component Syntax

**React Native:**
```typescript
import React from 'react';
import { View, Text } from 'react-native';

export const PinCard = () => {
  return (
    <View>
      <Text>Pin Name</Text>
    </View>
  );
};
```

**Angular:**
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pin-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h3>Pin Name</h3>
    </div>
  `,
  styles: []
})
export class PinCardComponent {}
```

#### 2. State Management

**React Native (Redux):**
```typescript
const dispatch = useDispatch();
const pins = useSelector(state => state.pins.items);

dispatch(createPin(pinData));
```

**Angular (Services + RxJS):**
```typescript
export class PinService {
  private pinsSubject = new BehaviorSubject<Pin[]>([]);
  pins$ = this.pinsSubject.asObservable();
  
  createPin(pinData: Pin) {
    // implementation
  }
}

// In component
constructor(private pinService: PinService) {}

ngOnInit() {
  this.pinService.pins$.subscribe(pins => {
    this.pins = pins;
  });
}
```

#### 3. Navigation

**React Native:**
```typescript
navigation.navigate('PinDetail', { id: pin.id });
```

**Angular:**
```typescript
constructor(private router: Router) {}

navigateToPinDetail(id: string) {
  this.router.navigate(['/pins', id]);
}
```

#### 4. Native Features

**React Native:**
```typescript
import { Camera } from 'react-native-camera';
```

**Angular + Capacitor:**
```typescript
import { Camera } from '@capacitor/camera';

const image = await Camera.getPhoto({
  quality: 90,
  allowEditing: false,
  resultType: CameraResultType.Uri
});
```

## Development Workflow

### Setup
```bash
cd AtlasPersonal
npm install
```

### Running the App

**Web Development:**
```bash
npm start
# Opens at http://localhost:4200
```

**Build for Production:**
```bash
npm run build:prod
```

**Android Development:**
```bash
# Build web assets and sync
npm run cap:sync

# Open in Android Studio
npm run cap:open:android

# Or build and run
npm run android
```

### Testing
```bash
npm test
```

### Linting & Formatting
```bash
npm run lint
npm run format
```

## Building APK

1. Build the web application:
   ```bash
   npm run build:prod
   ```

2. Sync with Capacitor:
   ```bash
   npm run cap:sync
   ```

3. Open Android Studio:
   ```bash
   npm run cap:open:android
   ```

4. In Android Studio:
   - Build → Generate Signed Bundle / APK
   - Select APK
   - Follow the wizard to sign and build

## Benefits of This Migration

### 1. **WebApp First**
- Can deploy as a progressive web app (PWA)
- Easier testing in browser
- Faster development cycle

### 2. **Easier Mobile Deployment**
- Capacitor provides clean abstraction for native features
- Single codebase for web, Android, and iOS
- Less platform-specific code

### 3. **Modern Tooling**
- Angular CLI provides excellent developer experience
- Built-in optimization and tree-shaking
- Better TypeScript integration

### 4. **Simplified State Management**
- RxJS observables are more powerful and flexible
- Services are easier to test and maintain
- No need for Redux boilerplate

### 5. **Better Performance**
- Angular's change detection is highly optimized
- Lazy loading routes reduce initial bundle size
- Capacitor's bridge is lightweight

## Migration Status

✅ **Completed:**
- Angular project structure
- Capacitor integration
- Basic routing setup
- Feature module structure
- Android platform configuration
- Build pipeline

🚧 **To Be Implemented:**
- Firebase integration
- Map integration (Mapbox GL JS)
- Authentication flows
- Pin CRUD operations
- Collections management
- Camera/Gallery integration
- Geolocation services
- Offline support
- Push notifications
- Analytics integration

## Resources

- [Angular Documentation](https://angular.dev)
- [Capacitor Documentation](https://capacitorjs.com)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)
- [Angular Router Guide](https://angular.dev/guide/routing)
- [RxJS Documentation](https://rxjs.dev)

## Support

For questions or issues, please refer to:
- [PRD Document](docs/PRD-verified.md)
- [Technical Rules](docs/RULES.md)
- [RFCs Overview](docs/RFCS-overview.md)
