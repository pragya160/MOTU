# MOTU — Motivation Tracking & Recovery Unit

> A NASA command center, a futuristic AI system, a spiritual guru, an RPG and a
> productivity tracker walked into a browser — to solve one question nobody asked:
> **"Where did my motivation go?"**

MOTU is an intentionally useless, gloriously over-engineered web app built for a
**Useless UI competition**. It treats a completely meaningless problem as if it were
a critical scientific, spiritual, military and satellite-tracking emergency.

The goal is not usefulness. The goal is insanely good UI, an absurd concept, fun
interactions and a memorable personality.

---

## Features

- **Boot sequence & login** — dramatic system initialization for absolutely no reason
- **MOTU Baba** — a resident guru who comments on everything and has his own chat
  where you can talk things out (separate conversations, saved in your browser)
- **Dashboard** — live motivation core, system status and useless vital signs
- **Locate & Scanner** — scan for your missing motivation, file a case file report
  nobody will ever read
- **Map & Globe** — animated satellite tracking of motivation sightings worldwide
- **Missions** — absurd quests that award very serious points
- **Character & Skins** — your avatar, its moods and unlockable looks
- **Friends** — add friends by username, watch motivation collisions animate
- **Donation** — donate spare motivation to those in need (nobody receives it)
- **Journal** — log your excuses for posterity
- **Analytics** — simplified charts, forecasts and an official Uselessness Score
- **Achievements & Store** — gamified nonsense, purchasable with points
- **Reel Multitasking** — scroll reels on a phone, tablet and laptop simultaneously
- **Baba alerts & reminders** — notifications delivered from the top of the screen
- **Light & dark mode** — because the void deserves options

---

## Tech

- **React 19** + **TanStack Start** (TanStack Router, file-based routes)
- **Vite 7** for builds
- **Tailwind CSS v4** with a custom semantic token design system
- Hand-rolled SVG characters, charts and animations — no chart library
- **Frontend-only**: all state lives in `localStorage`, all data is mock data.
  No backend, no accounts, no tracking, nothing to deploy but static files.

---

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL. To build:

```bash
npm run build
```

---

## Project structure

```
src/
  routes/               file-based pages (dashboard, locate, map, missions, ...)
  components/motu/      Baba, motivation core, character, shared shell pieces
  components/ui/        base UI primitives
  lib/motu/             mock data + local store/provider
  styles.css            design tokens, theme and animations
```

---

## Disclaimer

MOTU does not find, recover, restore or improve your motivation in any way.
Any resemblance to a productive tool is purely accidental and deeply regretted.
