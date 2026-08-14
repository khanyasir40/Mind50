# Mind40 — Premium Cognitive Training Platform

**Mind40** is a state-of-the-art cognitive training platform featuring 50 science-backed procedural game engines spanning 7 core cognitive domains: **Memory**, **Attention**, **Executive Function**, **Speed**, **Spatial Reasoning**, **Abstract Logic**, and **Mixed Fusion Workouts**.

Designed with rich glassmorphism aesthetics, dynamic dark/light theme switching, anti-cheat server scoring validation, real-time admin governance, and cross-platform native iOS & Android support via Capacitor.

---

## 🌟 Key Features

- 🧠 **50 Procedural Game Engines**: Infinite variation with seed-based challenge generation.
- 🎯 **7 Cognitive Domains**:
  - **Memory** (Digit Span Forward/Backward, Corsi Blocks, Spatial Span, Picture Scene, Avatar Name, Paired Associates, Object Location, Visual Pattern)
  - **Attention & Inhibition** (Stroop Sprint, Trail Making A/B, Go/No-Go, Eriksen Flanker, Simon Task, Visual Search, Cancellation, Continuous Performance, Multiple Object Tracking)
  - **Executive Function & Planning** (Wisconsin Card Sorting, Tower of Hanoi/London, Rule Switching, Dual Task, Category Sorting, Maze Planning, Planning Challenge, Serial Subtraction)
  - **Speed & Reaction** (Simple Reaction, Choice Reaction, Rapid Symbol, Number Parity, Shape Matching, Color Burst)
  - **Spatial Reasoning** (3D Mental Rotation, Block Design, Mirror Image, Spatial Matching, Map Navigation, Change Blindness)
  - **Abstract Logic & Reasoning** (Raven Matrix, Pattern Completion, Odd One Out, Logic Grid, Sequence Prediction, Abstract Reasoning)
  - **Mixed Fusion** (Hidden Object Search, Challenge Fusion Workout)
- 👑 **Admin Governance Console**: Real-time game engine parameter controls, user role management (Super Admin / Admin / Player), anti-cheat score audit logs, and live social media/contact link configuration.
- 📱 **Mobile Native & Responsive**: Full safe-area inset support (`viewport-fit=cover`) for iOS & Android devices.
- 🔒 **Data Isolation & 0-Score Start**: Per-user progress isolation where every new account starts fresh at Level 1, 0 XP, and 0 Skill Points.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 6
- **Styling**: Vanilla CSS, Design Tokens, Glassmorphism, Dark/Light Mode
- **Icons**: Lucide React
- **Mobile Native**: Capacitor 6 (Android & iOS)
- **Security & Validation**: SHA-256 Auth Hashing, PRNG Seed Verification, Server Scoring Anti-Cheat

---

## 🔑 Default Credentials

- **Super Admin Account**:
  - **Username**: `Yasir`
  - **Email**: `yasir@mind40.com`
  - **Password**: `691001`
- **Platform Admin Account**:
  - **Username**: `admin`
  - **Email**: `admin@mind40.com`
  - **Password**: `Admin123!`

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)
- Android SDK / JDK (for Android builds)

### Installation
```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run 50 game engine automated tests
npm run test
```

### Production Web Build & Mobile Sync
```bash
# Build production web bundle
npm run build

# Sync Capacitor assets for Android & iOS
npx cap sync
```

### Compile Android APK
```bash
cd android
./gradlew assembleDebug
```
The compiled APK will be output to `android/app/build/outputs/apk/debug/app-debug.apk` (copied to `Mind40-Yasir.apk` in project root).

---

## 📁 Project Structure

```
Mind50/
├── android/                   # Capacitor Android native project
├── ios/                       # Capacitor iOS native project
├── public/                    # Web assets & app icons (logo.png)
├── docs/
│   └── specifications/        # Product & technical specifications (00-25)
├── src/
│   ├── components/            # Reusable UI components & AppShell layout
│   ├── core/                  # AuthService, Auth security & design tokens
│   ├── data/                  # Storage engine & per-user state persistence
│   ├── features/              # Feature modules (admin, auth, creator, gameplay, games, home, profile, rank, settings, train)
│   ├── game_engine/           # 50 Game Engines, PRNG generator & Anti-Cheat Validator
│   ├── App.jsx                # App root component & view router
│   └── main.jsx               # Application entry point
├── Mind40-Yasir.apk           # Fresh compiled Android APK
├── capacitor.config.json      # Capacitor app configuration
├── vite.config.js             # Vite build configuration
└── package.json               # NPM scripts & dependencies
```

---

## 📄 License & Credits

Designed & Developed by **Yasir Khan**. Powered by **Mind40 Cognitive Engine**.