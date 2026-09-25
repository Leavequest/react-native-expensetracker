import React from 'react';
// Type-only: importing values from the package root would bundle all ~1,700 icons
import type { LucideIcon } from 'lucide-react-native';
// One import per icon keeps the bundle small (Metro doesn't tree-shake)
import Banknote from 'lucide-react-native/icons/banknote';
import Beef from 'lucide-react-native/icons/beef';
import Carrot from 'lucide-react-native/icons/carrot';
import ChartPie from 'lucide-react-native/icons/chart-pie';
import Check from 'lucide-react-native/icons/check';
import ChevronDown from 'lucide-react-native/icons/chevron-down';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import CircleCheck from 'lucide-react-native/icons/circle-check';
import Coffee from 'lucide-react-native/icons/coffee';
import CreditCard from 'lucide-react-native/icons/credit-card';
import Croissant from 'lucide-react-native/icons/croissant';
import Funnel from 'lucide-react-native/icons/funnel';
import House from 'lucide-react-native/icons/house';
import Info from 'lucide-react-native/icons/info';
import Lightbulb from 'lucide-react-native/icons/lightbulb';
import Link from 'lucide-react-native/icons/link';
import Milk from 'lucide-react-native/icons/milk';
import Package from 'lucide-react-native/icons/package';
import Pill from 'lucide-react-native/icons/pill';
import Plus from 'lucide-react-native/icons/plus';
import Receipt from 'lucide-react-native/icons/receipt';
import Settings from 'lucide-react-native/icons/settings';
import Share2 from 'lucide-react-native/icons/share-2';
import ShoppingBag from 'lucide-react-native/icons/shopping-bag';
import ShoppingCart from 'lucide-react-native/icons/shopping-cart';
import Smartphone from 'lucide-react-native/icons/smartphone';
import Snowflake from 'lucide-react-native/icons/snowflake';
import Sparkles from 'lucide-react-native/icons/sparkles';
import SprayCan from 'lucide-react-native/icons/spray-can';
import Store from 'lucide-react-native/icons/store';
import Ticket from 'lucide-react-native/icons/ticket';
import TramFront from 'lucide-react-native/icons/tram-front';
import Trash from 'lucide-react-native/icons/trash';
import TriangleAlert from 'lucide-react-native/icons/triangle-alert';
import User from 'lucide-react-native/icons/user';
import Users from 'lucide-react-native/icons/users';
import UtensilsCrossed from 'lucide-react-native/icons/utensils-crossed';
import Wallet from 'lucide-react-native/icons/wallet';
import Wheat from 'lucide-react-native/icons/wheat';
import X from 'lucide-react-native/icons/x';
import { THEME } from '../../constants';

const ICONS = {
  // General UI
  wallet: Wallet,
  cart: ShoppingCart,
  chart: ChartPie,
  settings: Settings,
  plus: Plus,
  check: Check,
  'check-circle': CircleCheck,
  trash: Trash,
  share: Share2,
  user: User,
  users: Users,
  'chevron-right': ChevronRight,
  'chevron-down': ChevronDown,
  close: X,
  filter: Funnel,
  store: Store,
  money: Banknote,
  card: CreditCard,
  receipt: Receipt,
  info: Info,
  link: Link,
  warning: TriangleAlert,
  // Expense categories
  home: House,
  bulb: Lightbulb,
  dining: UtensilsCrossed,
  transit: TramFront,
  health: Pill,
  ticket: Ticket,
  bag: ShoppingBag,
  sparkles: Sparkles,
  phone: Smartphone,
  // Grocery aisles
  produce: Carrot,
  dairy: Milk,
  meat: Beef,
  bakery: Croissant,
  pantry: Wheat,
  frozen: Snowflake,
  drinks: Coffee,
  cleaning: SprayCan,
  package: Package,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/** Vector icon from the Lucide set, addressed by an app-level name. */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 18,
  color = THEME.colors.textPrimary,
  strokeWidth = 2,
}) => {
  const Glyph = ICONS[name];
  return <Glyph size={size} color={color} strokeWidth={strokeWidth} />;
};
