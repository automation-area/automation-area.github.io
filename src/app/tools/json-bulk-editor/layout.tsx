import type { ReactNode } from "react";
import { toolMetadata } from "@/lib/tools";

export const metadata = toolMetadata("json-bulk-editor");

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
