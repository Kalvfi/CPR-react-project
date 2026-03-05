import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const body = await req.json();

	const card = await prisma.card.create({
		data: {
			title: body.title,
			imageUrl: body.imageUrl,
			columnId: body.columnId,
			position: body.position,
		},
	});

	return NextResponse.json(card);
}
