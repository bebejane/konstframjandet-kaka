import withGlobalProps from '@/lib/withGlobalProps';
import { apiQuery } from 'next-dato-utils/api';
import { apiQueryAll } from '@/lib/utils';
import { RecipeDocument, AllRecipesDocument } from '../../graphql';
import { Article, BackButton } from '../../components';
import { DatoSEO } from 'next-dato-utils/components';
import { pageSlugs } from '@/lib/i18n';

export type Props = {
	recipe: RecipeRecord;
};

export default function Recipe({ recipe: { id, image, title, intro, content, _seoMetaTags } }: Props) {
	return (
		<>
			<DatoSEO title={title} description={intro} seo={_seoMetaTags} />
			<Article id={id} key={id} title={title} image={image} intro={intro} content={content} onClick={(imageId) => {}} />
			<BackButton href={'/recept'}>Visa alla recept</BackButton>
		</>
	);
}

export async function getStaticPaths() {
	const { recipes } = await apiQueryAll(AllRecipesDocument);
	const paths = recipes.map(({ slug }) => ({ params: { recipe: slug } }));

	return {
		paths,
		fallback: 'blocking',
	};
}

export const getStaticProps = withGlobalProps({ queries: [] }, async ({ props, revalidate, context }: any) => {
	const slug = context.params.recipe;
	const { recipe } = await apiQuery(RecipeDocument, {
		variables: { slug, locale: context.locale },
		preview: context.preview,
	});

	if (!recipe) return { notFound: true };

	return {
		props: {
			...props,
			recipe,
			page: {
				section: 'recipes',
				parent: true,
				title: recipe.title,
				slugs: pageSlugs('recipes'),
			} as PageProps,
		},
		revalidate,
	};
});
