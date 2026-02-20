'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
	const { data: session } = useSession();

	return (
		<div>
			{session ? (
				<>
					<p>{session.user?.email}</p>
					<button onClick={() => signOut()}>Sign out</button>
				</>
			) : (
				<button onClick={() => signIn('google')}>Sign in</button>
			)}
		</div>
	);
}
