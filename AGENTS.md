# AGENTS.md

## Cursor Cloud specific instructions

This is a **xiuxian (修仙) idle/incremental mobile game** built with React + TypeScript + Vite + React Three Fiber.

### Tech Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **3D Rendering**: React Three Fiber + Drei (Three.js)
- **State Management**: Zustand
- **Target**: Mobile-first web game (PWA-ready)

### Key Commands
- `npm run dev` - Start dev server (port 5173, binds to 0.0.0.0)
- `npm run build` - TypeScript check + production build
- `npm run lint` - ESLint check
- `npm run preview` - Preview production build

### Architecture
- `src/game/store.ts` - Zustand game state with idle loop logic (cultivation tick, battle tick)
- `src/game/constants.ts` - Game data (realms, monsters, base stats)
- `src/types/game.ts` - TypeScript type definitions
- `src/components/scene/` - 3D scene components (CultivationScene, BattleScene)
- `src/components/ui/` - UI panel components (mobile-first)

### Non-obvious Notes
- The 3D `Text` component from `@react-three/drei` uses troika-three-text internally; do not specify a custom font path unless the font file is actually provided.
- The game loop runs via `setInterval` in `App.tsx`: cultivation ticks every 1s, battle ticks every 1.5s.
- The game state is entirely in-memory (no persistence yet); refreshing the page resets all progress.
- WebGL rendering in headless/CI environments may show a black 3D scene area - this is expected; the game logic still runs correctly.
