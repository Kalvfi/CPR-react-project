import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '@/lib/r2';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
	const formData = await req.formData();
	const file = formData.get('file') as File;

	if (!file) {
		return NextResponse.json({ error: 'No file' }, { status: 400 });
	}

	const bytes = await file.arrayBuffer();
	const buffer = Buffer.from(bytes);

	const fileName = `uploads/${crypto.randomUUID()}`;

	await r2.send(
		new PutObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME,
			Key: fileName,
			Body: buffer,
			ContentType: file.type,
		}),
	);

	return NextResponse.json({
		success: true,
		key: fileName,
	});
}
