import { Geist, Geist_Mono, Onest } from 'next/font/google';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

const onest = Onest({
    variable: "--font-onest",
    subsets: ["latin"],
})

export { geistSans, geistMono, onest };