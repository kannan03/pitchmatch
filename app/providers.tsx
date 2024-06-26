"use client";

import {
  SaasProvider,
  ModalsProvider,
  theme as baseTheme,
} from "@saas-ui/react";
import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    900: "#1a365d",
    800: "#1f2937",
    700: "#2a69ac",
    500: "#1f2937",
  },
};

const theme = extendTheme({ colors }, baseTheme);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SaasProvider theme={theme}>
      <ModalsProvider>{children}</ModalsProvider>
    </SaasProvider>
  );
}
