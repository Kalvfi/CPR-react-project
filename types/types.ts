export type CardType = {
	id: string;
	title?: string;
	imageUrl: string;
	position: number;
	columnId: string;
};

export type ColumnType = {
	id: string;
	title: string;
	position: number;
	boardId: string;
	cards: CardType[];
};

export type BoardType = {
	id: string;
	title: string;
	columns: ColumnType[];
	layout: string;
};
