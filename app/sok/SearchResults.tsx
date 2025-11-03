import s from './SearchResults.module.scss';
import Link from 'next/link';
import { Markdown } from 'next-dato-utils/components';
import { createLoader, parseAsString } from 'nuqs/server';
import { Button } from '@/components';
import { buildClient } from '@datocms/cma-client';
import { SearchResult } from '@datocms/cma-client/dist/types/generated/RawApiTypes';

const querySearchParams = { q: parseAsString.withDefault('') };
const loadSearchParams = createLoader(querySearchParams);

export default async function SearchResults({ query }: { query: string }) {
	//const { q: query } = await loadSearchParams(params);
	let results: SearchResult[] | null = null;
	let count: number | null = null;
	let error: Error | null = null;

	try {
		if (query) {
			console.time('search');
			const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN as string });
			const { data, meta } = await client.searchResults.rawList({
				filter: {
					fuzzy: false,
					query,
					build_trigger_id: process.env.DATOCMS_BUILD_TRIGGER_ID,
					locale: 'sv',
				},
				page: {
					limit: 20,
					offset: 0,
				},
			});

			results = data;
			count = meta.total_count;
			console.timeEnd('search');
		}
	} catch (e) {
		error = e as Error;
	}

	return (
		<ul className={s.search}>
			{results?.map(transformResult).map(({ id, attributes: { body_excerpt, title, url, highlight, score } }, i) => (
				<li key={i}>
					<h3>
						<Link href={url}>{title.replace('Konstpedagogik — ', '')}</Link>
					</h3>
					<div className={s.intro}>
						<Markdown content={body_excerpt} className={s.markdown} />
					</div>
					<Link href={url}>
						<Button>Läs mer</Button>
					</Link>
				</li>
			))}
		</ul>
	);
}

function transformResult(result: SearchResult): SearchResult {
	const { attributes } = result;
	const { body_excerpt, title, url } = attributes;
	const highlight = attributes.highlight;
	const score = attributes.score;

	return {
		id: result.id,
		attributes: {
			body_excerpt: transformBody(highlight?.body),
			title: title.replace('Konstpedagogik — ', ''),
			url: url.replace('https://www.konstpedagogik.se', ''),
			highlight,
			score,
		},
	} as SearchResult;
}

function transformBody(body: SearchResult['attributes']['highlight']['body']): string {
	return (
		body
			?.map((s) => {
				return s.replaceAll('[h]', '**').replaceAll('[/h]', '**');
			})
			.join('. ') ?? ''
	);
}
