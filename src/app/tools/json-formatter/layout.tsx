import type { ReactNode } from "react";
import { toolMetadata } from "@/lib/tools";

export const metadata = toolMetadata("json-formatter");

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
