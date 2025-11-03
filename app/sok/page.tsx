import s from './page.module.scss';
import { Article, Loader } from '@/components';
import { Suspense } from 'react';
import Search from './SearchResults';
import { createLoader, parseAsString } from 'nuqs/server';

const querySearchParams = { q: parseAsString.withDefault('') };
const loadSearchParams = createLoader(querySearchParams);

export default async function SearchPage({ searchParams }: PageProps<'/sok'>) {
	console.time('searchParams');
	const { q: query } = await loadSearchParams(searchParams);
	console.timeEnd('searchParams');
	return (
		<Article>
			<section className={s.container}>
				<div className={s.form}>
					<form action={'/sok'} method={'GET'}>
						<input type={'text'} name={'q'} defaultValue={''} />
					</form>
				</div>
				<Suspense fallback={<Loader className={s.loader} />}>
					<Search query={query} />
				</Suspense>
			</section>
		</Article>
	);
}
