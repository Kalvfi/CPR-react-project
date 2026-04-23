'use client';

import { CardType, ColumnType } from '@/types/types';
import Card from './Card';
import { useSortable } from '@dnd-kit/react/sortable';
import { useDroppable } from '@dnd-kit/react';

export default function Column({
	column,
	index,
	onAddCard,
}: {
	column: ColumnType;
	index: number;
	onAddCard: () => void;
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

	return (
		<div
			ref={(node) => {
				ref(node);
				dropRef(node);
			}}
			className="w-72 max-h-fit shrink-0 rounded-2xl p-4 shadow-md border 
						bg-white border-zinc-200 
						dark:bg-zinc-800 dark:border-zinc-700">
			<h2 className="font-medium text-lg mb-3">{column.title}</h2>

			<div className="flex flex-col gap-3">
				{column?.cards.map((card: CardType, i: number) => (
					<Card key={card.id} card={card} index={i} columnId={column.id} />
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
