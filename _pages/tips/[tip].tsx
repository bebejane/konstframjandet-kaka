import withGlobalProps from '@/lib/withGlobalProps';
import { apiQuery } from 'next-dato-utils/api';
import { apiQueryAll } from '@/lib/utils';
import { TipDocument, AllTipsDocument } from '../../graphql';
import { Article, BackButton } from '../../components';
import { DatoSEO } from 'next-dato-utils/components';
import { pageSlugs } from '@/lib/i18n';

export type Props = {
	tip: TipRecord;
};

export default function Tip({ tip: { id, image, name, intro, content, _seoMetaTags } }: Props) {
	return (
		<>
			<DatoSEO title={name} description={intro} seo={_seoMetaTags} />
			<Article id={id} key={id} title={name} image={image} intro={intro} content={content} onClick={(imageId) => {}} />
			<BackButton href={'/tips'}>Visa alla tips</BackButton>
		</>
	);
}

export async function getStaticPaths() {
	const { tips } = await apiQueryAll(AllTipsDocument);
	const paths = tips.map(({ slug }) => ({ params: { tip: slug } }));

	return {
		paths,
		fallback: 'blocking',
	};
}

export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {
	const slug = context.params.tip;
	const { tip } = await apiQuery(TipDocument, {
		variables: { slug, locale: context.locale },
		preview: context.preview,
	});

	if (!tip) return { notFound: true };

	return {
		props: {
			...props,
			tip,
			page: {
				section: 'tips',
				parent: true,
				overview: '/tips',
				title: tip.name,
				slugs: pageSlugs('tips', tip._allSlugLocales),
			} as PageProps,
		},
		revalidate,
	};
});
