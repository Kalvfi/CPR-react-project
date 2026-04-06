'use client';

import { useAppContext } from '@/context/AppContext';
import { Loader2, X } from 'lucide-react';
import { useState } from 'react';

export default function NewBoardModal() {
	const { refetchBoards, isModalOpen, closeModal } = useAppContext();

	const [boardName, setBoardName] = useState<string>('');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const createBoard = async (e: React.SubmitEvent) => {
		e.preventDefault();

		if (!boardName.trim()) {
			setError('Board name cannot be empty');
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch('/api/boards', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ title: boardName.trim() }),
			});

			if (!response.ok) {
				throw new Error('Failed to create board');
			}

			// Clean up form and close modal
			setBoardName('');
			closeModal();

			refetchBoards();
		} catch (err: any) {
			setError(err.message || 'Something went wrong');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
					<div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-gray-900">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-xl font-semibold text-gray-900 dark:text-white">
								Create New Board
							</h2>
							<button
								onClick={() => {
									closeModal();
									setBoardName('');
									setError(null);
								}}
								className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300">
								<X size={20} />
							</button>
						</div>

						<form onSubmit={createBoard}>
							<div className="mb-4">
								<label
									htmlFor="boardName"
									className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
									Board Title
								</label>
								<input
									id="boardName"
									type="text"
									autoFocus
									value={boardName}
									onChange={(e) => setBoardName(e.target.value)}
									placeholder="e.g., Marketing Campaign"
									className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
									disabled={isLoading}
								/>
								{error && <p className="mt-1 text-sm text-red-500">{error}</p>}
							</div>

							<div className="flex justify-end gap-3">
								<button
									type="button"
									onClick={() => {
										closeModal();
										setBoardName('');
										setError(null);
									}}
									className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
									disabled={isLoading}>
									Cancel
								</button>
								<button
									type="submit"
									disabled={isLoading || !boardName.trim()}
									className="flex items-center justify-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50">
									{isLoading ? (
										<Loader2 size={16} className="animate-spin" />
									) : (
										'Create'
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	);
}
