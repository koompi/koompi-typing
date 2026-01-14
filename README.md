<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# KOOMPI TYPING

Master Khmer & English typing through gamified adventures. Build your streak and level up!

## Features

- 🎮 **Gamified Learning** - 150 levels across 15 units with XP and streaks
- 🇰🇭 **Khmer Support** - Full NiDA keyboard layout with IME support for Linux
- 🌐 **Bilingual** - Switch between Khmer and English
- 📱 **PWA Ready** - Install as an app on any device
- 🔌 **Offline Mode** - Works without internet connection

## Run Locally

**Prerequisites:** [Bun](https://bun.sh) (recommended) or Node.js

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Environment Variables

Create a `.env.local` file for optional AI-powered text generation:

```bash
GEMINI_API_KEY=your_api_key_here
```

> **Note:** The app works fully offline without an API key using built-in typing content.

## Tech Stack

- ⚛️ React 19 + TypeScript
- 🎨 Tailwind CSS v4
- ⚡ Vite
- 🤖 Google Gemini (optional, for AI-generated practice texts)

## License

MIT © KOOMPI
