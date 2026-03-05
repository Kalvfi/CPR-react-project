import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
	const body = await req.json();

	const updates = body.cards.map((card: any) =>
		prisma.card.update({
			where: { id: card.id },
			data: {
				position: card.position,
				columnId: card.columnId,
			},
		}),
	);

	await prisma.$transaction(updates);

	return NextResponse.json({ success: true });
}
