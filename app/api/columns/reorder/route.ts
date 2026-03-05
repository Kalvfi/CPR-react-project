import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request) {
	const body = await req.json();

	const updates = body.columns.map((column: any) =>
		prisma.column.update({
			where: { id: column.id },
			data: {
				position: column.position,
			},
		}),
	);

	await prisma.$transaction(updates);

	return NextResponse.json({ success: true });
}
