import { DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { r2 } from './r2';

export async function getImageUrl(key: string) {
	return await getSignedUrl(
		r2,
		new GetObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME,
			Key: key,
		}),
		{ expiresIn: 3600 },
	);
}

export async function deleteImage(key: string) {
	const command = new DeleteObjectCommand({
		Bucket: process.env.R2_BUCKET_NAME,
		Key: key,
	});

	await r2.send(command);
}
