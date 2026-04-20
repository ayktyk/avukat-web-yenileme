import type { LucideIcon } from "lucide-react";

export type CalculatorStatus = "active" | "coming-soon";

export type CalculatorMeta = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  status: CalculatorStatus;
  keywords: string[];
};
