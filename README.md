[中文版](README.zh-TW.md) | **English**

# CYAN Seed Company — Admin Dashboard

An all-in-one back-office system for managing corn breeding, international seed sales, marketing content, and social media channels.

Built on [Studio Admin](https://github.com/arhamkhnz/next-shadcn-admin-dashboard).

## Modules

### Dashboards
- **CYAN Seeds** — Breeding + sales overview (KPIs, variety rankings, market distribution, breeding pipeline, inventory alerts)
- **Marketing** — Cross-platform marketing overview (engagement trends, channel comparison, content type analysis, top posts)

### Breeding & Sales
- **Varieties** — Variety management (line codes, traits, generations, maturity, yield potential)
- **Inventory** — Inventory management (lot numbers, warehouses, germination rate, purity, moisture)
- **Orders** — Order management (customers, varieties, export ports, payment status)
- **Customers** — Customer CRM (international buyers, tiers, cumulative revenue, regions)

### Content & Marketing
- **Content Hub** — Asset library (video/image/copy, cross-channel publishing)
- **Campaigns** — Marketing campaigns (budget tracking, reach, conversion rate)
- **Broadcasts** — LINE broadcast management (scheduling, audience, open rate, click rate)

### Channels
- **Overview** — Unified cross-platform dashboard (LINE/FB/IG follower growth trends)
- **LINE** — Friends, open rate, click rate, auto-replies
- **Facebook** — Page reach (organic vs paid), ad costs
- **Instagram** — Reels/Posts/Stories performance analysis

### System
- Authentication (Login/Register v1 & v2)
- Roles, Settings, Scheduling, Tasks (planned)

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript, React 19
- **Styling**: Tailwind CSS v4, shadcn/ui (Radix UI)
- **Charts**: Recharts
- **Tables**: TanStack Table + @dnd-kit
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **Linting**: Biome, Husky + lint-staged

## Getting Started

```bash
git clone https://github.com/cyansprime/CYAN_admin_dashboard.git
cd CYAN_admin_dashboard
git checkout dev
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → redirects to `/dashboard/cyan`

## Changelog

### CYAN Custom Changes (`dev` branch)

- **Broadcasts x Flask API** — Connect broadcasts page to CYAN Bot Flask API for real-time broadcast data and channel lists
- **Broadcast Health Monitor** — New BroadcastHealthCard showing success rate, failure count, and other metrics
- **Broadcast Approval Workflow** — New PendingApprovalCard for approving/rejecting pending broadcasts
- **Solar Terms & Proverbs Card** — Content Hub now displays Taiwanese lunar solar terms and agricultural proverbs
- **Proverbs x Broadcast Planning** — Connect proverb library to Content Hub as broadcast content source
- **React Query Integration** — Added `@tanstack/react-query` provider and API client infrastructure

### Upstream Updates (`arhamkhnz/next-shadcn-admin-dashboard`)

- **shadcn/ui Upgrade** — Updated to radix-vega style, base color changed to mist
- **Table Refactor** — Data tables moved from shared components to localized per-dashboard implementations
- **Form Refactor** — Auth pages adopted field-based React Hook Form
- **Sidebar Improvements** — Added support footer card, layout control alignment fixes
- **Header** — Added GitHub shortcut link
- **Dashboard Fixes** — Command palette, select grouping, owner name updates

## Git Strategy

- `main` — Stays in sync with upstream
- `dev` — All CYAN custom development
- `upstream` — [arhamkhnz/next-shadcn-admin-dashboard](https://github.com/arhamkhnz/next-shadcn-admin-dashboard)

```bash
# Sync upstream updates
git fetch upstream
git checkout main
git merge upstream/main
git checkout dev
git merge main
```

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run check:fix` | Biome lint + format |
| `npm run generate:presets` | Generate theme CSS |

---

Based on [Studio Admin](https://github.com/arhamkhnz/next-shadcn-admin-dashboard) by [@arhamkhnz](https://github.com/arhamkhnz).
