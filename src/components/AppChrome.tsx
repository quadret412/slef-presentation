"use client";

import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { SectionSparks } from "./SectionSparks";
import { SectionNavProvider } from "./section-nav";
import { ThemeProvider } from "./ThemeProvider";

export function AppChrome({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SectionNavProvider>
        <Nav />
        <SectionSparks />
        {children}
      </SectionNavProvider>
    </ThemeProvider>
  );
}
