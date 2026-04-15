export type Card = {
	id: string;
	title?: string;
	imageUrl: string;
	position: number;
};

export type Column = {
	id: string;
	title: string;
	position: number;
	cards: Card[];
};

export type Board = {
	id: string;
	title: string;
	columns: Column[];
	layout: string;
};
