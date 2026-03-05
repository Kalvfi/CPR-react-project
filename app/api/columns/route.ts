import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
	const body = await req.json();

	const column = await prisma.column.create({
		data: {
			title: body.title,
			boardId: body.boardId,
			position: body.position,
		},
	});

	return NextResponse.json(column);
}
