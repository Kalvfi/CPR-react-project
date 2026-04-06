'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { KanbanSquare, LogOut, LogIn } from 'lucide-react';

export default function Header() {
	const { data: session } = useSession();

	return (
		<header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-800 dark:bg-gray-950 sm:px-6">
			<div className="flex items-center gap-2">
				<div className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white">
					<KanbanSquare size={20} />
				</div>
				<span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
					TaskFlow
				</span>
			</div>

			<div className="flex items-center gap-4">
				{session?.user ? (
					<div className="flex items-center gap-3">
						<span className="hidden text-sm font-medium text-gray-700 dark:text-gray-300 sm:block">
							{session?.user.name}
						</span>
						<div className="group relative">
							<button className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 ring-2 ring-transparent transition-all hover:ring-indigo-500 dark:bg-gray-800 dark:text-gray-300">
								<img
									src={
										session?.user?.image ||
										'https://static.vecteezy.com/system/resources/thumbnails/020/911/737/small/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png'
									}
									className="rounded-full"
								/>
							</button>
							{/* Dropdown placeholder */}
							<div className="absolute right-0 top-full mt-2 hidden w-48 flex-col rounded-md border border-gray-200 bg-white py-1 shadow-lg group-hover:flex dark:border-gray-800 dark:bg-gray-950">
								<button
									onClick={() => signOut()}
									className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-900">
									<LogOut size={16} />
									Sign out
								</button>
							</div>
						</div>
					</div>
				) : (
					<button
						onClick={() => signIn('google')}
						className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
						<LogIn size={16} />
						Sign In
					</button>
				)}
			</div>
		</header>
	);
}
