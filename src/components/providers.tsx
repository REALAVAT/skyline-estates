"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { DirectionProvider } from "@base-ui/react/direction-provider";

const Toaster = dynamic(() => import("@/components/ui/sonner").then((mod) => mod.Toaster), { ssr: false });

export function Providers({ children, dir }: { children: ReactNode; dir: "ltr" | "rtl" }) {
  return (
    <DirectionProvider direction={dir}>
      {children}
      <Toaster position={dir === "rtl" ? "bottom-left" : "bottom-right"} dir={dir} closeButton={false} />
    </DirectionProvider>
  );
}
