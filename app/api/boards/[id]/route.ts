import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const board = await prisma.board.findUnique({
		where: { id: params.id },
		include: {
			columns: {
				include: {
					cards: true,
				},
			},
		},
	});

	return NextResponse.json(board);
}

export async function PATCH(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const body = await req.json();

	const board = await prisma.board.update({
		where: { id: params.id },
		data: {
			title: body.title,
			layout: body.layout,
		},
	});

	return NextResponse.json(board);
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } },
) {
	await prisma.board.delete({
		where: { id: params.id },
	});

	return NextResponse.json({ success: true });
}
