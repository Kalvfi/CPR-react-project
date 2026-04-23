export type CardType = {
	id: string;
	title?: string;
	imageUrl: string;
	position: number;
};

export type ColumnType = {
	id: string;
	title: string;
	position: number;
	cards: CardType[];
};

export type BoardType = {
	id: string;
	title: string;
	columns: ColumnType[];
	layout: string;
};
