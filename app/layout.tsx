import type { Metadata } from 'next';
import './globals.css';
import { GlobalStateProvider } from '@/app/context/GlobalStateContext';
import Header from '@/app/components/Header';

export const metadata: Metadata = {
    title: 'TrioLingo - Learn Languages',
    description: 'Learn new languages with TrioLingo!',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 font-sans">
                <GlobalStateProvider>
                    <Header />
                    <main className="max-w-2xl mx-auto px-4 py-8">
                        {children}
                    </main>
                    <footer className="text-center py-8 text-white/80">
                        <p className="text-sm">
                            Built with ❤️ by{ }
                            <a href="https://github.com/isaaclins" className="text-white/80 hover:text-white underline">
                                Isaac Lins
                            </a>
                        </p>
                    </footer>
                </GlobalStateProvider>
            </body>
        </html>
    );
}
