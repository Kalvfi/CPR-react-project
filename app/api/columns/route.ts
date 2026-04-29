import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
	const body = await req.json();

	if (!body.title || typeof body.title !== 'string') {
		return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
	}

	const session = await getServerSession(authOptions);
	if (!session)
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

	try {
		const column = await prisma.column.create({
			data: {
				title: body.title,
				boardId: body.boardId,
				position: body.position,
			},
		});

		return NextResponse.json(column);
	} catch (err) {
		return NextResponse.json({ error: 'Server error' }, { status: 500 });
	}
}
