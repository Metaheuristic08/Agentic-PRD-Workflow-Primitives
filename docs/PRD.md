# Product Requirements Document: Atlas Personal

## Overview

**Product Name:** Atlas Personal  
**Tagline:** El Mapa de Tu Vida (The Map of Your Life)  
**Version:** 1.0 (MVP)  
**Document Status:** Draft  
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
  
- **Retention:**
  - Day 7 retention: > 40%
  - Day 30 retention: > 25%
  - Month 6 retention: > 15%

- **Monetization:**
  - Free to paid conversion rate: > 5%
  - Annual subscription renewal rate: > 70%
  - Average Revenue Per User (ARPU): Target based on market analysis

- **User Satisfaction:**
  - App Store rating: > 4.5 stars
  - Net Promoter Score (NPS): > 50

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
   - Add single photo/video per pin
   - Include title and text note
   - Categorize pins (5-8 preset categories)
   - View pins on interactive map

2. **Interactive Map**
   - Zoomable world map interface
   - Pin visualization with custom markers
   - Basic map controls (zoom, pan)
   - Satellite and standard map views

3. **Fog of War Gamification**
   - World map starts with subtle fog overlay
   - Fog clears when pins are placed in new regions
   - Visual progress indication
   - Regional unlocking system

4. **Thematic Collections**
   - Create named collections
   - Add existing pins to collections
   - View collection as filtered map view
   - Basic collection management (create, rename, delete)

5. **User Authentication & Data**
   - Secure account creation
   - Login/logout functionality
   - Local data storage with cloud backup
   - Basic privacy controls

6. **Freemium Model**
   - Free tier: 100 pins maximum, 3 active collections
   - Subscription system integration
   - In-app purchase flow

#### Platform
- iOS mobile app (Phase 1 priority)
- Android mobile app (Phase 1 or Phase 2)

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

| ID | Requirement | User Story |
|----|-------------|------------|
| FR-001 | User Registration | As a new user, I want to create an account so that my memories are saved securely |
| FR-002 | Pin Creation | As a user, I want to place a pin on the map with a photo and note so that I can document a memory |
| FR-003 | Map Navigation | As a user, I want to zoom and pan the map so that I can explore my memories geographically |
| FR-004 | Fog of War | As a user, I want to see fog clear as I add pins so that I feel motivated to explore more |
| FR-005 | Pin Categories | As a user, I want to categorize my pins so that I can organize different types of experiences |
| FR-006 | Collection Creation | As a user, I want to create collections so that I can group related memories |
| FR-007 | Collection Viewing | As a user, I want to view only pins in a specific collection so that I can see thematic stories |
| FR-008 | Free Tier Limits | As a free user, I want clear indication of my limits (100 pins, 3 collections) so that I understand when to upgrade |
| FR-009 | Subscription Purchase | As a user, I want to purchase Atlas Pro subscription so that I can unlock unlimited features |
| FR-010 | Data Persistence | As a user, I want my data saved automatically so that I never lose my memories |

### Should-Have (P1)

| ID | Requirement | User Story |
|----|-------------|------------|
| FR-011 | Pin Editing | As a user, I want to edit existing pins so that I can update or correct information |
| FR-012 | Pin Deletion | As a user, I want to delete pins so that I can remove mistakes or unwanted memories |
| FR-013 | Timeline View | As a user, I want to see my pins in chronological order so that I can view my life as a timeline |
| FR-014 | Search by Title | As a user, I want to search pin titles so that I can quickly find specific memories |
| FR-015 | Photo Gallery | As a user, I want to browse all my photos so that I can view memories without the map |
| FR-016 | Subscription Management | As a subscriber, I want to manage my subscription so that I can cancel or change plans |

### Could-Have (P2)

| ID | Requirement | User Story |
|----|-------------|------------|
| FR-017 | Location Autocomplete | As a user, I want location suggestions as I type so that I can place pins more easily |
| FR-018 | Import from Photos | As a user, I want to import photos with GPS data so that I can quickly populate my atlas |
| FR-019 | Statistics View | As a user, I want to see stats about my travels so that I can appreciate my journey |
| FR-020 | Dark Mode | As a user, I want dark mode so that I can use the app comfortably at night |

---

## Non-Functional Requirements

### Performance

- **NFR-001:** Map must load within 2 seconds on standard 4G connection
- **NFR-002:** Pin creation must complete within 3 seconds including photo upload
- **NFR-003:** App must handle at least 10,000 pins per user without performance degradation
- **NFR-004:** Image upload must support files up to 10MB

### Scalability

- **NFR-005:** System must support 100,000 concurrent users
- **NFR-006:** Database must handle 10 million pins across all users
- **NFR-007:** Cloud storage must auto-scale with user base growth

### Security & Privacy

- **NFR-008:** All user data must be encrypted at rest and in transit (SSL/TLS)
- **NFR-009:** User authentication must use industry-standard OAuth 2.0 or similar
- **NFR-010:** User must be able to delete all their data permanently
- **NFR-011:** Default privacy setting is private (no public sharing)
- **NFR-012:** Comply with GDPR and major privacy regulations

### Reliability

- **NFR-013:** System uptime must be 99.5% or higher
- **NFR-014:** Data backup must occur automatically every 24 hours minimum
- **NFR-015:** App must handle network interruptions gracefully (offline mode)

### Usability

- **NFR-016:** App must be usable without tutorial for 80% of target users
- **NFR-017:** Core user flow (create pin) must require no more than 3 taps
- **NFR-018:** App must support iOS 15+ and Android 11+
- **NFR-019:** App must be accessible (WCAG 2.1 Level AA compliance target)

### Localization

- **NFR-020:** Initial launch in Spanish and English
- **NFR-021:** Architecture must support addition of new languages without code changes

---

## User Journeys

### Journey 1: First-Time User Onboarding

**Actor:** New User (Sarah)  
**Goal:** Create first memory pin  
**Precondition:** App installed, account created

**Flow:**
1. Sarah opens Atlas Personal for the first time
2. She sees a brief welcome screen explaining the concept (30 seconds max)
3. She's presented with the world map, mostly covered in fog
4. A subtle tooltip suggests "Tap anywhere to create your first memory"
5. Sarah taps on her current location
6. A pin creation form appears with camera/photo gallery option
7. She selects a recent photo from her gallery
8. She adds title: "My favorite café"
9. She selects category: "Food & Drink"
10. She adds note: "Best cortado in the city"
11. She taps "Save Pin"
12. The fog clears in her immediate area, revealing the map
13. She sees a celebration animation and her first pin
14. A tooltip shows: "Create more pins to reveal the world"

**Expected Outcome:** User creates first pin successfully and understands core mechanic

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
10. He taps "Done"
11. He can now filter map view to show only this collection
12. He sees a route-like visualization connecting the café pins

**Expected Outcome:** User creates meaningful collection and sees thematic grouping

---

### Journey 3: Upgrading to Pro

**Actor:** Free Tier User (Ana)  
**Goal:** Upgrade to Atlas Pro subscription  
**Precondition:** User has reached 95/100 pin limit

**Flow:**
1. Ana attempts to create her 96th pin
2. A modal appears: "You have 4 pins remaining in your free tier"
3. Options presented: "Upgrade to Pro" or "Continue"
4. She selects "Upgrade to Pro"
5. She sees the Pro benefits screen:
   - Unlimited pins & collections
   - Premium map styles
   - Custom pin icons
   - Export features
   - Price: $X/year
6. She taps "Subscribe Now"
7. iOS payment sheet appears
8. She authenticates with Face ID
9. Purchase completes
10. Celebration animation: "Welcome to Atlas Pro!"
11. She's returned to pin creation, now with unlimited access

**Expected Outcome:** Seamless upgrade flow with clear value proposition

---

### Journey 4: Rediscovering Old Memories

**Actor:** Long-term User (Carlos)  
**Goal:** Browse memories from a past trip  
**Precondition:** User has 200+ pins, including 30 from a trip to Italy

**Flow:**
1. Carlos opens the app feeling nostalgic
2. He zooms into Italy on the map
3. He sees multiple pins across Rome, Florence, Venice
4. He taps a pin showing the Colosseum
5. The pin detail view opens with his photo and note
6. He smiles reading his note from 2 years ago
7. He swipes left to see the next nearby pin (Trevi Fountain)
8. He continues browsing pins in sequence
9. He remembers he created an "Italy 2023" collection
10. He switches to Collections tab and selects it
11. He sees all 30 pins highlighted, telling the story of his trip

**Expected Outcome:** User emotionally reconnects with past experiences

---

## Technical Architecture (High-Level)

### Technology Stack (Recommended)

**Mobile App:**
- **Framework:** React Native (cross-platform iOS/Android) OR Swift/SwiftUI for iOS, Kotlin for Android
- **Map Library:** Mapbox or Google Maps SDK
- **State Management:** Redux or MobX
- **Local Storage:** SQLite or Realm for offline capability
- **Image Handling:** React Native Image Picker or native photo libraries

**Backend:**
- **API:** Node.js with Express OR Python with FastAPI
- **Database:** PostgreSQL with PostGIS extension for geospatial data
- **File Storage:** AWS S3 or Google Cloud Storage for photos/videos
- **Authentication:** Firebase Auth or Auth0
- **Cloud Infrastructure:** AWS or Google Cloud Platform

**Additional Services:**
- **Push Notifications:** Firebase Cloud Messaging
- **Analytics:** Mixpanel or Amplitude
- **Payment Processing:** RevenueCat or Stripe
- **Crash Reporting:** Sentry or Crashlytics

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

**Price Point:** $19.99-$29.99/year (market research required)

**Premium Features:**
- Unlimited pins and collections
- Premium map styles (vintage, dark mode, watercolor, minimalist)
- Custom pin icons (thematic icon packs)
- High-quality map exports (print-ready)
- Export individual collections as beautiful posters
- Collaborative collections (share with friends/family)
- Priority customer support
- Early access to new features

**Revenue Projections:**
- Target conversion rate: 5-8% free to paid
- Customer Lifetime Value (LTV) target: 3-5 years average retention

---

## Open Questions & Assumptions

### Open Questions

1. **Q1:** Should we support video pins in MVP or defer to v1.1?
   - **Impact:** High - affects data storage costs and technical complexity
   - **Decision needed by:** Before technical architecture finalization

2. **Q2:** What is the optimal fog clearing radius?
   - **Impact:** Medium - affects gamification engagement
   - **Recommendation:** A/B test with beta users

3. **Q3:** Should collections be chronological by default or manually ordered?
   - **Impact:** Low - UI/UX decision
   - **Recommendation:** User research with prototypes

4. **Q4:** iOS-first or cross-platform from start?
   - **Impact:** High - affects development timeline and costs
   - **Recommendation:** Market analysis of target demographic platform preferences

5. **Q5:** How to handle pins in the same exact location?
   - **Impact:** Medium - technical and UX challenge
   - **Recommendation:** Stack pins or slight auto-offset with clustering

### Assumptions

1. **A1:** Users primarily use smartphones to create pins (mobile-first is correct strategy)
2. **A2:** Target users value privacy over social features (validation through user interviews recommended)
3. **A3:** Annual subscription model is preferable to monthly for this use case (assumption: users think long-term about memories)
4. **A4:** Photo/video storage costs can be sustained by subscription revenue (requires cost modeling)
5. **A5:** Users have basic familiarity with map interfaces (minimal training needed)
6. **A6:** GPS accuracy in photos is sufficient for automatic pin placement (may need manual adjustment option)
7. **A7:** Market exists for premium personal memory app (competitor analysis supports this)

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

### Go/No-Go Criteria

**Proceed to v1.1 if:** Core metrics above are met or show strong trajectory  
**Pivot if:** Engagement metrics below 15% DAU/MAU despite iterations  
**Sunset if:** No product-market fit evidence after 6 months and multiple pivots

---

## Risks & Mitigation

### High Priority Risks

| Risk | Impact | Probability | Mitigation Strategy |
|------|--------|-------------|---------------------|
| Storage costs exceed revenue | High | Medium | Implement aggressive image compression; set file size limits; monitor unit economics closely |
| Low free-to-paid conversion | High | Medium | A/B test paywalls; offer trial period; improve onboarding to demonstrate value |
| User privacy concerns | High | Low | Clear privacy policy; no social features in MVP; transparent data usage; GDPR compliance |
| Competitor launches similar product | Medium | Medium | Speed to market; focus on superior UX; build strong early community |
| Map API costs too high | Medium | Low | Negotiate volume pricing; consider open-source alternatives (OpenStreetMap); cache aggressively |

---

## Timeline & Milestones (Preliminary)

This timeline assumes a team of 4-5 people (2 mobile devs, 1 backend dev, 1 designer, 1 PM).

**Phase 1: Foundation (Weeks 1-4)**
- Week 1-2: Technical architecture finalization, design system creation
- Week 3-4: Basic app scaffold, authentication, map integration

**Phase 2: Core Features (Weeks 5-10)**
- Week 5-6: Pin creation and management
- Week 7-8: Fog of war implementation
- Week 9-10: Collections feature

**Phase 3: Premium Features (Weeks 11-12)**
- Week 11: Subscription integration
- Week 12: Free tier limitations enforcement

**Phase 4: Polish & Testing (Weeks 13-14)**
- Week 13: Bug fixes, performance optimization
- Week 14: Beta testing, final QA

**Phase 5: Launch (Week 15)**
- Week 15: App Store submission, soft launch

**Target MVP Launch:** 15 weeks (~3.5 months) from kickoff

---

## Appendix

### Pin Categories (Initial Set)

1. Food & Drink
2. Adventure & Outdoor
3. Culture & Art
4. Family & Friends
5. Personal Milestone
6. Work & Professional
7. Nature & Landscapes
8. Urban Exploration

### Competitive Landscape

**Direct Competitors:**
- None identified with exact feature set (opportunity!)

**Indirect Competitors:**
- Google Maps (saved places, but no storytelling)
- Day One (journaling, but not geo-centric)
- Polarsteps (travel tracking, but trip-focused, not life-focused)
- Instagram (public, not private or organized)

**Differentiation:**
- Private-first (vs Instagram)
- Life-long narrative (vs trip-focused apps)
- Gamification (vs boring pins on maps)
- Beautiful, intentional design (vs utilitarian saved places)

---

**Document End**

*Next Step: Verification using prompt 02-verify-prd.prompt.md*
