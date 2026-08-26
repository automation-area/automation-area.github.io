import type { ReactNode } from "react";
import { toolMetadata } from "@/lib/tools";

export const metadata = toolMetadata("base64-url");

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
