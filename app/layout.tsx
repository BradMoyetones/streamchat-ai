import type { Metadata } from 'next';
import { geistMono, geistSans, onest } from '@/lib/fonts';

import '@/styles/globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
    title: 'StreamChat AI',
    description: 'A chat interface powered by Stream and OpenAI.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn(geistSans.variable, geistMono.variable, onest.variable, 'font-onest antialiased dark:bg-background bg-muted')}>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
