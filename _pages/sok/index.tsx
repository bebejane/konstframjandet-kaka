import s from './index.module.scss';
import cn from 'classnames';
import withGlobalProps from '@/lib/withGlobalProps';
import { Loader, Button } from '../../components';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Markdown } from 'next-dato-utils/components';
import useStore from '@/lib/store';
import { useRouter } from 'next/router';
import type { SearchResult } from '../api/search';
import { pageSlugs } from '@/lib/i18n';

export type Props = {
	query?: string;
};

export default function Search({ query }: Props) {
	const router = useRouter();
	const [searchQuery, setSearchQuery] = useStore((state) => [state.searchQuery, state.setSearchQuery]);
	const [results, setResults] = useState<SearchResult | undefined>();
	const [error, setError] = useState<Error | undefined>();
	const [loading, setLoading] = useState<boolean>(false);
	const searchTimeout = useRef<NodeJS.Timer | null>(null);

	const siteSearch = (q) => {
		const variables = {
			q: q
				? `${q
						.split(' ')
						.filter((el) => el)
						.join('|')}`
				: undefined,
			locale: router.locale,
		};

		if (!Object.keys(variables).filter((k) => variables[k] !== undefined).length) return setLoading(false);

		fetch('/api/search', {
			body: JSON.stringify(variables),
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
		})
			.then(async (res) => {
				const results = await res.json();
				if (res.status === 200) {
					setResults(results);
				} else setError(new Error('error in search'));
			})
			.catch((err) => setError(err))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
		setResults(undefined);
		setLoading(true);
		setError(undefined);
		//@ts-ignore
		clearTimeout(searchTimeout.current);
		searchTimeout.current = setTimeout(() => siteSearch(searchQuery), 250);
	}, [searchQuery]);

	useEffect(() => {
		// Clear search query on unmount
		return () => setSearchQuery(undefined);
	}, []);

	useEffect(() => {
		const params = new URL(document.location.href).searchParams;
		query && setSearchQuery(query);
		params.get('q') && setSearchQuery(params.get('q'));
	}, [query]);

	return (
		<section className={cn(s.container)}>
			<div className={cn(s.search)}>
				<input
					className={'mid'}
					placeholder={'Sök...'}
					value={searchQuery || ''}
					onChange={({ target: { value } }) => setSearchQuery(value)}
				/>
			</div>
			{results && Object.keys(results).length > 0 ? (
				<>
					{Object.keys(results).map((type, idx) => (
						<ul key={idx}>
							<li>
								<h2>{results[type][0].category}</h2>
							</li>
							{results[type]?.map(({ category, title, text, slug }, i) => (
								<li key={i}>
									<h1>
										<Link href={slug}>{title}</Link>
									</h1>
									<div className={s.intro}>
										<Markdown>{text}</Markdown>
									</div>
									<Link href={slug}>
										<Button>Läs mer</Button>
									</Link>
								</li>
							))}
						</ul>
					))}
				</>
			) : loading ? (
				<div className={s.loading}>
					<Loader />
				</div>
			) : (
				results && searchQuery && <p className={cn(s.nohits, 'small')}>Inga träffar för &quot;{searchQuery}&quot;</p>
			)}
			{error && (
				<div className={s.error}>
					<p>{typeof error === 'string' ? error : error.message}</p>
				</div>
			)}
		</section>
	);
}

export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {
	return {
		props: {
			...props,
			page: {
				section: 'search',
				title: 'Sök',
				slugs: pageSlugs('search'),
			} as PageProps,
		},
		revalidate,
	};
});
