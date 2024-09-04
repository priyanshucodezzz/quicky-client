"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


interface ProvidersProps {
  children: React.ReactNode;
};



export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}