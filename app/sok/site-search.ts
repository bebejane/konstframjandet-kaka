'use server';

import { apiQuery } from 'next-dato-utils/api';
import { buildClient } from '@datocms/cma-client';
import { SiteSearchDocument } from '@/graphql';
import { truncateWords } from '@/lib/utils';
import config from '@/datocms.config';

type ModelApiKey = 'about' | 'youth' | 'interview' | 'tip' | 'recipe';
type ModelTypename = 'AboutRecord' | 'YouthRecord' | 'InterviewRecord' | 'TipRecord' | 'RecipeRecord';

export type Model = {
	api_key: ModelApiKey;
	__typename: ModelTypename;
};

export type SearchResult = {
	[index: string]: {
		__typename: ModelTypename;
		_apiKey: ModelApiKey;
		category: string;
		title: string;
		text: string;
		href: string;
	}[];
};

const models: Model[] = [
	{ api_key: 'about', __typename: 'AboutRecord' },
	{ api_key: 'youth', __typename: 'YouthRecord' },
	{ api_key: 'interview', __typename: 'InterviewRecord' },
	{ api_key: 'tip', __typename: 'TipRecord' },
	{ api_key: 'recipe', __typename: 'RecipeRecord' },
];

export async function siteSearch(q: string): Promise<SearchResult> {
	try {
		return await search(q);
	} catch (error) {
		throw error;
	}
}

async function search(q: string): Promise<SearchResult> {
	if (!q) return {};
	console.log('search', q);
	const query = `${q
		.split(' ')
		.filter((el) => el)
		.join('|')}`;

	const variables = { query };

	if (!Object.keys(variables).length) return {};

	const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN as string });
	const itemTypes = await client.itemTypes.list();

	const s = (
		await client.items.list({
			filter: { type: itemTypes.map((m) => m.api_key).join(','), query: q },
			order_by: '_rank_DESC',
			allPages: true,
		})
	).map((el) => ({
		...el,
		_api_key: itemTypes.find((t) => t.id === el.item_type.id)?.api_key,
	}));

	const data: { [key: string]: any[] } = {};
	const first = 100;

	for (let i = 0; i < search.length; i += first) {
		const chunk = s.slice(i, first - 1);
		const variables: any = models.reduce<any>(
			(acc, model) => {
				const ids = chunk.filter((el) => el._api_key === model.api_key).map((el) => el.id);
				if (ids.length) acc[`${model.api_key}Ids}`] = ids;
				return acc;
			},
			{ first, skip: i }
		);

		type CleanQuery = Omit<SiteSearchQuery, 'draftUrl' | '__typename'>;
		const res = await apiQuery(SiteSearchDocument, { variables });
		console.log(res);
		const result = (Object.keys(res) as Array<keyof typeof res>).reduce(
			(acc, key) => {
				if (key === 'draftUrl' || key === '__typename') {
					//@ts-ignore
					delete acc[key];
				}
				return acc;
			},
			{ ...res } as CleanQuery
		);

		(Object.keys(result) as Array<keyof typeof result>).forEach((k) => {
			data[k] = data[k] ?? [];
			data[k] = [...data[k], ...result[k]];
		});
	}

	for (const type in data) {
		if (!data[type].length) {
			delete data[type];
			continue;
		}

		for (let i = 0; i < data[type].length; i++) {
			const el = data[type][i];
			data[type][i] = {
				__typename: el.__typename,
				_modelApiKey: el._modelApiKey,
				category: itemTypes.find(({ api_key }) => api_key === el._modelApiKey)?.name,
				title: el.title,
				text: truncateWords(el.text, 200),
				href: (await config.routes[el._modelApiKey as keyof typeof config.routes](el))?.[0],
			};
		}
	}

	return data;
}
