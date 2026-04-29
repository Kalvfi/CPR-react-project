import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const body = await req.json();
	const { id } = await params;

	if (!body.title || typeof body.title !== 'string') {
		return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
	}

	const session = await getServerSession(authOptions);
	if (!session)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const card = await prisma.card.findFirst({
			where: {
				id: id,
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
			where: { id: id },
			data: {
				title: body.title,
				imageKey: body.imageKey,
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
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id } = await params;
	const session = await getServerSession(authOptions);

	if (!session)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const card = await prisma.card.findFirst({
			where: {
				id: id,
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
			where: { id: id },
		});
	} catch (err) {
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}
