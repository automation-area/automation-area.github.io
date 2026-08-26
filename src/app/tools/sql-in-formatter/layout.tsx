import type { ReactNode } from "react";
import { toolMetadata } from "@/lib/tools";

export const metadata = toolMetadata("sql-in-formatter");

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
