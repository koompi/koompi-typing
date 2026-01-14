# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run preview      # Preview production build
```

## Environment Setup

Create `.env.local` with your Gemini API key:
```
GEMINI_API_KEY=your_key_here
```

The app works offline with fallback text data when the API is unavailable.

## Architecture Overview

This is a bilingual (Khmer/English) typing practice app built with React 19, Vite, and Tailwind CSS v4.

### Core Application Flow

**App.tsx** is the main orchestrator containing:
- Game state management (mode, stats, input handling)
- Three game modes: `menu`, `practice`, `challenge-play`, `adventure`
- IME composition handling critical for Khmer input on Linux (IBus/Fcitx)
- Real-time WPM/accuracy calculation

### Key Subsystems

**Khmer Input Handling** (`hooks/useKhmerInput.ts`)
- Handles IME composition events for proper Khmer character input
- `normalizeKhmerText()` - Essential for text comparison; removes Zero Width Space (U+200B), applies NFC normalization
- Platform detection for Linux-specific IME handling

**Text Generation** (`services/geminiService.ts`)
- Uses Gemini API (`gemini-3-flash-preview`) for dynamic practice text
- Falls back to `OFFLINE_DATA` when offline or API fails
- Important: Strips Zero Width Space from generated Khmer text

**Level System** (`utils/levels.ts`)
- 150 levels across 15 units (10 levels each)
- Unit 1 (levels 0-9): Keyboard drills generated from `KEYBOARD_LAYOUT`
- Units 2-15: Content from `OFFLINE_LEVEL_CONTENT` database
- `getLevelData()` returns text and criteria (minWpm, minAccuracy)

**Keyboard Layout** (`utils/keyboardData.ts`)
- `KEYBOARD_LAYOUT` defines the NiDA Khmer keyboard standard
- Each key has: code, en/km normal+shift characters, finger mapping
- Used for virtual keyboard display and finger guide highlighting

**Persistence** (`services/storageService.ts`)
- localStorage-based: leaderboard, per-language level progress, XP, streak
- Keys prefixed with `typemaster_`

### Component Responsibilities

- `MainMenu.tsx` - Mode selection, level grid, challenge cards
- `TypingGame.tsx` - Game UI (if separated from App.tsx)
- `VirtualKeyboard.tsx` - Visual keyboard with key highlighting
- `FingerGuide.tsx` - SVG hand visualization showing which finger to use
- `ResultsModal.tsx` - Post-game stats display

### Bilingual Support

- UI translations in `UI_TEXT` object (App.tsx) with `en` and `km` keys
- `Language` type: `'en' | 'km'`
- Khmer font applied via `font-khmer` class when `lang === 'km'`

### Type Definitions (`types.ts`)

Key types: `Language`, `Finger`, `KeyData`, `GameStats`, `Challenge`, `Difficulty`
