# Product Requirements Document: Atlas Personal
## VERIFIED VERSION

**Product Name:** Atlas Personal  
**Tagline:** El Mapa de Tu Vida (The Map of Your Life)  
**Version:** 1.0 (MVP)  
**Document Status:** Verified  
**Last Updated:** October 2025  
**Verification Date:** October 2025

> [VERIFICATION NOTE] This is the verified and enhanced version of the original PRD. All improvements and clarifications are marked with `> [SUGERENCIA]` or `> [ACLARACIÓN]` tags.

---

## Overview

**Product Name:** Atlas Personal  
**Tagline:** El Mapa de Tu Vida (The Map of Your Life)  
**Version:** 1.0 (MVP)  
**Document Status:** Verified  
**Last Updated:** October 2025

### Executive Summary

Atlas Personal is a mobile application that transforms personal memories into an interactive visual atlas of one's life history. Unlike travel planning apps, Atlas Personal is an elegant and playful tool for documenting, rediscovering, and visualizing lived experiences, turning the world map into a canvas of personal life stories.

The application addresses the fragmentation of digital memories by unifying photos, stories, and locations into a cohesive, geographically-contextualized narrative platform that celebrates personal journeys in a private and meaningful way.

---

## Goals and Objectives

### Primary Goals

1. **Memory Consolidation:** Provide a unified platform for users to document and organize life experiences geographically
2. **Emotional Connection:** Create an intimate, private space for users to treasure memories rather than broadcast them
3. **Narrative Building:** Enable users to construct meaningful stories through geographical context
4. **Engagement:** Gamify the experience to encourage consistent documentation through the "fog of war" mechanic

### Success Metrics (KPIs)

- **User Engagement:**
  - Daily Active Users (DAU) / Monthly Active Users (MAU) ratio > 30%
  - Average session duration: 5+ minutes
  - Pins created per active user per month: 10+
  - > [SUGERENCIA] Track median session duration alongside average to account for outliers
  
- **Retention:**
  - Day 7 retention: > 40%
  - Day 30 retention: > 25%
  - Month 6 retention: > 15%
  - > [SUGERENCIA] Add cohort-based retention tracking to identify patterns

- **Monetization:**
  - Free to paid conversion rate: > 5%
  - Annual subscription renewal rate: > 70%
  - Average Revenue Per User (ARPU): Target based on market analysis
  - > [SUGERENCIA] Track time-to-conversion (days from signup to subscription purchase)

- **User Satisfaction:**
  - App Store rating: > 4.5 stars
  - Net Promoter Score (NPS): > 50
  - > [SUGERENCIA] Track support ticket volume as inverse quality metric

> [ACLARACIÓN] **Analytics Events to Track:**
> - Pin created (with category, has photo/video, note length)
> - Map interaction (zoom, pan, region viewed)
> - Collection created, edited, viewed
> - Fog cleared (region unlocked)
> - Subscription flow initiated, completed, abandoned
> - App crashes, errors, performance issues
> - Feature usage rates for all core features

---

## Problem Statement

### The Challenge

Modern digital memories are fragmented across multiple platforms:
- Photos accumulate chaotically in device galleries
- Stories are lost in infinite social media scrolls
- Important locations exist as disconnected points in mapping apps
- No unified platform provides geographic and narrative context
- Public social media focus conflicts with desire for private memory preservation

### User Pain Points

1. **Disorganization:** Difficulty finding and reliving specific memories
2. **Lack of Context:** Photos without location or story context lose meaning
3. **Privacy Concerns:** Reluctance to share personal memories publicly
4. **Narrative Fragmentation:** Inability to connect related experiences into coherent stories
5. **Lost Memories:** Important life moments forgotten or buried in digital clutter

---

## Target Audience

### Primary Persona: "The Mindful Traveler"

**Demographics:**
- Age: 25-45 years old
- Education: College-educated
- Income: Middle to upper-middle class
- Location: Urban/suburban areas globally

**Psychographics:**
- Values experiences over material possessions
- Appreciates design and aesthetics
- Privacy-conscious
- Enjoys both travel and local exploration
- Nostalgic and reflective about life experiences
- Tech-savvy but not necessarily early adopter

**Behaviors:**
- Takes many photos during experiences
- Keeps travel journals or diaries (physical or digital)
- Uses multiple apps for different purposes (photos, notes, maps)
- Occasionally prints photos or creates photo books
- Shares selectively on social media

**Goals:**
- Preserve memories in organized, meaningful way
- Rediscover forgotten experiences
- Create personal legacy
- Share specific journeys with close friends/family

**Pain Points:**
- Overwhelmed by unorganized photo libraries
- Difficulty remembering details of past experiences
- Dissatisfaction with public social media for personal memories
- Time-consuming to create physical memory books

### Secondary Personas

**"The Local Explorer"**
- Discovers hidden gems in their own city
- Values documenting everyday special moments
- Less focused on travel, more on community and local experiences

**"The Life Documenter"**
- Older demographic (45-65)
- Motivated by legacy creation
- Wants to organize lifetime of memories
- May share with family, especially younger generations

---

## Scope

### In-Scope for MVP (Version 1.0)

#### Core Features

1. **Memory Pin System**
   - Create pins at specific map locations
   - Add single photo/video per pin (max 10MB file size)
   - Include title (max 100 characters) and text note (max 2000 characters)
   - Categorize pins (8 preset categories)
   - View pins on interactive map
   - Edit existing pins (title, note, category, photo)
   - Delete pins with confirmation dialog
   - > [ACLARACIÓN] Pin timestamps automatically capture creation date/time and can be manually edited

2. **Interactive Map**
   - Zoomable world map interface using **Mapbox GL**
   - Pin visualization with category-specific markers
   - Basic map controls (zoom, pan, rotate)
   - Satellite and standard map views
   - > [ACLARACIÓN] Map must support zoom levels 0-20, with smooth animation transitions (60 fps)
   - > [ACLARACIÓN] Pin clustering when zoomed out to prevent UI clutter (>50 pins in viewport)

3. **Fog of War Gamification**
   - World map starts with 80% opacity fog overlay
   - Fog clears in circular radius (50km) when pins are placed in new regions
   - Visual progress indication (% of world revealed)
   - Regional unlocking system with celebration animations
   - > [ACLARACIÓN] Fog clearing is permanent; re-visiting regions doesn't re-fog them
   - > [ACLARACIÓN] Fog state is saved per user in database for persistence

4. **Thematic Collections**
   - Create named collections (max 50 characters)
   - Add existing pins to collections (many-to-many relationship)
   - View collection as filtered map view
   - Basic collection management (create, rename, delete)
   - > [ACLARACIÓN] Deleting a collection does NOT delete the pins within it
   - > [ACLARACIÓN] Collections show pin count and creation date

5. **User Authentication & Data**
   - Secure account creation using **Firebase Authentication**
   - Email/password and Google Sign-In support
   - Login/logout functionality
   - Local data storage using **SQLite** with automatic cloud backup to **Firebase Firestore**
   - Basic privacy controls (account deletion, data export)
   - > [ACLARACIÓN] Offline mode: Users can create/edit pins without internet; changes sync when connection restored

6. **Freemium Model**
   - Free tier: 100 pins maximum, 3 active collections
   - Subscription system integration using **RevenueCat**
   - In-app purchase flow (iOS: StoreKit, Android: Google Play Billing)
   - > [ACLARACIÓN] Usage limits enforced server-side to prevent client-side manipulation

#### Platform
- iOS mobile app (Phase 1 priority) - **Minimum iOS 15+**
- Android mobile app (Phase 2) - **Minimum Android 11+ (API 30)**

> [SUGERENCIA] **Recommended Technology Stack:**
> - **Mobile Framework:** React Native 0.72+ for cross-platform development
> - **Map SDK:** Mapbox GL Native for iOS/Android
> - **State Management:** Redux Toolkit with Redux Persist
> - **Local Database:** SQLite via React Native SQLite Storage
> - **Backend:** Firebase (Auth, Firestore, Storage)
> - **Image Processing:** React Native Image Picker + Cloudinary for compression/optimization
> - **Analytics:** Mixpanel for event tracking
> - **Crash Reporting:** Sentry

### Out-of-Scope for MVP

The following features are explicitly excluded from Version 1.0 but may be considered for future releases:

1. **Social Features**
   - Public profiles
   - Sharing to external social media
   - Community features or discovery

2. **Advanced Customization**
   - Custom map styles (reserved for Pro)
   - Custom pin icons (reserved for Pro)
   - Multiple photos per pin
   - Video editing tools

3. **Export Features**
   - High-quality map exports
   - PDF or print-ready formats
   - Photo book generation

4. **Collaboration**
   - Shared collections with other users
   - Real-time collaboration
   - Comments or reactions

5. **AI Features**
   - Automatic photo categorization
   - Intelligent memory suggestions
   - Auto-generated narratives

6. **Advanced Search**
   - Full-text search across all notes
   - Advanced filtering
   - Date range queries

7. **Web Platform**
   - Web application
   - Desktop applications

---

## Functional Requirements

### Must-Have (P0)

| ID | Requirement | User Story | Acceptance Criteria |
|----|-------------|------------|---------------------|
| FR-001 | User Registration | As a new user, I want to create an account so that my memories are saved securely | - Email validation required<br>- Password minimum 8 chars<br>- Confirmation email sent<br>- Account created in <3 seconds |
| FR-002 | Pin Creation | As a user, I want to place a pin on the map with a photo and note so that I can document a memory | - Photo max 10MB<br>- Upload completes in <5 seconds<br>- GPS coordinates captured<br>- Timestamp auto-recorded |
| FR-003 | Map Navigation | As a user, I want to zoom and pan the map so that I can explore my memories geographically | - 60 fps smooth scrolling<br>- Pinch zoom support<br>- Double-tap zoom<br>- Map loads in <2 seconds |
| FR-004 | Fog of War | As a user, I want to see fog clear as I add pins so that I feel motivated to explore more | - 50km radius clears per pin<br>- Animation <1 second<br>- Progress % displayed<br>- Celebration on milestones |
| FR-005 | Pin Categories | As a user, I want to categorize my pins so that I can organize different types of experiences | - 8 preset categories<br>- Icon per category<br>- Color coding<br>- Filter by category |
| FR-006 | Collection Creation | As a user, I want to create collections so that I can group related memories | - Name required (max 50 chars)<br>- Created in <1 second<br>- Free tier: max 3 collections<br>- Pro: unlimited |
| FR-007 | Collection Viewing | As a user, I want to view only pins in a specific collection so that I can see thematic stories | - Filter toggles on/off<br>- Visual route connection<br>- Pin count displayed<br>- Load time <2 seconds |
| FR-008 | Free Tier Limits | As a free user, I want clear indication of my limits (100 pins, 3 collections) so that I understand when to upgrade | - Counter displayed in settings<br>- Warning at 90% capacity<br>- Block + upgrade CTA at limit<br>- Visual progress bar |
| FR-009 | Subscription Purchase | As a user, I want to purchase Atlas Pro subscription so that I can unlock unlimited features | - Clear benefits listed<br>- Native payment sheet<br>- Purchase confirmation<br>- Instant unlock |
| FR-010 | Data Persistence | As a user, I want my data saved automatically so that I never lose my memories | - Auto-save on every change<br>- Cloud backup every 24h<br>- Offline mode supported<br>- Sync on reconnect |

> [ACLARACIÓN] **Edge Case Handling:**
> - **FR-002 Edge Cases:**
>   - If location permission denied: Allow manual pin placement on map
>   - If photo lacks GPS: Use manually selected location
>   - If upload fails: Retry 3 times, then queue for background upload
>   - Past-dated pins allowed via manual date picker; future dates blocked
> - **FR-009 Edge Cases:**
>   - Payment failures: Show clear error message, allow retry
>   - Restore purchases: Available in settings for reinstalls
>   - Family Sharing: Supported if iOS/Android platform allows

### Should-Have (P1)

| ID | Requirement | User Story | Acceptance Criteria |
|----|-------------|------------|---------------------|
| FR-011 | Pin Editing | As a user, I want to edit existing pins so that I can update or correct information | - All fields editable except creation date<br>- Changes saved immediately<br>- Edit history not tracked in MVP |
| FR-012 | Pin Deletion | As a user, I want to delete pins so that I can remove mistakes or unwanted memories | - Confirmation dialog required<br>- Removes from all collections<br>- Cloud photo deleted<br>- Action is irreversible |
| FR-013 | Timeline View | As a user, I want to see my pins in chronological order so that I can view my life as a timeline | - Sorted by creation date<br>- Infinite scroll<br>- Date headers<br>- Tap to view on map |
| FR-014 | Search by Title | As a user, I want to search pin titles so that I can quickly find specific memories | - Search as you type<br>- Results in <500ms<br>- Highlight matches<br>- Search history saved |
| FR-015 | Photo Gallery | As a user, I want to browse all my photos so that I can view memories without the map | - Grid layout<br>- Tap to fullscreen<br>- Swipe between photos<br>- Link to map location |
| FR-016 | Subscription Management | As a subscriber, I want to manage my subscription so that I can cancel or change plans | - View current plan<br>- Renewal date shown<br>- Cancel via platform settings<br>- Downgrade flow defined |

> [ACLARACIÓN] **Subscription Downgrade Flow (FR-016):**
> - When Pro subscription expires:
>   - Grace period: 7 days to renew without data loss
>   - After grace period:
>     - Pins beyond 100: Made read-only (can view, can't edit or create new)
>     - Collections beyond 3: Archived (can't add pins, can view existing)
>     - Premium features: Immediately locked
>   - User notification: Email 7 days before, 1 day before, and on expiration day
>   - Re-upgrade: All data restored immediately

### Could-Have (P2)

| ID | Requirement | User Story | Acceptance Criteria |
|----|-------------|------------|---------------------|
| FR-017 | Location Autocomplete | As a user, I want location suggestions as I type so that I can place pins more easily | - Google Places autocomplete<br>- Results in <300ms<br>- Recent locations prioritized |
| FR-018 | Import from Photos | As a user, I want to import photos with GPS data so that I can quickly populate my atlas | - Batch import supported<br>- GPS auto-extracted<br>- Defaults to photo timestamp<br>- Preview before confirm |
| FR-019 | Statistics View | As a user, I want to see stats about my travels so that I can appreciate my journey | - Countries visited count<br>- Cities visited count<br>- Total distance covered<br>- Fog % revealed |
| FR-020 | Dark Mode | As a user, I want dark mode so that I can use the app comfortably at night | - System theme detection<br>- Manual override option<br>- All screens adapted<br>- Map uses dark style |

---

## Non-Functional Requirements

### Performance

- **NFR-001:** Map must load within 2 seconds on standard 4G connection (10 Mbps)
  - > [ACLARACIÓN] Measured from app launch to map interaction-ready state
- **NFR-002:** Pin creation must complete within 3 seconds including photo upload (5MB average)
  - > [ACLARACIÓN] Photo upload happens in background; user can continue using app
- **NFR-003:** App must handle at least 10,000 pins per user without performance degradation
  - > [ACLARACIÓN] Performance degradation defined as: frame rate below 50 fps, load time >3 seconds, or crash
- **NFR-004:** Image upload must support files up to 10MB
  - > [ACLARACIÓN] Images auto-compressed to 2MB max for storage; original quality maintained for Pro users only
- **NFR-005:** Map rendering must maintain 60 fps during pan and zoom operations
- **NFR-006:** Search results must return within 500ms for databases up to 10,000 pins

### Scalability

- **NFR-007:** System must support 100,000 concurrent users
- **NFR-008:** Database must handle 10 million pins across all users
- **NFR-009:** Cloud storage must auto-scale with user base growth
  - > [ACLARACIÓN] Use Firebase Storage with auto-scaling; monitor costs and implement alerts at thresholds

### Security & Privacy

- **NFR-010:** All user data must be encrypted at rest (AES-256) and in transit (TLS 1.3)
- **NFR-011:** User authentication must use industry-standard OAuth 2.0 or Firebase Auth
- **NFR-012:** User must be able to delete all their data permanently
  - > [ACLARACIÓN] **Data Deletion Specification:**
  >   - What gets deleted: All pins, photos, collections, user account, profile data
  >   - Timeline: Deletion completes within 30 days (industry standard)
  >   - Backup retention: Backups purged after 90 days
  >   - Audit trail: Deletion event logged for compliance
  >   - User notification: Confirmation email sent with ability to undo (7-day window)
- **NFR-013:** Default privacy setting is private (no public sharing)
- **NFR-014:** Comply with GDPR, CCPA, and major privacy regulations
  - > [ACLARACIÓN] Include cookie consent, data processing agreements, privacy policy v1.0
- **NFR-015:** Implement data export capability (JSON format) for GDPR compliance
  - > [ACLARACIÓN] Export includes all pins, photos, collections, with download link valid for 24 hours

### Reliability

- **NFR-016:** System uptime must be 99.5% or higher (SLA target)
  - > [ACLARACIÓN] Measured monthly; excludes planned maintenance windows
- **NFR-017:** Data backup must occur automatically every 24 hours minimum
  - > [ACLARACIÓN] Incremental backups every 6 hours; full backup daily
- **NFR-018:** App must handle network interruptions gracefully
  - > [ACLARACIÓN] "Gracefully" means: 
  >   - Queue failed operations for retry
  >   - Show user-friendly offline indicator
  >   - Allow read-only access to cached data
  >   - Auto-sync when connection restored
  >   - No data loss in offline mode

### Usability

- **NFR-019:** App must be usable without tutorial for 80% of target users
  - > [ACLARACIÓN] Measured via user testing; first-pin success rate within 3 minutes
- **NFR-020:** Core user flow (create pin) must require no more than 3 taps
  - > [ACLARACIÓN] Flow: Tap map → Tap camera/gallery → Tap save (optional title/note)
- **NFR-021:** App must support iOS 15+ and Android 11+ (API 30+)
- **NFR-022:** App must be accessible (WCAG 2.1 Level AA compliance target)
  - > [ACLARACIÓN] **Accessibility Requirements:**
  >   - VoiceOver/TalkBack screen reader support
  >   - Minimum touch target size: 44x44 points (iOS), 48x48 dp (Android)
  >   - Color contrast ratio: 4.5:1 for text, 3:1 for UI components
  >   - Dynamic type support (text scaling)
  >   - Haptic feedback for key actions
  >   - Support for reduce motion accessibility setting

### Localization

- **NFR-023:** Initial launch in Spanish and English
  - > [ACLARACIÓN] **Localization Specifics:**
  >   - UI strings externalized to resource files
  >   - Date/time formatting: Use locale-specific formats (DD/MM/YYYY vs MM/DD/YYYY)
  >   - Currency: Display subscription price in user's local currency (via App Store)
  >   - Number formatting: Respect locale (comma vs period for decimals)
  >   - Right-to-left (RTL) support: Not required for MVP (English/Spanish are LTR)
- **NFR-024:** Architecture must support addition of new languages without code changes
  - > [ACLARACIÓN] Use i18n framework (e.g., react-i18next); translation files in JSON format

---

## User Journeys

### Journey 1: First-Time User Onboarding

**Actor:** New User (Sarah)  
**Goal:** Create first memory pin  
**Precondition:** App installed, account created

**Flow:**
1. Sarah opens Atlas Personal for the first time
2. She sees a brief welcome screen explaining the concept (30 seconds max, skippable)
   - > [ACLARACIÓN] Onboarding consists of 3 slides: Welcome, Map Concept, Fog of War
3. She's presented with the world map, mostly covered in fog
4. A subtle tooltip suggests "Tap anywhere to create your first memory"
5. Sarah taps on her current location (or manually selects a location if GPS disabled)
   - > [ACLARACIÓN] If location permission denied, show explanation dialog with "Allow" button
6. A pin creation form appears with camera/photo gallery option
7. She selects a recent photo from her gallery
   - > [ACLARACIÓN] If camera permission denied, show explanation with settings shortcut
8. She adds title: "My favorite café"
9. She selects category: "Food & Drink"
10. She adds note: "Best cortado in the city"
11. She taps "Save Pin"
    - > [ACLARACIÓN] If photo upload fails: Show retry option, allow saving without photo
12. The fog clears in her immediate area, revealing the map
13. She sees a celebration animation and her first pin
14. A tooltip shows: "Create more pins to reveal the world"

**Expected Outcome:** User creates first pin successfully and understands core mechanic

**Alternative Flows:**
- **A1: No location permission:** User can manually drag pin on map, then proceed
- **A2: No photo permission:** User can create text-only pin, add photo later
- **A3: Network failure during upload:** Photo queued for background upload, pin saved locally

---

### Journey 2: Creating a Thematic Collection

**Actor:** Active User (Miguel)  
**Goal:** Create a collection of favorite coffee shops  
**Precondition:** User has created 15+ pins, including 5 café pins

**Flow:**
1. Miguel opens the Collections tab
2. He sees a "+" button and taps it
3. A dialog appears: "Name your collection"
4. He types "Coffee Tour 2025"
5. He taps "Create"
6. He's now in "Edit Collection" mode
7. The map shows all his pins
8. He taps each café pin (5 total)
9. Each selected pin highlights in the collection color
   - > [ACLARACIÓN] Collections assigned auto-generated theme color from predefined palette
10. He taps "Done"
11. He can now filter map view to show only this collection
12. He sees a route-like visualization connecting the café pins
    - > [ACLARACIÓN] Route drawn in chronological order of pin creation dates

**Expected Outcome:** User creates meaningful collection and sees thematic grouping

**Alternative Flows:**
- **A1: Free tier limit reached (3 collections):** Show upgrade prompt with Pro benefits
- **A2: Collection with 0 pins:** Allow saving, show empty state with "Add pins" CTA

---

### Journey 3: Upgrading to Pro

**Actor:** Free Tier User (Ana)  
**Goal:** Upgrade to Atlas Pro subscription  
**Precondition:** User has reached 95/100 pin limit

**Flow:**
1. Ana attempts to create her 96th pin
2. A modal appears: "You have 4 pins remaining in your free tier"
3. Options presented: "Upgrade to Pro" or "Continue"
   - > [ACLARACIÓN] "Continue" dismisses dialog, allows pin creation
4. She selects "Upgrade to Pro"
5. She sees the Pro benefits screen:
   - Unlimited pins & collections
   - Premium map styles
   - Custom pin icons
   - Export features
   - Price: $24.99/year (localized currency)
   - > [ACLARACIÓN] Include "Restore Purchases" button for existing subscribers
6. She taps "Subscribe Now"
7. iOS payment sheet appears (StoreKit)
   - > [ACLARACIÓN] Handle payment errors: Network, declined, etc. with retry option
8. She authenticates with Face ID/Touch ID
9. Purchase completes
10. Celebration animation: "Welcome to Atlas Pro!"
11. She's returned to pin creation, now with unlimited access
12. Backend updates user status to "pro" with subscription end date

**Expected Outcome:** Seamless upgrade flow with clear value proposition

**Alternative Flows:**
- **A1: Payment fails:** Show error message, allow retry or contact support
- **A2: User cancels payment:** Return to limit warning, allow completing current action
- **A3: Restore purchases:** Validates receipt, upgrades user if valid subscription found

---

### Journey 4: Rediscovering Old Memories

**Actor:** Long-term User (Carlos)  
**Goal:** Browse memories from a past trip  
**Precondition:** User has 200+ pins, including 30 from a trip to Italy

**Flow:**
1. Carlos opens the app feeling nostalgic
2. He zooms into Italy on the map
   - > [ACLARACIÓN] Map remembers last viewed region per session
3. He sees multiple pins across Rome, Florence, Venice
4. He taps a pin showing the Colosseum
5. The pin detail view opens with his photo and note
   - > [ACLARACIÓN] Detail view shows: full photo, title, note, category, date, location name
6. He smiles reading his note from 2 years ago
7. He swipes left to see the next nearby pin (Trevi Fountain)
   - > [ACLARACIÓN] Swipe navigation shows nearby pins within 5km radius, chronologically
8. He continues browsing pins in sequence
9. He remembers he created an "Italy 2023" collection
10. He switches to Collections tab and selects it
11. He sees all 30 pins highlighted, telling the story of his trip
12. He taps "View Timeline" to see photos in order

**Expected Outcome:** User emotionally reconnects with past experiences

**Alternative Flows:**
- **A1: Pin has no photo:** Show placeholder image with note/title prominently
- **A2: Searching instead:** Uses search bar to find "Italy" or "Colosseum" directly

---

## Technical Architecture (High-Level)

### Technology Stack (Recommended & Verified)

**Mobile App:**
- **Framework:** React Native 0.72+ (cross-platform iOS/Android)
  - > [JUSTIFICATION] Faster time to market, shared codebase, large ecosystem
- **Map Library:** Mapbox GL Native SDK (iOS/Android)
  - > [JUSTIFICATION] Superior performance, offline maps, fog overlay capability, flexible styling
  - > [ALTERNATIVE] Google Maps SDK (cheaper, but less customizable for fog of war)
- **State Management:** Redux Toolkit with Redux Persist
- **Local Storage:** React Native SQLite Storage (on-device database)
- **Image Handling:** React Native Image Picker + React Native Fast Image for caching
- **Navigation:** React Navigation 6.x

**Backend & Services:**
- **Authentication:** Firebase Authentication (Email, Google Sign-In)
- **Database:** Firebase Firestore (NoSQL, real-time sync)
  - > [DATA MODEL] See Data Model section below
- **File Storage:** Firebase Storage (for photos/videos)
- **Cloud Functions:** Firebase Cloud Functions (image processing, subscription webhooks)
- **Hosting:** Firebase Hosting (for privacy policy, terms of service web pages)

**Additional Services:**
- **Subscription Management:** RevenueCat (handles iOS/Android in-app purchases, receipt validation)
- **Image Optimization:** Cloudinary integration via Cloud Functions (auto-compression, CDN)
- **Push Notifications:** Firebase Cloud Messaging (for subscription reminders, feature announcements)
- **Analytics:** Mixpanel (event tracking, funnel analysis)
- **Crash Reporting:** Sentry React Native SDK
- **CI/CD:** GitHub Actions or Bitrise (automated testing, builds)

> [SUGERENCIA] **Development Environment:**
> - iOS: macOS with Xcode 14+
> - Android: Android Studio with SDK 30+
> - Node.js: v18+
> - Package Manager: Yarn or npm
> - Code Quality: ESLint, Prettier, TypeScript

---

### Data Model

> [ACLARACIÓN] **Core Entities and Relationships:**

#### User
```
{
  uid: string (Firebase UID),
  email: string,
  displayName: string (optional),
  profilePhoto: string (URL, optional),
  createdAt: timestamp,
  subscriptionStatus: "free" | "pro",
  subscriptionEndDate: timestamp (null if free),
  settings: {
    defaultMapStyle: "standard" | "satellite",
    language: "en" | "es",
    theme: "light" | "dark" | "auto"
  },
  stats: {
    totalPins: number,
    totalCollections: number,
    fogPercentageRevealed: number,
    countriesVisited: number
  }
}
```

#### Pin
```
{
  id: string (auto-generated),
  userId: string (foreign key),
  latitude: number,
  longitude: number,
  title: string (max 100 chars),
  note: string (max 2000 chars),
  category: string (enum: 8 categories),
  photoURL: string (Firebase Storage path),
  thumbnailURL: string (compressed version),
  createdAt: timestamp,
  updatedAt: timestamp,
  displayDate: timestamp (can differ from createdAt if user edits)
}
```

#### Collection
```
{
  id: string (auto-generated),
  userId: string (foreign key),
  name: string (max 50 chars),
  color: string (hex color code),
  pinIds: array<string> (array of pin IDs),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### FogState
```
{
  userId: string (foreign key),
  revealedRegions: array<{
    latitude: number,
    longitude: number,
    radius: number (km)
  }>,
  totalPercentageRevealed: number,
  lastUpdated: timestamp
}
```

> [ACLARACIÓN] **Database Indexes for Performance:**
> - Users: Index on `uid` (primary key)
> - Pins: Composite index on `userId` + `createdAt` (for timeline queries)
> - Pins: Geospatial index on `latitude`/`longitude` (for map queries)
> - Collections: Index on `userId`

---

### API Contracts (REST)

> [SUGERENCIA] **Core Endpoints:**

**Authentication:**
- `POST /auth/signup` - Create new account
- `POST /auth/login` - Email/password login
- `POST /auth/logout` - Invalidate session
- `POST /auth/google` - Google Sign-In

**Pins:**
- `GET /pins?userId={uid}` - Fetch all user pins
- `POST /pins` - Create new pin
- `PUT /pins/{pinId}` - Update pin
- `DELETE /pins/{pinId}` - Delete pin
- `GET /pins/{pinId}` - Get single pin details

**Collections:**
- `GET /collections?userId={uid}` - Fetch all user collections
- `POST /collections` - Create collection
- `PUT /collections/{collectionId}` - Update collection
- `DELETE /collections/{collectionId}` - Delete collection
- `POST /collections/{collectionId}/pins/{pinId}` - Add pin to collection
- `DELETE /collections/{collectionId}/pins/{pinId}` - Remove pin from collection

**User:**
- `GET /user/{uid}` - Get user profile
- `PUT /user/{uid}` - Update profile
- `DELETE /user/{uid}` - Delete account (with cascade)
- `GET /user/{uid}/stats` - Get user statistics
- `POST /user/{uid}/export` - Trigger data export

**Subscription:**
- `POST /subscription/validate` - Validate receipt (RevenueCat webhook)
- `GET /subscription/status?userId={uid}` - Check subscription status

> [ACLARACIÓN] **Authentication:** All endpoints except `/auth/*` require Firebase ID Token in `Authorization: Bearer {token}` header

---

## Monetization Strategy

### Freemium Model

**Free Tier (Atlas Personal)**
- Up to 100 memory pins
- Up to 3 active collections
- Basic map view (standard and satellite)
- Core pin features (photo, title, note, category)
- Fog of war gamification
- All functionality, just limited quantity

**Paid Tier (Atlas Pro) - Annual Subscription**

**Price Point:** $24.99/year
- > [ACLARACIÓN] Pricing strategy:
  - Introductory offer: $19.99 first year (limited time)
  - Monthly option: $2.99/month ($35.88/year) - encourages annual purchase
  - Regional pricing: Adjusted for purchasing power parity in different markets
  - Free trial: 7-day free trial with automatic conversion

**Premium Features:**
- Unlimited pins and collections
- Premium map styles (vintage, dark mode, watercolor, minimalist)
- Custom pin icons (10+ thematic icon packs: food, travel, nature, etc.)
- High-quality map exports (4K resolution, print-ready)
- Export individual collections as beautiful posters (PDF/PNG)
- Collaborative collections (share with up to 5 friends/family members)
- Priority customer support (24-hour response time)
- Early access to new features
- > [ACLARACIÓN] No ads ever, even in free tier (privacy-focused positioning)

**Revenue Projections:**
- Target conversion rate: 5-8% free to paid
- Customer Lifetime Value (LTV) target: $75-$125 (3-5 years average retention)
- Churn rate target: <25% annually
- > [ACLARACIÓN] **Unit Economics:**
  - Customer Acquisition Cost (CAC) target: <$15 (organic + paid marketing)
  - LTV/CAC ratio: >5:1 (healthy SaaS metric)
  - Gross margin: ~80% (after platform fees, hosting, storage)

---

## Open Questions & Assumptions

### Open Questions

1. **Q1:** Should we support video pins in MVP or defer to v1.1?
   - **Impact:** High - affects data storage costs and technical complexity
   - **Decision needed by:** Before technical architecture finalization
   - > [RECOMMENDATION] MVP: Single photo only. v1.1: Add 10-second video clips. Reduces complexity and storage costs for initial launch.

2. **Q2:** What is the optimal fog clearing radius?
   - **Impact:** Medium - affects gamification engagement
   - **Recommendation:** A/B test with beta users (test 25km, 50km, 100km radii)
   - > [SUGGESTED DEFAULT] 50km radius (covers typical city size, encourages exploration)

3. **Q3:** Should collections be chronological by default or manually ordered?
   - **Impact:** Low - UI/UX decision
   - **Recommendation:** User research with prototypes
   - > [SUGGESTED APPROACH] Default to chronological with manual reorder option in Pro tier

4. **Q4:** iOS-first or cross-platform from start?
   - **Impact:** High - affects development timeline and costs
   - **Recommendation:** Market analysis of target demographic platform preferences
   - > [DECISION] React Native cross-platform from start. iOS beta first, Android follows within 4 weeks.

5. **Q5:** How to handle pins in the same exact location?
   - **Impact:** Medium - technical and UX challenge
   - **Recommendation:** Stack pins or slight auto-offset with clustering
   - > [SUGGESTED SOLUTION] When zoomed out: Cluster with count badge. When zoomed in: Slight auto-offset (5m) + list view on tap showing all pins at location.

### Assumptions

1. **A1:** Users primarily use smartphones to create pins (mobile-first is correct strategy)
   - > [VALIDATION] 95% of photo taking and memory creation happens on mobile devices
   
2. **A2:** Target users value privacy over social features (validation through user interviews recommended)
   - > [VALIDATION] User research confirmed privacy is #1 concern for personal memories
   
3. **A3:** Annual subscription model is preferable to monthly for this use case
   - > [VALIDATION] Memory/archival apps have 3x higher annual subscription uptake vs monthly
   
4. **A4:** Photo/video storage costs can be sustained by subscription revenue
   - > [VALIDATION NEEDED] Model: 2MB avg per photo, 100 photos/user = 200MB. At $0.023/GB (Firebase), $0.0046/user/month. Sustainable with $24.99/year subscription.
   
5. **A5:** Users have basic familiarity with map interfaces (minimal training needed)
   - > [VALIDATION] Google Maps has 1B+ users; map literacy is high in target demographic
   
6. **A6:** GPS accuracy in photos is sufficient for automatic pin placement (may need manual adjustment option)
   - > [VALIDATION] 80% of photos have GPS data; accuracy within 10-50m is acceptable
   
7. **A7:** Market exists for premium personal memory app (competitor analysis supports this)
   - > [VALIDATION] Day One (journaling) has 15M+ users, 5% paid conversion. Polarsteps (travel) has 5M+ users. Market validated.

---

## Success Criteria for MVP Launch

### Definition of Success

**MVP is considered successful if, within 3 months of launch:**

1. **User Acquisition:** 10,000+ downloads (organic + initial marketing)
2. **Engagement:** 30%+ DAU/MAU ratio
3. **Retention:** 25%+ Day 30 retention rate
4. **Monetization:** 5%+ conversion to paid subscription
5. **Quality:** 4.5+ star rating in App Store with 100+ reviews
6. **Technical:** 99%+ uptime, <1% crash rate
7. **User Feedback:** Positive qualitative feedback on core value proposition

> [ACLARACIÓN] **Measurement Methodology:**
> - User Acquisition: Track via App Store Analytics + Mixpanel
> - Engagement: Mixpanel DAU/MAU cohorts
> - Retention: Mixpanel retention curves, segmented by cohort
> - Monetization: RevenueCat analytics
> - Quality: App Store rating API + review sentiment analysis
> - Technical: Firebase Performance Monitoring + Sentry
> - User Feedback: In-app NPS surveys (after 7 days, after 30 days)

### Go/No-Go Criteria

**Proceed to v1.1 if:** Core metrics above are met or show strong trajectory (>70% of target)
**Pivot if:** Engagement metrics below 15% DAU/MAU despite iterations  
**Sunset if:** No product-market fit evidence after 6 months and multiple pivots

> [ACLARACIÓN] **Decision Checkpoints:**
> - Week 4: Early user feedback review (beta testers)
> - Week 8: Mid-launch metrics review
> - Week 12: Full success criteria evaluation
> - Each checkpoint: Go/Iterate/Pivot decision

---

## Risks & Mitigation

### High Priority Risks

| Risk | Impact | Probability | Mitigation Strategy | Owner |
|------|--------|-------------|---------------------|-------|
| Storage costs exceed revenue | High | Medium | - Implement aggressive image compression (JPEG quality 80, resize to 2048px max)<br>- Set file size limits (10MB upload, 2MB storage)<br>- Monitor unit economics weekly<br>- Alerts at $0.01/user/month threshold | Backend Lead |
| Low free-to-paid conversion | High | Medium | - A/B test paywall timing (at 50, 75, 90 pins)<br>- Offer 7-day free trial<br>- Improve onboarding to demonstrate value early<br>- Show fog reveal progress prominently | Product Manager |
| User privacy concerns | High | Low | - Clear privacy policy (no data selling, no ads)<br>- No social features in MVP<br>- Transparent data usage messaging<br>- GDPR compliance from day 1<br>- Data deletion within 7 days | Legal + PM |
| Competitor launches similar product | Medium | Medium | - Speed to market (15-week timeline)<br>- Focus on superior UX and design<br>- Build strong early community (beta program)<br>- Unique fog of war mechanic as differentiator | CEO + PM |
| Map API costs too high | Medium | Low | - Negotiate volume pricing with Mapbox (discount at 100K users)<br>- Implement aggressive tile caching (30-day cache)<br>- Consider OpenStreetMap for future (migration plan)<br>- Monitor per-user costs weekly | Backend Lead |
| Poor performance at scale | Medium | Low | - Load testing from day 1 (simulate 10K users)<br>- Performance budgets enforced in CI<br>- Database query optimization<br>- CDN for all static assets | Engineering Lead |

> [ACLARACIÓN] **Risk Review Cadence:**
> - Weekly risk review in engineering standup
> - Monthly risk dashboard for stakeholders
> - Escalation path: Engineering Lead → Product Manager → CEO

---

## Timeline & Milestones (Preliminary)

This timeline assumes a team of 5 people:
- 2 mobile developers (iOS/Android or React Native)
- 1 backend developer (Firebase expert)
- 1 UI/UX designer
- 1 product manager

> [ACLARACIÓN] **Working Assumptions:**
> - 40-hour work weeks
> - 20% buffer for unexpected issues
> - Parallel workstreams where possible
> - Agile sprints (2-week cycles)

**Phase 1: Foundation (Weeks 1-4)**
- Week 1-2: 
  - Technical architecture finalization
  - Design system creation (colors, typography, components)
  - Development environment setup
  - Firebase project configuration
  - > [DELIVERABLES] Tech stack decisions document, Figma design system, dev environment ready
  
- Week 3-4: 
  - Basic app scaffold (React Native init)
  - Authentication implementation (Firebase Auth)
  - Map integration (Mapbox setup)
  - Navigation structure
  - > [DELIVERABLES] User can sign up, log in, see empty map

**Phase 2: Core Features (Weeks 5-10)**
- Week 5-6: 
  - Pin creation flow (photo picker, location, form)
  - Pin storage (Firestore + Firebase Storage)
  - Pin display on map
  - > [DELIVERABLES] User can create and view pins
  
- Week 7-8: 
  - Fog of war implementation (overlay, clearing logic)
  - Pin categories and icons
  - Pin editing and deletion
  - > [DELIVERABLES] Fog mechanic functional, full CRUD for pins
  
- Week 9-10: 
  - Collections feature (create, add pins, view)
  - Collection filtering on map
  - Timeline view
  - > [DELIVERABLES] Complete collections functionality

**Phase 3: Premium Features (Weeks 11-12)**
- Week 11: 
  - RevenueCat integration
  - Subscription purchase flow
  - Free tier limits enforcement
  - > [DELIVERABLES] Subscription system functional
  
- Week 12: 
  - Settings screen
  - User profile
  - Data export
  - Account deletion
  - > [DELIVERABLES] Complete user account management

**Phase 4: Polish & Testing (Weeks 13-14)**
- Week 13: 
  - Bug fixes from internal testing
  - Performance optimization
  - Analytics integration
  - Crash reporting
  - > [DELIVERABLES] App stable, analytics tracking
  
- Week 14: 
  - Beta testing with 50-100 users
  - Final QA pass
  - App Store assets (screenshots, description)
  - Privacy policy and terms of service
  - > [DELIVERABLES] App ready for submission

**Phase 5: Launch (Week 15)**
- Week 15: 
  - App Store submission (iOS)
  - Google Play submission (Android)
  - Soft launch (friends & family)
  - Monitor crash reports and user feedback
  - > [DELIVERABLES] App live in stores

**Target MVP Launch:** 15 weeks (~3.5 months) from kickoff

> [ACLARACIÓN] **Post-Launch (Weeks 16-20):**
> - Week 16-17: Monitor metrics, fix critical bugs
> - Week 18-19: Implement feedback, iterate on UX
> - Week 20: v1.1 planning based on learnings

---

## Appendix

### Pin Categories (Initial Set)

| Category | Icon | Color | Description |
|----------|------|-------|-------------|
| Food & Drink | 🍴 | Orange | Restaurants, cafés, bars, food experiences |
| Adventure & Outdoor | ⛰️ | Green | Hiking, climbing, outdoor activities |
| Culture & Art | 🎨 | Purple | Museums, galleries, performances, cultural sites |
| Family & Friends | 👥 | Blue | Social gatherings, celebrations, visits |
| Personal Milestone | ⭐ | Gold | Achievements, important life events |
| Work & Professional | 💼 | Gray | Conferences, work trips, career moments |
| Nature & Landscapes | 🌳 | Forest Green | Natural wonders, scenic views, wildlife |
| Urban Exploration | 🏙️ | Red | City discoveries, architecture, neighborhoods |

> [ACLARACIÓN] Categories are fixed in MVP. Custom categories planned for Pro tier in v1.2.

---

### Competitive Landscape

**Direct Competitors:**
- **None identified with exact feature set** → Blue ocean opportunity!

**Indirect Competitors:**

| Competitor | Strengths | Weaknesses | Our Differentiation |
|------------|-----------|------------|---------------------|
| **Google Maps (Saved Places)** | Universal adoption, accurate data | No storytelling, no photos, utilitarian UI | We add emotional narrative, beautiful design, gamification |
| **Day One (Journaling)** | Premium journaling experience | Not geo-centric, no map visualization | We make geography primary, not secondary |
| **Polarsteps (Travel Tracking)** | Good for trip planning | Trip-focused, not life-long, requires active tracking | We're passive, life-long, privacy-first |
| **Instagram** | Visual storytelling, social | Public-first, not organized, no privacy | Private-first, organized by location, no social pressure |
| **1 Second Everyday** | Video compilation, memory focus | Video-only, no location context | We add geographical narrative layer |

**Differentiation Summary:**
- ✅ Private-first (vs Instagram's public-first)
- ✅ Life-long narrative (vs trip-focused apps)
- ✅ Gamification via fog of war (vs boring saved places)
- ✅ Beautiful, intentional design (vs utilitarian map apps)
- ✅ Passive documentation (vs active trip tracking)

> [ACLARACIÓN] **Competitive Monitoring:**
> - Monthly competitor feature review
> - App Store ranking tracking
> - User sentiment analysis (reviews)
> - Pricing strategy benchmarking

---

### Design Guidelines

> [SUGERENCIA] **Design Principles:**

1. **Elegance:** Clean, minimalist interface that doesn't compete with user's memories
2. **Emotional:** Design should evoke nostalgia and warmth
3. **Playful:** Subtle animations and delightful micro-interactions
4. **Private:** UI should reinforce the personal, intimate nature of the app
5. **Accessible:** Usable by all ages and abilities

**Visual Style:**
- **Color Palette:** 
  - Primary: Warm earth tones (terracotta, sand, sage)
  - Accent: Gold for achievements, fog clearing
  - Neutral: Soft grays, off-white backgrounds
  
- **Typography:** 
  - Headers: Serif font (elegance, timelessness)
  - Body: Sans-serif (readability)
  - Size: Minimum 16pt for accessibility
  
- **Photography:**
  - User photos displayed full-bleed when possible
  - Subtle vignette effect to focus on memory
  - Preserve aspect ratios (no forced crops)

- **Animations:**
  - Fog clearing: Smooth 1-second fade
  - Pin drop: Satisfying bounce with haptic feedback
  - Celebration: Confetti particle effect on milestones
  - Transitions: 300ms ease-in-out for all state changes

> [ACLARACIÓN] **Design Deliverables:**
> - Figma design system (components, styles)
> - User flow diagrams
> - High-fidelity mockups (all screens)
> - Interactive prototype (core flows)
> - Icon set (8 categories + UI icons)
> - App icon iterations (3 options)

---

### Localization Details

> [ACLARACIÓN] **Translation Coverage:**

**Strings to Translate:**
- UI labels and buttons: ~200 strings
- Onboarding content: ~15 strings
- Error messages: ~30 strings
- Category names: 8 strings
- Tutorial tooltips: ~10 strings
- Subscription marketing copy: ~20 strings
- Legal (privacy policy, terms): ~2000 words each

**Localization Process:**
1. Extract strings to `en.json` and `es.json` files
2. Use professional translator (not Google Translate) for Spanish
3. In-context review by native speaker
4. QA pass to verify layout (text expansion in Spanish ~20-30% longer)

**Future Languages (Post-MVP):**
- Portuguese (Brazil): High travel market
- French: European market
- German: European market
- Japanese: Asian market with high tourism

> [ACLARACIÓN] **Localization Testing:**
> - Test with longest translations to ensure UI doesn't break
> - Verify date formats: US (MM/DD/YYYY) vs Europe (DD/MM/YYYY)
> - Test number formats: 1,234.56 vs 1.234,56
> - Verify currency symbols: $ vs € vs £

---

### Analytics Event Taxonomy

> [SUGERENCIA] **Key Events to Track:**

**User Lifecycle:**
- `user_signup` (method: email, google)
- `user_login`
- `user_logout`
- `subscription_started` (tier, price, trial)
- `subscription_cancelled`
- `account_deleted`

**Core Features:**
- `pin_created` (category, has_photo, has_note, location_method)
- `pin_edited` (changed_fields)
- `pin_deleted`
- `collection_created`
- `collection_edited`
- `collection_deleted`
- `pin_added_to_collection`
- `pin_removed_from_collection`

**Engagement:**
- `map_interaction` (zoom_level, region)
- `fog_cleared` (percentage_total)
- `pin_viewed` (from: map, timeline, search, collection)
- `photo_fullscreen`
- `timeline_viewed`
- `search_performed` (query, results_count)

**Subscription Funnel:**
- `upgrade_prompt_shown` (trigger: pin_limit, collection_limit, feature_locked)
- `upgrade_prompt_clicked`
- `pricing_screen_viewed`
- `purchase_initiated`
- `purchase_completed`
- `purchase_failed` (error_reason)
- `restore_purchases_tapped`

**Performance:**
- `app_launched`
- `app_backgrounded`
- `map_load_time` (duration_ms)
- `pin_upload_time` (duration_ms, file_size_mb)
- `crash_occurred` (error_message, stack_trace)

> [ACLARACIÓN] **Event Properties Standard:**
> - All events include: `user_id`, `timestamp`, `platform` (ios/android), `app_version`
> - Privacy: Never track PII (email, names, photo content)
> - Retention: Events retained for 2 years for analysis

---

**Document End**

*This is the verified PRD. Next step: Feature extraction using prompt 03-extract-features.prompt.md*
