import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getImageUrl } from '@/lib/r2SignedUrl';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const session = await getServerSession(authOptions);

	if (!session)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const board = await prisma.board.findUnique({
			where: { id: id },
			include: {
				columns: {
					include: {
						cards: true,
					},
				},
			},
		});

		if (!board)
			return NextResponse.json({ error: 'Not found' }, { status: 404 });

		const boardWithUrls = {
			...board,
			columns: await Promise.all(
				board.columns.map(async (column) => ({
					...column,
					cards: await Promise.all(
						column.cards.map(async (card) => ({
							...card,
							imageUrl: card.imageKey ? await getImageUrl(card.imageKey) : null,
						})),
					),
				})),
			),
		};

		return NextResponse.json(boardWithUrls);
	} catch (err) {
		return NextResponse.json(err, { status: 500 });
	}
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const body = await req.json();

	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const board = await prisma.board.findUnique({
			where: {
				id,
				ownerId: session.user.id,
			},
		});

		if (!board) {
			return NextResponse.json({ error: 'Board not found' }, { status: 404 });
		}

		const incomingColumnIds = body.columns.map((c: any) => c.id);
		const incomingCardIds = body.columns.flatMap((c: any) =>
			c.cards.map((card: any) => card.id),
		);

		await prisma.$transaction(async (tx) => {
			await tx.board.update({
				where: { id },
				data: {
					title: body.title,
					layout: body.layout,
				},
			});

			const dbColumns = await tx.column.findMany({
				where: { boardId: id },
				include: { cards: true },
			});

			const dbColumnIds = dbColumns.map((c) => c.id);
			const dbCardIds = dbColumns.flatMap((c) =>
				c.cards.map((card) => card.id),
			);

			const columnsToDelete = dbColumnIds.filter(
				(colId) => !incomingColumnIds.includes(colId),
			);
			const cardsToDelete = dbCardIds.filter(
				(cardId) => !incomingCardIds.includes(cardId),
			);

			if (cardsToDelete.length > 0) {
				await tx.card.deleteMany({
					where: { id: { in: cardsToDelete } },
				});
			}

			if (columnsToDelete.length > 0) {
				await tx.column.deleteMany({
					where: { id: { in: columnsToDelete } },
				});
			}

			for (
				let columnIndex = 0;
				columnIndex < body.columns.length;
				columnIndex++
			) {
				const column = body.columns[columnIndex];

				await tx.column.upsert({
					where: { id: column.id },
					update: {
						title: column.title,
						position: columnIndex,
					},
					create: {
						id: column.id,
						boardId: id,
						title: column.title,
						position: columnIndex,
					},
				});

				for (let cardIndex = 0; cardIndex < column.cards.length; cardIndex++) {
					const card = column.cards[cardIndex];

					await tx.card.upsert({
						where: { id: card.id },
						update: {
							title: card.title,
							imageKey: card.imageKey,
							columnId: column.id,
							position: cardIndex,
						},
						create: {
							id: card.id,
							columnId: column.id,
							title: card.title,
							imageKey: card.imageKey,
							position: cardIndex,
						},
					});
				}
			}
		});

		return NextResponse.json({ success: true });
	} catch (err) {
		return NextResponse.json(err, { status: 500 });
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const session = await getServerSession(authOptions);

	if (!session)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const board = await prisma.board.findUnique({
			where: { id: id, ownerId: session.user.id },
		});

		if (!board)
			return NextResponse.json({ error: 'Not found' }, { status: 404 });

		await prisma.board.delete({
			where: { id: id, ownerId: session.user.id },
		});

		return NextResponse.json({ success: true });
	} catch (err) {
		return NextResponse.json(err, { status: 500 });
	}
}
