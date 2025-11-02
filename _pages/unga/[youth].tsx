import withGlobalProps from '@/lib/withGlobalProps';
import { apiQuery } from 'next-dato-utils/api';
import { apiQueryAll, translatePath } from '@/lib/utils';
import { YouthDocument, AllYouthsDocument } from '../../graphql';
import { Article, Related, BackButton, MetaSection } from '../../components';
import { DatoSEO } from 'next-dato-utils/components';
import { pageSlugs } from '@/lib/i18n';

export type Props = {
	youth: YouthRecord;
};

export default function Youth({ youth: { id, image, title, intro, content, _seoMetaTags } }: Props) {
	return (
		<>
			<DatoSEO title={title} description={intro} seo={_seoMetaTags} />
			<Article
				id={id}
				key={id}
				title={title}
				image={image}
				intro={intro}
				imageSize='small'
				content={content}
				onClick={(imageId) => {}}
			/>
			<BackButton href={'/unga'}>Visa alla unga</BackButton>
		</>
	);
}

export async function getStaticPaths() {
	const { youths } = await apiQueryAll(AllYouthsDocument);
	const paths = youths.map(({ slug }) => ({ params: { youth: slug } }));

	return {
		paths,
		fallback: 'blocking',
	};
}

export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {
	const slug = context.params.youth;
	const { youth } = await apiQuery(YouthDocument, {
		variables: { slug, locale: context.locale },
		preview: context.preview,
	});

	if (!youth) return { notFound: true };

	return {
		props: {
			...props,
			youth,
			page: {
				section: 'youths',
				parent: true,
				title: youth.title,
				slugs: pageSlugs('youths', youth._allSlugLocales),
			} as PageProps,
		},
		revalidate,
	};
});
