import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/components/theme-provider";
import { ScoreProvider } from "@/app/context/ScoreContext";
import { GlobalStateProvider } from '@/app/context/GlobalStateContext';
import Header from '@/app/components/Header';
import { Metadata } from 'next';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "TrioLingo - Learn Languages",
    description: "The best app to learn new languages",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 font-sans`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <GlobalStateProvider>
                        <ScoreProvider>
                            <Header />
                            <main className="max-w-2xl mx-auto px-4 py-8">
                                {children}
                            </main>
                            <footer className="text-center py-8 text-white/80">
                                <p className="text-sm">
                                    Built with ❤️ by {' '}
                                    <a href="https://github.com/isaaclins" className="text-white/80 hover:text-white underline">
                                        Isaac Lins
                                    </a>
                                </p>
                            </footer>
                        </ScoreProvider>
                    </GlobalStateProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
