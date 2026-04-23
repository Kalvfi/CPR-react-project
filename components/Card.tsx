'use client';

import { CardType } from '@/types/types';
import { useSortable } from '@dnd-kit/react/sortable';

export default function Card({
	card,
	index,
	columnId,
}: {
	card: CardType;
	index: number;
	columnId: string;
}) {
	const { ref } = useSortable({
		id: card.id,
		index,
		type: 'card',
		group: columnId,
		accept: 'card',
	});

	return (
		<div
			ref={ref}
			className="rounded-xl p-3 shadow-sm cursor-pointer transition
									bg-zinc-100 hover:bg-zinc-200
									dark:bg-zinc-700 dark:hover:bg-zinc-600">
			<p className="text-sm">{card.title}</p>
			<img src={card.imageUrl} alt="" />
		</div>
	);
}
