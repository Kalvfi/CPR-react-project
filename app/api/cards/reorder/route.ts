import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PATCH(req: Request) {
	const body = await req.json();

	if (!body.title || typeof body.title !== 'string') {
		return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
	}

	const session = await getServerSession(authOptions);
	if (!session)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const cards = await prisma.card.findMany({
			where: {
				id: { in: body.cards.map((c: any) => c.id) },
				column: {
					board: {
						ownerId: session.user.id,
					},
				},
			},
		});

		if (cards.length !== body.cards.length) {
			return NextResponse.json({ error: 'Invalid cards' }, { status: 403 });
		}
	} catch (err) {
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}

	try {
		const updates = body.cards.map((card: any) => {
			prisma.card.update({
				where: { id: card.id },
				data: {
					position: card.position,
					columnId: card.columnId,
				},
			});
		});

		await prisma.$transaction(updates);
	} catch (err) {
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}
