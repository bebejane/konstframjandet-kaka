import { withRevalidate } from 'next-dato-utils/hoc';

export default withRevalidate(async (record, revalidate) => {
	const { api_key: apiKey } = record.model;
	const { slug } = record;
	const paths = [];

	switch (apiKey) {
		case 'general':
			paths.push(`/`);
			break;
		case 'start':
			paths.push('/');
			break;
		case 'about':
			paths.push(`/om/${slug}`);
			break;
		case 'news':
			paths.push('/nyheter');
			paths.push(`/nyheter/${slug}`);
			break;
		case 'interview':
			paths.push('/intervjuer');
			paths.push(`/intervjuer/${slug}`);
			break;
		case 'interview_category':
			paths.push('/intervjuer');
			break;
		case 'youth':
			paths.push('/unga');
			paths.push(`/unga/${slug}`);
			break;
		case 'youth_category':
			paths.push('/unga');
			break;
		case 'recipe':
			paths.push('/recept');
			paths.push(`/recept/${slug}`);
			break;
		case 'recipe_category':
			paths.push('/recept');
			break;
		case 'tip':
			paths.push('/tips');
			paths.push(`/tips/${slug}`);
			break;
		case 'tip_category':
			paths.push('/tips');
			break;
		case 'contact':
			paths.push(`/kontakt`);
			break;
		case 'in_english':
			paths.push(`/in-english`);
			break;
		default:
			throw new Error(`Unknown api_key: ${apiKey}`);
	}

	revalidate(paths);
});
