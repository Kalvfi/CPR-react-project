'use client';

import { useSession } from 'next-auth/react';
import { KanbanSquare, Plus, MoreVertical, Clock } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import NewBoardModal from '@/components/NewBoardModal';
import Link from 'next/link';

export default function Home() {
	const { data: session, status } = useSession();
	const { boards, openModal } = useAppContext();

	if (status === 'loading') {
		return <p>Loading...</p>;
	}

	if (!session) {
		return (
			<div className="flex h-full flex-col items-center justify-center p-8 text-center">
				<div className="mb-6 rounded-full bg-indigo-100 p-4 dark:bg-indigo-900/30">
					<KanbanSquare
						size={48}
						className="text-indigo-600 dark:text-indigo-400"
					/>
				</div>
				<h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
					Welcome to TaskFlow
				</h1>
				<p className="mb-8 max-w-md text-lg text-gray-600 dark:text-gray-400">
					Organize your projects, collaborate with your team, and get more done.
					Please sign in with Google to view your boards.
				</p>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
			<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
						Dashboard
					</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Welcome back, {session.user.name}! Here are your boards.
					</p>
				</div>
				<button
					className="inline-flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
					onClick={() => openModal()}>
					<Plus size={16} />
					Create Board
				</button>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{/* Create New Board Card */}
				<button
					className="group flex h-40 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-transparent transition-colors hover:border-indigo-500 hover:bg-indigo-50 dark:border-gray-700 dark:hover:border-indigo-400 dark:hover:bg-indigo-950/20"
					onClick={() => openModal()}>
					<div className="mb-2 rounded-full bg-gray-100 p-2 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:bg-gray-800 dark:text-gray-400 dark:group-hover:bg-indigo-900/50 dark:group-hover:text-indigo-400">
						<Plus size={24} />
					</div>
					<span className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-indigo-400">
						Create new board
					</span>
				</button>

				{/* Existing Boards */}
				{boards.map((board) => (
					<Link href={`/boards/${encodeURIComponent(board.id)}`} key={board.id}>
						<div className="group relative flex h-40 cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-950">
							<div className={`absolute left-0 top-0 h-1 w-full bg-blue-500`} />
							<div className="flex items-start justify-between">
								<h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
									{board.title}
								</h3>
								<button className="rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-600 group-hover:opacity-100 dark:hover:bg-gray-800 dark:hover:text-gray-300">
									<MoreVertical size={16} />
								</button>
							</div>
							<div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
								<Clock size={14} />
								Edited
							</div>
						</div>
					</Link>
				))}
			</div>

			<NewBoardModal />
		</div>
	);
}
