# Atlas Personal

El Mapa de Tu Vida - A personal memory atlas mobile application.

## Prerequisites

- Node.js 18+
- Yarn 1.22+
- React Native CLI
- Xcode 14+ (for iOS)
- Android Studio (for Android)

## Setup

1. Clone the repository
```bash
git clone <repo-url>
cd AtlasPersonal
```

2. Install dependencies
```bash
yarn install
```

3. iOS setup
```bash
cd ios && pod install && cd ..
```

4. Configure environment variables
```bash
cp .env.example .env
# Edit .env with actual values
```

5. Run the app
```bash
# iOS
yarn ios

# Android
yarn android
```

## Development

```bash
# Start Metro bundler
yarn start

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Check code quality
yarn lint
yarn typecheck
yarn format
```

## Project Structure

See `docs/RULES.md` for detailed architecture and coding standards.

## Documentation

- [PRD (Product Requirements Document)](../docs/PRD-verified.md)
- [Features List](../docs/FEATURES.md)
- [Technical Rules](../docs/RULES.md)
- [RFCs Overview](../docs/RFCS-overview.md)

## License

Proprietary - All Rights Reserved
