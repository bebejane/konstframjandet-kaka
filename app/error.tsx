'use client';

import s from './error.module.scss';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className={s.error}>
			<h1>Nått gick fel!</h1>
			<p className={s.message}>{error.message}</p>
			<p>
				<button onClick={() => reset()}>Försök igen</button>
			</p>
		</div>
	);
}
