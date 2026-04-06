'use client';
import { useAppContext } from '@/context/AppContext';
import { LayoutDashboard, KanbanSquare, Settings, X } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function Sidebar() {
	const navItems = [
		{ icon: LayoutDashboard, label: 'Dashboard', active: true },
		{ icon: KanbanSquare, label: 'My Boards', active: false },
		{ icon: Settings, label: 'Settings', active: false },
	];

	const { boards } = useAppContext();
	const { data: session } = useSession();

	return (
		<aside
			className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-950 md:static md:translate-x-0`}>
			<div className="flex h-16 items-center justify-between px-4 md:hidden">
				<span className="text-xl font-bold dark:text-white">Menu</span>
			</div>

			<nav className="space-y-1 p-4">
				{navItems.map((item, index) => (
					<button
						key={index}
						className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
							item.active
								? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
								: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50'
						}`}>
						<item.icon
							size={18}
							className={
								item.active
									? 'text-indigo-700 dark:text-indigo-400'
									: 'text-gray-400'
							}
						/>
						{item.label}
					</button>
				))}
			</nav>

			<div className="mt-8 px-4">
				<h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
					Recent Boards
				</h3>
				<div className="space-y-1">
					{session?.user ? (
						boards?.map((board) => (
							<button
								key={board.id}
								className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50">
								<div className={`h-2 w-2 rounded-full bg-blue-500`} />
								<span className="truncate">{board.title}</span>
							</button>
						))
					) : (
						<></>
					)}
				</div>
			</div>
		</aside>
	);
}
