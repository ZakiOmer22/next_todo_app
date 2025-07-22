'use client';
import React from 'react';
import { ThemeProvider } from 'next-themes';
import { SupabaseProvider } from './SupabaseProvider';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <SupabaseProvider client={supabase}>
        {children}
      </SupabaseProvider>
    </ThemeProvider>
  );
}
