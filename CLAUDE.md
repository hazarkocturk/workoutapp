# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Stack

- **Next.js 16** with App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**

## Project Structure

- `src/app/` — App Router pages and layouts
- `src/app/layout.tsx` — Root layout
- `src/app/page.tsx` — Home page
- `src/app/globals.css` — Global styles (Tailwind entry point)
- `public/` — Static assets
