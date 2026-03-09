# Studio Admin — Next.js + shadcn/ui Admin Dashboard Template

## Stack

- **Runtime**: Node.js, React 19, Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4, `tw-animate-css`
- **UI**: shadcn/ui (Radix UI), Lucide icons, Sonner toasts
- **State**: Zustand (preferences store via React Context)
- **Data**: @tanstack/react-table, @tanstack/react-query, Recharts
- **Forms**: React Hook Form + Zod
- **DnD**: @dnd-kit (sortable rows in data tables)
- **Linting**: Biome (lint + format), Husky + lint-staged pre-commit
- **Compiler**: React Compiler enabled (`babel-plugin-react-compiler`)

## Architecture

```
src/
├── app/
│   ├── layout.tsx              Root layout (theme boot, preferences provider)
│   ├── (external)/page.tsx     Redirects `/` → `/dashboard/default`
│   └── (main)/
│       ├── auth/v1|v2/         Login/Register pages (two variants)
│       ├── dashboard/
│       │   ├── default/        Data table demo
│       │   ├── crm/            CRM dashboard
│       │   ├── finance/        Finance KPIs + charts
│       │   ├── analytics/      Analytics dashboard
│       │   ├── coming-soon/    Placeholder for future pages
│       │   └── _components/    Sidebar, theme switcher, layout controls
│       └── unauthorized/
├── components/
│   ├── ui/                     shadcn/ui primitives (40+ components)
│   └── data-table/             DataTable + DnD, pagination, column header
├── config/app-config.ts        App name, version, meta
├── data/users.ts               Mock data
├── hooks/                      use-mobile, use-data-table-instance
├── lib/
│   ├── utils.ts                cn(), getInitials(), formatCurrency()
│   ├── cookie.client.ts        Client cookie helpers (7-day expiry)
│   ├── local-storage.client.ts Safe localStorage wrappers
│   ├── fonts/registry.ts       18 font definitions with CSS variables
│   └── preferences/            Theme/layout config, persistence, DOM sync
├── navigation/sidebar/         Sidebar nav items definition
├── scripts/
│   ├── theme-boot.tsx          Pre-hydration theme loader (runs in <head>)
│   └── generate-theme-presets.ts
├── server/server-actions.ts    Cookie server actions
├── stores/preferences/         Zustand store + React Context provider
└── styles/presets/             Theme CSS files (brutalist, soft-pop, tangerine)
```

## Key Patterns

### Preferences System
1. Root layout sets defaults via HTML `data-*` attributes
2. `ThemeBootScript` runs synchronously in `<head>` — reads cookies/localStorage, applies theme before hydration (no flicker)
3. `PreferencesStoreProvider` syncs DOM state → Zustand store on mount
4. Changes persist via `persistPreference()` → cookie or localStorage
5. Theme mode transitions use fade-out/fade-in to prevent flash

### HTML Data Attributes (theming)
```html
<html data-theme-mode="light|dark|system"
      data-theme-preset="default|brutalist|soft-pop|tangerine"
      data-content-layout="centered|full-width"
      data-navbar-style="sticky|scroll"
      data-sidebar-variant="sidebar|inset|floating"
      data-sidebar-collapsible="icon|offcanvas"
      data-font="inter|geist|..."
      class="dark">
```

### Theme Presets
4 presets with oklch colors, each with light/dark variants:
- **default** — Modern blue
- **brutalist** — Sharp orange, 0px radius
- **soft-pop** — Soft purple pastels
- **tangerine** — Warm orange

### Data Table
- @tanstack/react-table + @dnd-kit for drag-and-drop row reordering
- `useDataTableInstance()` hook wraps table creation with defaults
- `withDndColumn()` helper adds drag handle column

### Navigation
3 sidebar groups: Dashboards, Pages, Misc. Items support `subItems`, `comingSoon`, `isNew` flags.

## Coding Rules

- **Formatter**: Biome — 2-space indent, 120 char width, double quotes, trailing commas
- **Imports**: Organized by groups — react → next → packages → `@/` aliases → relative
- **Tailwind**: Class sorting enforced by Biome
- **Path alias**: `@/*` → `./src/*`
- **Components**: Page-level components in `_components/` subdirs; shared in `src/components/`
- **shadcn/ui files** (`src/components/ui/`) are excluded from linting
- **Storage**: Layout-critical prefs use cookies (SSR); others can use localStorage
- **Console**: Stripped in production (`removeConsole: true`)
- **File suffix**: `.client.ts` for client-only utility modules

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Biome lint |
| `npm run format` | Biome format (write) |
| `npm run check` | Biome check (lint + format) |
| `npm run check:fix` | Biome check with auto-fix |
| `npm run generate:presets` | Generate theme preset CSS |

## Git Remotes

- `origin` — `cyansprime/next-shadcn-admin-dashboard` (fork, push target)
- `upstream` — `arhamkhnz/next-shadcn-admin-dashboard` (original repo)
- **Dev branch**: `dev` — all modifications here; `main` stays clean for upstream sync
