**中文** | [English](README.md)

# CYAN Seed Company — Admin Dashboard

管理玉米育種、國際種子銷售、行銷內容與社群通路的一站式後台系統。

基於 [Studio Admin](https://github.com/arhamkhnz/next-shadcn-admin-dashboard) 模板開發。

## 模組

### 儀表板
- **CYAN Seeds** — 育種 + 銷售總覽（KPI、品種排行、市場分布、育種管線、庫存警示）
- **Marketing** — 跨平台行銷總覽（互動趨勢、通路比較、內容類型分析、Top Posts）

### 育種與銷售
- **Varieties** — 品種管理（品系代碼、性狀、世代、成熟期、產量潛力）
- **Inventory** — 庫存管理（批號、倉庫、發芽率、純度、水分）
- **Orders** — 訂單管理（客戶、品種、出口港、付款狀態）
- **Customers** — 客戶 CRM（國際買家、分級、累計營收、區域）

### 內容與行銷
- **Content Hub** — 素材庫（影片/圖片/文案，跨通路發布）
- **Campaigns** — 行銷活動（預算追蹤、觸及、轉換率）
- **Broadcasts** — LINE 推播管理（排程、受眾、開封率、點擊率）

### 通路
- **Overview** — 跨平台統一儀表板（LINE/FB/IG 粉絲成長趨勢）
- **LINE** — 好友、開封率、點擊率、自動回覆
- **Facebook** — 粉專觸及（Organic vs Paid）、廣告成本
- **Instagram** — Reels/Posts/Stories 表現分析

### 系統
- 驗證（Login/Register v1 & v2）
- 角色、設定、排程、任務（規劃中）

## 技術棧

- **框架**: Next.js 16 (App Router), TypeScript, React 19
- **樣式**: Tailwind CSS v4, shadcn/ui (Radix UI)
- **圖表**: Recharts
- **表格**: TanStack Table + @dnd-kit
- **狀態管理**: Zustand
- **表單**: React Hook Form + Zod
- **程式碼品質**: Biome, Husky + lint-staged

## 快速開始

```bash
git clone https://github.com/cyansprime/CYAN_admin_dashboard.git
cd CYAN_admin_dashboard
git checkout dev
npm install
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) → 自動導向 `/dashboard/cyan`

## 更新紀錄

### CYAN 自訂改動（`dev` branch）

- **Broadcasts × Flask API** — 廣播頁面串接 CYAN Bot Flask API，即時拉取廣播資料、頻道列表
- **廣播健康監控** — 新增 BroadcastHealthCard，顯示成功率、失敗數等指標
- **廣播審批流程** — 新增 PendingApprovalCard，支援核准/拒絕待發送廣播
- **節氣農諺卡片** — Content Hub 加入台灣農曆節氣與諺語顯示
- **諺語 × 廣播企劃** — 將諺語庫連接至 Content Hub 作為推播素材來源
- **React Query 整合** — 加入 `@tanstack/react-query` provider 與 API client 基礎建設

### Upstream 更新（`arhamkhnz/next-shadcn-admin-dashboard`）

- **shadcn/ui 升級** — 更新至 radix-vega 風格，base color 改為 mist
- **表格重構** — Data table 從共用元件改為各 dashboard 本地化實作
- **表單重構** — Auth 頁面改用 field-based React Hook Form
- **Sidebar 改進** — 新增 support footer card、layout control 對齊修正
- **Header** — 加入 GitHub 快捷連結
- **Dashboard 修正** — Command palette、select 分組、owner names 更新

## Git 策略

- `main` — 保持與上游同步
- `dev` — 所有 CYAN 自訂開發
- `upstream` — [arhamkhnz/next-shadcn-admin-dashboard](https://github.com/arhamkhnz/next-shadcn-admin-dashboard)

```bash
# 同步上游更新
git fetch upstream
git checkout main
git merge upstream/main
git checkout dev
git merge main
```

## 指令

| 指令 | 說明 |
|------|------|
| `npm run dev` | 開發伺服器 |
| `npm run build` | 正式版建置 |
| `npm run check:fix` | Biome lint + format |
| `npm run generate:presets` | 產生主題 CSS |

---

基於 [Studio Admin](https://github.com/arhamkhnz/next-shadcn-admin-dashboard)，由 [@arhamkhnz](https://github.com/arhamkhnz) 開發。
