import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const boards = await prisma.board.findMany({
		where: { ownerId: session.user.id },
	});

	return NextResponse.json(boards);
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	const body = await req.json();

	const board = await prisma.board.create({
		data: {
			title: body.title,
			ownerId: session.user.id,
		},
	});

	return NextResponse.json(board);
}
