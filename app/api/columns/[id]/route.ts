import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const body = await req.json();

	const column = await prisma.column.update({
		where: { id: params.id },
		data: {
			title: body.title,
			position: body.position,
		},
	});

	return NextResponse.json(column);
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } },
) {
	await prisma.column.delete({
		where: { id: params.id },
	});

	return NextResponse.json({ success: true });
}
