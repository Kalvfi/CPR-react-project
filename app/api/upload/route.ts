import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '@/lib/r2';

export async function POST(req: Request) {
	const formData = await req.formData();
	const file = formData.get('file') as File;

	if (!file) {
		return Response.json({ error: 'No file' }, { status: 400 });
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

	return Response.json({
		success: true,
		key: fileName,
	});
}
