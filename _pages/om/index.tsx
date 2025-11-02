import s from './[about].module.scss';
import withGlobalProps from '@/lib/withGlobalProps';
import { apiQuery } from 'next-dato-utils/api';
import { MainAboutDocument } from '../../graphql';
import { pageSlugs } from '@/lib/i18n';

export { default } from './[about]';

export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {
	const { abouts } = await apiQuery(MainAboutDocument, { preview: context.preview });
	const about = abouts[0] ?? null;

	if (!about) return { notFound: true };

	return {
		props: {
			...props,
			about,
			page: {
				section: 'about',
				title: about.title,
				slugs: pageSlugs('about', about._allSlugLocales),
			} as PageProps,
		},
		revalidate,
	};
});
