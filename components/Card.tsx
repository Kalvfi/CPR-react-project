'use client';

import { CardType } from '@/types/types';
import { useSortable } from '@dnd-kit/react/sortable';
import { useState } from 'react';
import ActionMenu from './ActionMenu';

export default function Card({
	card,
	index,
	columnId,
	onRename,
	onDelete,
}: {
	card: CardType;
	index: number;
	columnId: string;
	onRename: (card: CardType, title: string) => void;
	onDelete: (card: CardType) => void;
}) {
	const { ref } = useSortable({
		id: card.id,
		index,
		type: 'card',
		group: columnId,
		accept: 'card',
	});

	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState('');

	const handleRename = () => {
		if (editTitle.trim() && editTitle !== card.title) {
			onRename(card, editTitle);
		}
		setIsEditing(false);
	};

	return (
		<div
			ref={ref}
			className="group relative rounded-xl p-3 shadow-sm cursor-pointer transition
									bg-zinc-100 hover:bg-zinc-200
									dark:bg-zinc-700 dark:hover:bg-zinc-600">
			{!isEditing && (
				<ActionMenu
					onRename={() => {
						setEditTitle(card.title!);
						setIsEditing(true);
					}}
					onDelete={() => onDelete(card)}
					type="card"
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
					className="text-sm w-full bg-transparent border-b-2 border-indigo-500 focus:outline-none mb-2"
				/>
			) : (
				<p className="text-sm pr-6 mb-2">{card.title}</p>
			)}

			{card.imageUrl && (
				<img
					src={card.imageUrl}
					alt={card.title}
					className="w-full rounded-lg object-cover"
				/>
			)}
		</div>
	);
}
