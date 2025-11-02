import withGlobalProps from '@/lib/withGlobalProps';
import { apiQuery } from 'next-dato-utils/api';
import { apiQueryAll } from '@/lib/utils';
import { InterviewDocument, AllInterviewsDocument } from '../../graphql';
import { Article, BackButton } from '../../components';
import { DatoSEO } from 'next-dato-utils/components';
import { pageSlugs } from '@/lib/i18n';

export type Props = {
	interview: InterviewRecord;
};

export default function Interview({ interview: { id, image, title, intro, content, _seoMetaTags } }: Props) {
	return (
		<>
			<DatoSEO title={title} description={intro} seo={_seoMetaTags} />
			<Article id={id} key={id} title={title} image={image} intro={intro} content={content} onClick={(imageId) => {}} />

			<BackButton>Visa alla intervjuer</BackButton>
		</>
	);
}

export async function getStaticPaths() {
	const { interviews } = await apiQueryAll(AllInterviewsDocument);
	const paths = interviews.map(({ slug }) => ({ params: { interview: slug } }));

	return {
		paths,
		fallback: 'blocking',
	};
}

export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {
	const slug = context.params.interview;
	const { interview } = await apiQuery(InterviewDocument, { variables: { slug }, preview: context.preview });

	if (!interview) return { notFound: true };

	return {
		props: {
			...props,
			interview,
			page: {
				section: 'interviews',
				parent: true,
				title: interview.title,
				slugs: pageSlugs('interviews', interview._allSlugLocales),
			} as PageProps,
		},
		revalidate,
	};
});
