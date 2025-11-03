import 'dotenv/config';
import { buildClient } from '@datocms/cma-client-node';

const buildTriggerId = '33120';
const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN as string });

async function run() {
	console.log('Rebuild');
	console.time('Rebuild');
	const res = await client.buildTriggers.reindex(buildTriggerId);
	console.log(res);
	console.timeEnd('Rebuild');
}

async function search(query: string) {
	const { data: searchResults, meta } = await client.searchResults.rawList({
		filter: {
			fuzzy: true,
			query,
			build_trigger_id: buildTriggerId,
			locale: 'sv',
		},
		page: {
			limit: 20,
			offset: 0,
		},
	});

	console.log(JSON.stringify(searchResults, null, 2));
}

search('Gävleborg');
//run();
