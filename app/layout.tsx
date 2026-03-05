import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from './Providers';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'TrelloClone',
	description: 'Half-term programming project',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen flex flex-col`}>
				<Providers>
					<Header />
					<div className="flex flex-1 overflow-hidden">
						<Sidebar />
						<main className="flex-1 overflow-y-auto bg-blue-600 p-6">
							{children}
						</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}
