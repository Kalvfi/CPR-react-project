'use client';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
	const { data: session } = useSession();

	return (
		<header className="h-12 border-b bg-white flex items-center justify-between px-4 shrink-0">
			<div className="flex items-center gap-4">
				<h1 className="font-bold text-xl text-blue-700 tracking-tight">
					TrelloClone
				</h1>
				<nav className="hidden md:flex gap-2">
					<button className="px-3 py-1 hover:bg-gray-100 rounded text-sm font-medium">
						Workspaces
					</button>
					<button className="px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium">
						Create
					</button>
				</nav>
			</div>

			<div className="flex items-center gap-3">
				{session ? (
					<div className="flex items-center gap-3">
						<span className="text-sm text-gray-600 hidden sm:block">
							{session.user?.email}
						</span>
						<button
							onClick={() => signOut()}
							className="px-3 py-1 text-sm border border-red-200 text-red-600 hover:bg-red-50 rounded">
							Sign out
						</button>
					</div>
				) : (
					<button
						onClick={() => signIn('google')}
						className="px-4 py-1.5 bg-blue-600 text-white rounded-md text-sm font-semibold">
						Sign in
					</button>
				)}
			</div>
		</header>
	);
}
