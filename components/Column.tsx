'use client';

import { CardType, ColumnType } from '@/types/types';
import Card from './Card';
import { useSortable } from '@dnd-kit/react/sortable';
import { useDroppable } from '@dnd-kit/react';
import { useState } from 'react';
import ActionMenu from './ActionMenu';

export default function Column({
	column,
	index,
	onAddCard,
	renameColumn,
	deleteColumn,
	renameCard,
	deleteCard,
}: {
	column: ColumnType;
	index: number;
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

	const handleRename = () => {
		if (editTitle.trim() && editTitle !== column.title) {
			renameColumn(column, editTitle);
		}
		setIsEditing(false);
	};

	return (
		<div
			ref={(node) => {
				ref(node);
				dropRef(node);
			}}
			className="group relative w-72 max-h-fit shrink-0 rounded-2xl p-4 shadow-md border 
						bg-white border-zinc-200 
						dark:bg-zinc-800 dark:border-zinc-700">
			{!isEditing && (
				<ActionMenu
					onRename={() => {
						setEditTitle(column.title);
						setIsEditing(true);
					}}
					onDelete={() => deleteColumn(column)}
					type="column"
				/>
			)}

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

			<div className="flex flex-col gap-3">
				{[...column.cards]
					.sort((a, b) => a.position - b.position)
					.map((card: CardType, i: number) => (
						<Card
							key={card.id}
							card={card}
							index={i}
							columnId={column.id}
							onRename={renameCard}
							onDelete={deleteCard}
						/>
					))}
			</div>

			<button
				onClick={onAddCard}
				className="mt-4 w-full text-sm font-medium text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition">
				+ Add Card
			</button>
		</div>
	);
}
