import {
  Banknote,
  Calendar,
  ChartBar,
  ClipboardList,
  Facebook,
  Fingerprint,
  Gauge,
  Globe,
  Instagram,
  LayoutDashboard,
  Lock,
  type LucideIcon,
  Megaphone,
  MessageCircle,
  Package,
  Rss,
  ShoppingCart,
  Sprout,
  SquareArrowUpRight,
  Users,
  Video,
  Wheat,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Dashboards",
    items: [
      {
        title: "CYAN Seeds",
        url: "/dashboard/cyan",
        icon: Sprout,
        isNew: true,
      },
      {
        title: "Marketing",
        url: "/dashboard/marketing",
        icon: Megaphone,
        isNew: true,
      },
      {
        title: "Default",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
      {
        title: "CRM",
        url: "/dashboard/crm",
        icon: ChartBar,
      },
      {
        title: "Finance",
        url: "/dashboard/finance",
        icon: Banknote,
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: Gauge,
      },
    ],
  },
  {
    id: 2,
    label: "Breeding & Sales",
    items: [
      {
        title: "Varieties",
        url: "/dashboard/varieties",
        icon: Wheat,
        isNew: true,
      },
      {
        title: "Inventory",
        url: "/dashboard/inventory",
        icon: Package,
        isNew: true,
      },
      {
        title: "Orders",
        url: "/dashboard/orders",
        icon: ShoppingCart,
        isNew: true,
      },
      {
        title: "Customers",
        url: "/dashboard/customers",
        icon: Users,
        isNew: true,
      },
    ],
  },
  {
    id: 3,
    label: "Content",
    items: [
      {
        title: "Content Hub",
        url: "/dashboard/content-hub",
        icon: Video,
        isNew: true,
      },
      {
        title: "Campaigns",
        url: "/dashboard/campaigns",
        icon: Megaphone,
        isNew: true,
      },
      {
        title: "Broadcasts",
        url: "/dashboard/broadcasts",
        icon: Rss,
        isNew: true,
      },
    ],
  },
  {
    id: 4,
    label: "Channels",
    items: [
      {
        title: "Overview",
        url: "/dashboard/channels",
        icon: Globe,
        isNew: true,
      },
      {
        title: "LINE",
        url: "/dashboard/channels/line",
        icon: MessageCircle,
        isNew: true,
      },
      {
        title: "Facebook",
        url: "/dashboard/channels/facebook",
        icon: Facebook,
        isNew: true,
      },
      {
        title: "Instagram",
        url: "/dashboard/channels/instagram",
        icon: Instagram,
        isNew: true,
      },
    ],
  },
  {
    id: 5,
    label: "System",
    items: [
      {
        title: "Authentication",
        url: "/auth",
        icon: Fingerprint,
        subItems: [
          { title: "Login v1", url: "/auth/v1/login", newTab: true },
          { title: "Login v2", url: "/auth/v2/login", newTab: true },
          { title: "Register v1", url: "/auth/v1/register", newTab: true },
          { title: "Register v2", url: "/auth/v2/register", newTab: true },
        ],
      },
      {
        title: "Roles",
        url: "/dashboard/coming-soon",
        icon: Lock,
        comingSoon: true,
      },
      {
        title: "Settings",
        url: "/dashboard/coming-soon",
        icon: SquareArrowUpRight,
        comingSoon: true,
      },
      {
        title: "Scheduling",
        url: "/dashboard/coming-soon",
        icon: Calendar,
        comingSoon: true,
      },
      {
        title: "Tasks",
        url: "/dashboard/coming-soon",
        icon: ClipboardList,
        comingSoon: true,
      },
    ],
  },
];
