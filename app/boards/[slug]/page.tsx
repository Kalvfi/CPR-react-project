'use client';
import { Board, Column } from '@/types/types';
import { useParams } from 'next/navigation';
import { Key, useEffect, useState } from 'react';

export default function BoardView() {
	const [board, setBoard] = useState<Board | null>(null);
	const params = useParams();

	const id = Array.isArray(params.slug) ? params.slug[0] : params.slug;

	const fetchBoard = async (id: string) => {
		const res = await fetch(`/api/boards/${id}`, {
			cache: 'no-store',
		});

		if (!res.ok) {
			console.error('Failed:', res.status);
			return;
		}

		const data = await res.json();
		console.log('FETCHED:', data);
		setBoard(data);
	};

	useEffect(() => {
		if (!id) return;
		fetchBoard(id);
	}, [id]);

	const createColumn = async () => {
		if (!board) return;

		await fetch('/api/columns', {
			method: 'POST',
			body: JSON.stringify({
				title: 'New Column',
				boardId: board.id,
				position: board.columns.length,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		await fetchBoard(id!);
	};

	const createCard = async (column: Column) => {
		if (!board) return;

		await fetch('/api/cards', {
			method: 'POST',
			body: JSON.stringify({
				title: 'New Card',
				imageUrl: 'https://placehold.co/600x400',
				columnId: column.id,
				position: column.cards.length,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});

		await fetchBoard(id!);
	};

	return (
		<div
			key={id as Key}
			className="min-h-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-6 transition-colors">
			<div className="mx-auto">
				<h1 className="text-3xl font-semibold mb-6 tracking-tight">
					{board?.title || 'Loading...'}
				</h1>

				<div className="flex gap-6 overflow-auto pb-4">
					{board?.columns?.map((column) => (
						<div
							key={column.id}
							className="w-72 max-h-fit shrink-0 rounded-2xl p-4 shadow-md border 
						bg-white border-zinc-200 
						dark:bg-zinc-800 dark:border-zinc-700">
							<h2 className="font-medium text-lg mb-3">{column.title}</h2>

							<div className="flex flex-col gap-3">
								{column?.cards.map((card) => (
									<div
										key={card.id}
										className="rounded-xl p-3 shadow-sm cursor-pointer transition
									bg-zinc-100 hover:bg-zinc-200
									dark:bg-zinc-700 dark:hover:bg-zinc-600">
										<p className="text-sm">{card.title}</p>
										<img src={card.imageUrl} alt="image_content" />
									</div>
								))}
							</div>

							<button
								onClick={() => createCard(column)}
								className="mt-4 w-full text-sm font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition">
								+ Add Card
							</button>
						</div>
					))}

					<button
						onClick={createColumn}
						className="w-72 h-12 shrink-0 rounded-2xl border-2 border-dashed flex items-center justify-center transition
					border-zinc-300 text-zinc-500 hover:border-indigo-400 hover:text-indigo-500
					dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-400 dark:hover:text-indigo-300">
						+ Add Column
					</button>
				</div>
			</div>
		</div>
	);
}
