import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const { id } = await params;
	const session = await getServerSession(authOptions);
	if (!session)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const board = await prisma.board.findUnique({
			where: { id: id },
			include: {
				columns: {
					include: {
						cards: true,
					},
				},
			},
		});

		if (!board)
			return NextResponse.json({ error: 'Not found' }, { status: 404 });

		return NextResponse.json(board);
	} catch (err) {
		return NextResponse.json(err);
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { id: string } },
) {
	const { id } = await params;
	const body = await req.json();

	if (!body.title || typeof body.title !== 'string') {
		return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
	}

	const session = await getServerSession(authOptions);
	if (!session)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const board = await prisma.board.findUnique({
			where: { id: id, ownerId: session.user.id },
		});

		if (!board)
			return NextResponse.json({ error: 'Not found' }, { status: 404 });
	} catch (err) {
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}

	try {
		const updated = await prisma.board.update({
			where: { id: id, ownerId: session.user.id },
			data: {
				title: body.title,
				layout: body.layout,
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
		const board = await prisma.board.findFirst({
			where: { id: params.id, ownerId: session.user.id },
		});

		if (!board)
			return NextResponse.json({ error: 'Not found' }, { status: 404 });
	} catch (err) {
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}

	try {
		await prisma.board.delete({
			where: { id: params.id, ownerId: session.user.id },
		});
	} catch (err) {
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}

	return NextResponse.json({ success: true });
}
