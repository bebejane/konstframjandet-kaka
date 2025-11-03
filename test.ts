import 'dotenv/config';
import { buildClient } from '@datocms/cma-client-node';

const buildTriggerId = process.env.DATOCMS_BUILD_TRIGGER_ID as string;
const client = buildClient({ apiToken: process.env.DATOCMS_API_TOKEN as string });

async function run() {
	console.log('Rebuild');
	const res = await client.buildTriggers.reindex(buildTriggerId);
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

//search('Gävleborg');
run();
