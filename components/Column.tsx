'use client';

import { CardType, ColumnType } from '@/types/types';
import Card from './Card';
import { useSortable } from '@dnd-kit/react/sortable';
import { useDroppable } from '@dnd-kit/react';
import { useEffect, useRef, useState } from 'react';
import ActionMenu from './ActionMenu';

export default function Column({
	column,
	index,
	layout = 'columns',
	onAddCard,
	renameColumn,
	deleteColumn,
	renameCard,
	deleteCard,
}: {
	column: ColumnType;
	index: number;
	layout?: 'columns' | 'rows' | 'grid';
	onAddCard: () => void;
	renameColumn: (column: ColumnType, title: string) => void;
	deleteColumn: (column: ColumnType) => void;
	renameCard: (card: CardType, title: string) => void;
	deleteCard: (card: CardType) => void;
}) {
	const { ref } = useSortable({
		id: column.id,
		index,
		type: 'column',
		accept: ['column'],
	});

	const { ref: dropRef } = useDroppable({
		id: column.id,
	});

	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState('');
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const handleRename = () => {
		if (editTitle.trim() && editTitle !== column.title) {
			renameColumn(column, editTitle);
		}
		setIsEditing(false);
	};

	const isColumns = layout === 'columns';
	const isRows = layout === 'rows';

	useEffect(() => {
		const el = scrollContainerRef.current;
		if (!el) return;

		const handleScrollbarClick = (e: Event) => {
			if (e.target === el && 'clientY' in e) {
				const mouseEvent = e as MouseEvent;
				const rect = el.getBoundingClientRect();
				const scrollbarHeight = el.offsetHeight - el.clientHeight;

				if (
					scrollbarHeight > 0 &&
					mouseEvent.clientY >= rect.bottom - scrollbarHeight
				) {
					e.stopPropagation();
				}
			}
		};

		el.addEventListener('pointerdown', handleScrollbarClick);
		el.addEventListener('mousedown', handleScrollbarClick);
		el.addEventListener('touchstart', handleScrollbarClick);

		return () => {
			el.removeEventListener('pointerdown', handleScrollbarClick);
			el.removeEventListener('mousedown', handleScrollbarClick);
			el.removeEventListener('touchstart', handleScrollbarClick);
		};
	}, []);

	return (
		<div
			ref={(node) => {
				ref(node);
				dropRef(node);
			}}
			className={`relative shrink-0 rounded-2xl p-4 shadow-md border 
						bg-white border-zinc-200 
						dark:bg-zinc-800 dark:border-zinc-700 transition-all duration-300
						${isColumns ? 'w-72 max-h-fit' : isRows ? 'w-full' : 'w-full max-h-fit'}`}>
			<div className="flex items-start justify-between">
				{isEditing ? (
					<input
						autoFocus
						value={editTitle}
						onChange={(e) => setEditTitle(e.target.value)}
						onBlur={handleRename}
						onKeyDown={(e) => e.key === 'Enter' && handleRename()}
						onPointerDown={(e) => e.stopPropagation()}
						className="font-medium text-lg mb-3 w-full bg-transparent border-b-2 border-indigo-500 focus:outline-none"
					/>
				) : (
					<h2 className="font-medium text-lg mb-3 pr-8">{column.title}</h2>
				)}

				{!isEditing && (
					<div className="absolute right-2 top-2">
						<ActionMenu
							onRename={() => {
								setEditTitle(column.title);
								setIsEditing(true);
							}}
							onDelete={() => deleteColumn(column)}
							type="column"
						/>
					</div>
				)}
			</div>

			<div
				ref={scrollContainerRef}
				className={`flex gap-3 ${isRows ? 'flex-row overflow-x-auto pb-2 items-start' : 'flex-col'}`}>
				{[...column.cards]
					.sort((a, b) => a.position - b.position)
					.map((card: CardType, i: number) => (
						<Card
							key={card.id}
							card={card}
							index={i}
							columnId={column.id}
							layout={layout}
							onRename={renameCard}
							onDelete={deleteCard}
						/>
					))}
				{isRows && (
					<button
						onClick={onAddCard}
						className="w-72 shrink-0 self-stretch min-h-25 rounded-xl border-2 border-dashed border-zinc-300 text-sm font-medium text-zinc-500 hover:border-indigo-400 hover:text-indigo-500 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-indigo-400 dark:hover:text-indigo-300 transition flex items-center justify-center bg-zinc-50/50 hover:bg-zinc-50 dark:bg-zinc-800/30 dark:hover:bg-zinc-800/80">
						+ Add Card
					</button>
				)}
			</div>

			{!isRows && (
				<button
					onClick={onAddCard}
					className="mt-4 w-full text-sm font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition">
					+ Add Card
				</button>
			)}
		</div>
	);
}
