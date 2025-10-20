# Atlas Personal

El Mapa de Tu Vida - A personal memory atlas web application with native mobile capabilities.

## Tech Stack

- **Angular 20.3** - Modern web framework
- **Capacitor 7** - Native mobile runtime
- **TypeScript 5.9** - Type-safe development
- **SCSS** - Styling

## Prerequisites

- Node.js 18+
- npm 10+
- Android Studio (for Android builds)

## Setup

1. Clone the repository
```bash
git clone <repo-url>
cd AtlasPersonal
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with actual values
```

## Development

### Run as Web App
```bash
# Start development server
npm start

# Build for production
npm run build:prod
```

### Run as Android App
```bash
# Build web assets and sync with Capacitor
npm run cap:sync

# Open Android Studio
npm run cap:open:android

# Or build and run directly
npm run android
```

## Available Scripts

- `npm start` - Start Angular dev server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run lint` - Lint code
- `npm run format` - Format code
- `npm run typecheck` - Type check
- `npm run cap:sync` - Sync web assets to native platforms
- `npm run android` - Build and run on Android

## Project Structure

```
src/
├── app/
│   ├── features/          # Feature modules
│   │   ├── auth/         # Authentication
│   │   ├── map/          # Map view
│   │   ├── pins/         # Pin management
│   │   └── collections/  # Collections
│   ├── core/             # Core services and utilities
│   └── shared/           # Shared components and utilities
├── assets/               # Static assets
└── styles.scss          # Global styles
```

See `docs/RULES.md` for detailed architecture and coding standards.

## Building APK

1. Build the web app:
```bash
npm run build:prod
```

2. Sync with Capacitor:
```bash
npm run cap:sync
```

3. Open in Android Studio:
```bash
npm run cap:open:android
```

4. In Android Studio:
   - Build → Generate Signed Bundle / APK
   - Follow the wizard to create your APK

## Documentation

- [PRD (Product Requirements Document)](../docs/PRD-verified.md)
- [Features List](../docs/FEATURES.md)
- [Technical Rules](../docs/RULES.md)
- [RFCs Overview](../docs/RFCS-overview.md)

## License

Proprietary - All Rights Reserved
