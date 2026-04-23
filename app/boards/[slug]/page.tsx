'use client';
import Column from '@/components/Column';
import { BoardType, ColumnType } from '@/types/types';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { useParams } from 'next/navigation';
import { Key, useEffect, useState } from 'react';

export default function BoardView() {
	const [board, setBoard] = useState<BoardType | null>(null);
	const [dirty, setDirty] = useState(false);
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

	const saveBoard = async () => {
		await fetch(`/api/boards/${board?.id}/save`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(board),
		});

		await fetchBoard(id!);
		setDirty(false);
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

	const createCard = async (column: ColumnType) => {
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
		<DragDropProvider
			onDragOver={(event) => {
				const { source, target } = event.operation;

				if (!source || source.type !== 'card' || !target) return;

				setBoard((prev) => {
					if (!prev) return prev;

					const board = structuredClone(prev);

					let fromCol = board.columns.find((c) =>
						c.cards.some((card) => card.id === source.id),
					);

					let toCol =
						board.columns.find((c) => c.id === target.id) ||
						board.columns.find((c) =>
							c.cards.some((card) => card.id === target.id),
						);

					if (!fromCol || !toCol) return prev;

					const cardIndex = fromCol.cards.findIndex((c) => c.id === source.id);
					const [movedCard] = fromCol.cards.splice(cardIndex, 1);

					if (toCol.id === target.id) {
						toCol.cards.push(movedCard);
					} else {
						const targetIndex = toCol.cards.findIndex(
							(c) => c.id === target.id,
						);
						toCol.cards.splice(targetIndex, 0, movedCard);
					}

					return board;
				});

				setDirty(true);
			}}
			onDragEnd={(event) => {
				const { source } = event.operation;

				if (event.canceled || source?.type !== 'column') return;

				setBoard((prev) => {
					if (!prev) return prev;

					return {
						...prev,
						columns: move(prev.columns, event),
					};
				});
				setDirty(true);
			}}>
			<div
				key={id as Key}
				className="min-h-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-6 transition-colors">
				<div className="mx-auto">
					<h1 className="text-3xl font-semibold mb-6 tracking-tight">
						{board?.title || 'Loading...'}
					</h1>

					{dirty && <button onClick={saveBoard}>Save Changes</button>}

					<div className="flex gap-6 overflow-auto pb-4">
						{board?.columns?.map((column, i) => (
							<Column
								key={column.id}
								column={column}
								index={i}
								onAddCard={() => createCard(column)}
							/>
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
		</DragDropProvider>
	);
}
