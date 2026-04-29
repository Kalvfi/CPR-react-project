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

		await prisma.$transaction(async (tx) => {
			await tx.board.update({
				where: { id },
				data: {
					title: body.title,
					layout: body.layout,
				},
			});

			for (
				let columnIndex = 0;
				columnIndex < body.columns.length;
				columnIndex++
			) {
				const column = body.columns[columnIndex];

				await tx.column.update({
					where: { id: column.id },
					data: {
						title: column.title,
						position: columnIndex,
					},
				});

				for (let cardIndex = 0; cardIndex < column.cards.length; cardIndex++) {
					const card = column.cards[cardIndex];

					await tx.card.update({
						where: { id: card.id },
						data: {
							title: card.title,
							imageKey: card.imageKey,
							columnId: column.id,
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
