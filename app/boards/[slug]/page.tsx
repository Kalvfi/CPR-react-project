'use client';
import Column from '@/components/Column';
import { BoardType, ColumnType } from '@/types/types';
import { DragDropProvider, useDroppable } from '@dnd-kit/react';
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

		if (res.ok) {
			const data = await res.json();
			setBoard(data);
		} else {
			console.error('Failed:', res.status);
		}
	};

	const saveBoard = async () => {
		const res = await fetch(`/api/boards/${board?.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(board),
		});

		if (res.ok) {
			await fetchBoard(id!);
			setDirty(false);
		} else {
			console.error('Failed to save changes');
		}
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

				if (!source || !target) return;

				setBoard((prev) => {
					if (!prev) return prev;

					const board = structuredClone(prev);

					// COLUMN DRAG
					if (source.type === 'column') {
						const fromIndex = board.columns.findIndex(
							(c) => c.id === source.id,
						);
						const toIndex = board.columns.findIndex((c) => c.id === target.id);

						if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
							const [moved] = board.columns.splice(fromIndex, 1);
							board.columns.splice(toIndex, 0, moved);

							board.columns.forEach((c, i) => (c.position = i));
							return board;
						}
						return prev;
					}

					// CARD DRAG
					if (source.type === 'card') {
						const activeColumn = board.columns.find((c) =>
							c.cards.some((card) => card.id === source.id),
						);

						const overColumn =
							board.columns.find((c) => c.id === target.id) ||
							board.columns.find((c) =>
								c.cards.some((card) => card.id === target.id),
							);

						if (!activeColumn || !overColumn) return prev;

						if (activeColumn.id === overColumn.id) return prev;

						const activeCardIndex = activeColumn.cards.findIndex(
							(c) => c.id === source.id,
						);
						const [movedCard] = activeColumn.cards.splice(activeCardIndex, 1);
						movedCard.columnId = overColumn.id;

						if (target.type === 'column') {
							overColumn.cards.push(movedCard);
						} else {
							const overCardIndex = overColumn.cards.findIndex(
								(c) => c.id === target.id,
							);
							const insertIndex =
								overCardIndex >= 0 ? overCardIndex : overColumn.cards.length;
							overColumn.cards.splice(insertIndex, 0, movedCard);
						}

						activeColumn.cards.forEach((c, i) => (c.position = i));
						overColumn.cards.forEach((c, i) => (c.position = i));

						return board;
					}

					return prev;
				});

				setDirty(true);
			}}
			onDragEnd={(event) => {
				const { source, target } = event.operation;

				if (!source || !target || event.canceled) return;

				setBoard((prev) => {
					if (!prev) return prev;

					const board = structuredClone(prev);

					// COLUMN DRAG
					if (source.type === 'column') {
						const fromIndex = board.columns.findIndex(
							(col) => col.id === source.id,
						);

						const toIndex = board.columns.findIndex(
							(col) => col.id === target.id,
						);

						if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
							const [moved] = board.columns.splice(fromIndex, 1);
							board.columns.splice(toIndex, 0, moved);
						}
					}

					// CARD DRAG
					if (source.type === 'card') {
						const activeColumn = board.columns.find((col) =>
							col.cards.some((card) => card.id === source.id),
						);

						const overColumn =
							board.columns.find((col) => col.id === target.id) ||
							board.columns.find((col) =>
								col.cards.some((card) => card.id === target.id),
							);

						if (
							activeColumn &&
							overColumn &&
							activeColumn.id === overColumn.id
						) {
							const activeIndex = activeColumn.cards.findIndex(
								(c) => c.id === source.id,
							);
							let overIndex = overColumn.cards.findIndex(
								(c) => c.id === target.id,
							);

							if (overIndex === -1) {
								overIndex = overColumn.cards.length;
							}

							if (activeIndex !== -1 && activeIndex !== overIndex) {
								const [moved] = activeColumn.cards.splice(activeIndex, 1);
								activeColumn.cards.splice(overIndex, 0, moved);
							}
						}
					}

					board.columns.forEach((col, colIndex) => {
						col.position = colIndex;
						col.cards.forEach((card, cardIndex) => {
							card.position = cardIndex;
							card.columnId = col.id;
						});
					});

					return board;
				});

				setDirty(true);
			}}>
			<div
				key={id as Key}
				className="min-h-full bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 p-6 transition-colors">
				<div className="mx-auto">
					<div className="flex items-center gap-4 mb-6">
						<h1 className="text-3xl font-semibold tracking-tight">
							{board?.title || 'Loading...'}
						</h1>

						{dirty && (
							<button
								onClick={saveBoard}
								className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition">
								Save Changes
							</button>
						)}
					</div>

					<div className="flex gap-6 overflow-auto pb-4 items-start">
						{board &&
							[...board.columns]
								.sort((a, b) => a.position - b.position)
								.map((column, i) => (
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
