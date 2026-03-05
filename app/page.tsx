'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

type Card = {
	id: string;
	title?: string;
	imageUrl: string;
	position: number;
};

type Column = {
	id: string;
	title: string;
	position: number;
	cards: Card[];
};

type Board = {
	id: string;
	title: string;
	columns: Column[];
};

export default function Home() {
	const { data: session, status } = useSession();
	const [boards, setBoards] = useState<Board[]>([]);

	useEffect(() => {
		fetch('/api/boards')
			.then((res) => res.json())
			.then((data) => setBoards(data))
			.catch((err) => console.error(err));
	}, []);

	if (status === 'loading') {
		return <p>Loading...</p>;
	}

	if (!session) {
		return (
			<div className="flex h-[60vh] items-center justify-center">
				<div className="text-center space-y-4">
					<h1 className="text-3xl font-bold">Welcome</h1>
					<p>Sign in using the button in the header to view your boards.</p>
				</div>
			</div>
		);
	}

	return (
		<div className="text-white">
			<h1 className="text-2xl font-bold mb-6">Your Boards</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				{boards.map((board) => (
					<BoardTile key={board.id} board={board} />
				))}
				<button className="h-24 bg-white/20 hover:bg-white/30 transition rounded-md flex items-center justify-center border-2 border-dashed border-white/40">
					<span className="font-medium text-white">Create new board</span>
				</button>
			</div>
		</div>
	);
}

function BoardTile({ board }: { board: Board }) {
	return (
		<div className="h-24 bg-blue-800 hover:bg-blue-900 transition-all p-3 rounded-md cursor-pointer shadow-sm relative group">
			<h2 className="font-bold text-lg">{board.title}</h2>
			<div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
				⭐
			</div>
		</div>
	);
}
