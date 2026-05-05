'use client';
import { useAppContext } from '@/context/AppContext';
import { KanbanSquare, LayoutDashboard } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Sidebar() {
	const { boards } = useAppContext();
	const { data: session } = useSession();
	const pathname = usePathname();

	const isBoardsPage = pathname === '/';

	return (
		<aside className="fixed inset-y-0 left-0 z-40 w-64 transform border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-950 md:static md:translate-x-0">
			<nav className="space-y-1 p-4">
				<Link
					href="/"
					onClick={(e) => {
						if (isBoardsPage) e.preventDefault();
					}}
					className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
						isBoardsPage
							? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
							: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50'
					}`}>
					<LayoutDashboard
						size={18}
						className={
							isBoardsPage
								? 'text-indigo-700 dark:text-indigo-400'
								: 'text-gray-400'
						}
					/>
					Dashboard
				</Link>
			</nav>

			<div className="mt-8 px-4">
				<h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
					My Boards
				</h3>
				<div className="space-y-1">
					{session?.user &&
						boards?.map((board) => {
							const href = `/boards/${encodeURIComponent(board.id)}`;
							const isActive = pathname.startsWith(href);

							return (
								<Link
									href={href}
									key={board.id}
									onClick={(e) => {
										if (isActive) e.preventDefault();
									}}
									className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
										isActive
											? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
											: 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50'
									}`}>
									<div className="h-2 w-2 rounded-full bg-blue-500" />
									<span className="truncate">{board.title}</span>
								</Link>
							);
						})}
				</div>
			</div>
		</aside>
	);
}
