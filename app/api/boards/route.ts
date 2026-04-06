import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const boards = await prisma.board.findMany({
			where: { ownerId: session.user.id },
		});

		return NextResponse.json(boards);
	} catch (err) {
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}

export async function POST(req: Request) {
	const body = await req.json();

	if (!body.title || typeof body.title !== 'string') {
		return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
	}

	const session = await getServerSession(authOptions);
	if (!session)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const board = await prisma.board.create({
			data: {
				title: body.title,
				ownerId: session.user.id,
			},
		});

		return NextResponse.json(board);
	} catch (err) {
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
