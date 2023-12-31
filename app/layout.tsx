import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import TanstackProvider from '@/components/providers/tanstack-provider';
import { Toaster } from 'react-hot-toast';
import ModalProvider from '@/components/providers/modal-provider';
import OauthProvider from '@/components/providers/oauth-provider';
import AuthProvider from '@/components/providers/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Mindnex',
    description: 'Quiz app',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='en'>
            <body className={inter.className}>
                <TanstackProvider>
                    <AuthProvider>
                        <OauthProvider>
                            <ModalProvider />
                            <Toaster position='top-right' />
                            {children}
                        </OauthProvider>
                    </AuthProvider>
                </TanstackProvider>
            </body>
        </html>
    );
}
