import s from './page.module.scss';
import cn from 'classnames';
import Link from 'next/link';
import { Markdown } from 'next-dato-utils/components';
import { siteSearch } from './site-search';
import type { SearchResult } from './site-search';
import { createLoader, parseAsString } from 'nuqs/server';
import { Article, Button } from '@/components';

const querySearchParams = { q: parseAsString.withDefault('') };
const loadSearchParams = createLoader(querySearchParams);

export default async function SearchPage({ searchParams }: PageProps<'/sok'>) {
	const { q } = await loadSearchParams(searchParams);
	let results: SearchResult | null = null;
	let error: Error | null = null;

	if (q) {
		try {
			results = await siteSearch(q);
		} catch (e) {
			error = e as Error;
		}
	}

	return (
		<Article>
			<section className={cn(s.container)}>
				<div className={s.search}>
					<form action={'/sok'} method={'GET'}>
						<input type={'text'} name={'q'} placeholder={'Sök...'} defaultValue={q} />
					</form>
				</div>
				{results && Object.keys(results).length > 0 ? (
					<>
						{Object.keys(results).map((type, idx) => (
							<ul key={idx}>
								<li>
									<h2>{results[type][0].category}</h2>
								</li>
								{results[type]?.map(({ category, title, text, href }, i) => (
									<li key={i}>
										<h1>
											<Link href={href}>{title}</Link>
										</h1>
										<div className={s.intro}>
											<Markdown content={text} />
										</div>
										<Link href={href}>
											<Button>Läs mer</Button>
										</Link>
									</li>
								))}
							</ul>
						))}
					</>
				) : (
					results && q && <p className={cn(s.nohits, 'small')}>Inga träffar för &quot;{q}&quot;</p>
				)}
				{error && <p>{error.message}</p>}
			</section>
		</Article>
	);
}
