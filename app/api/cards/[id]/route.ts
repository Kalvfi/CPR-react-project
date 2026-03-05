import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const body = await req.json();

	const card = await prisma.card.update({
		where: { id: params.id },
		data: {
			title: body.title,
			imageUrl: body.imageUrl,
			columnId: body.columnId,
			position: body.position,
		},
	});

	return NextResponse.json(card);
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } },
) {
	await prisma.card.delete({
		where: { id: params.id },
	});

	return NextResponse.json({ success: true });
}
