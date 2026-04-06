'use client';
import { Board } from '@/types/types';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BoardView() {
	const [board, setBoard] = useState<Board | null>(null);
	const { slug } = useParams();

	useEffect(() => {
		if (!slug) return;
		fetch(`/api/boards/${slug}`)
			.then((res) => res.json())
			.then(setBoard)
			.catch(console.error);
	}, [slug]);

	return (
		<div>
			<h1>{board?.title}</h1>
		</div>
	);
}
