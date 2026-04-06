import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PATCH(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const body = await req.json();

	if (!body.title || typeof body.title !== 'string') {
		return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
	}

	const session = await getServerSession(authOptions);
	if (!session)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const card = await prisma.card.findFirst({
			where: {
				id: params.id,
				column: {
					board: {
						ownerId: session.user.id,
					},
				},
			},
		});

		if (!card)
			return NextResponse.json({ error: 'Not found' }, { status: 404 });
	} catch (err) {
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}

	try {
		const updated = await prisma.card.update({
			where: { id: params.id },
			data: {
				title: body.title,
				imageUrl: body.imageUrl,
				columnId: body.columnId,
				position: body.position,
			},
		});

		return NextResponse.json(updated);
	} catch (err) {
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const session = await getServerSession(authOptions);
	if (!session)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const card = await prisma.card.findFirst({
			where: {
				id: params.id,
				column: {
					board: {
						ownerId: session.user.id,
					},
				},
			},
		});

		if (!card)
			return NextResponse.json({ error: 'Not found' }, { status: 404 });
	} catch (err) {
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}

	try {
		await prisma.card.delete({
			where: { id: params.id },
		});
	} catch (err) {
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}
