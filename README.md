# CYAN Seed Company — Admin Dashboard

管理玉米育種、國際種子銷售、行銷內容與社群通路的一站式後台系統。

基於 [Studio Admin](https://github.com/arhamkhnz/next-shadcn-admin-dashboard) 模板開發。

## Modules

### Dashboards
- **CYAN Seeds** — 育種 + 銷售總覽（KPI、品種排行、市場分布、育種管線、庫存警示）
- **Marketing** — 跨平台行銷總覽（互動趨勢、通路比較、內容類型分析、Top Posts）

### Breeding & Sales
- **Varieties** — 品種管理（品系代碼、性狀、世代、成熟期、產量潛力）
- **Inventory** — 庫存管理（批號、倉庫、發芽率、純度、水分）
- **Orders** — 訂單管理（客戶、品種、出口港、付款狀態）
- **Customers** — 客戶 CRM（國際買家、分級、累計營收、區域）

### Content & Marketing
- **Content Hub** — 素材庫（影片/圖片/文案，跨通路發布）
- **Campaigns** — 行銷活動（預算追蹤、觸及、轉換率）
- **Broadcasts** — LINE 推播管理（排程、受眾、開封率、點擊率）

### Channels
- **Overview** — 跨平台統一儀表板（LINE/FB/IG 粉絲成長趨勢）
- **LINE** — 好友、開封率、點擊率、自動回覆
- **Facebook** — 粉專觸及（Organic vs Paid）、廣告成本
- **Instagram** — Reels/Posts/Stories 表現分析

### System
- Authentication（Login/Register v1 & v2）
- Roles, Settings, Scheduling, Tasks（planned）

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
git clone https://github.com/cyansprime/next-shadcn-admin-dashboard.git
cd next-shadcn-admin-dashboard
git checkout dev
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) → redirects to `/dashboard/cyan`

## Git Strategy

- `main` — 保持與上游同步
- `dev` — 所有 CYAN 自訂開發
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
