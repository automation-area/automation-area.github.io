import type { ReactNode } from "react";
import { toolMetadata } from "@/lib/tools";

export const metadata = toolMetadata("uuid-generator");

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
