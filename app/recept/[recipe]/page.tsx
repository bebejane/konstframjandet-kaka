import { apiQuery } from 'next-dato-utils/api';
import { RecipeDocument, AllRecipesDocument } from '@/graphql';
import { Article, BackButton } from '@/components';
import { notFound } from 'next/navigation';
import { DraftMode } from 'next-dato-utils/components';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

export default async function RecipeItemPAge({ params }: PageProps<'/recept/[recipe]'>) {
	const { recipe: slug } = await params;
	const { recipe, draftUrl } = await apiQuery(RecipeDocument, { variables: { slug } });

	if (!recipe) return notFound();

	const { title, intro, content, image } = recipe;

	return (
		<>
			<Article title={title} image={image as FileField} intro={intro} content={content} />
			<BackButton href='/recept'>Visa alla recept</BackButton>
			<DraftMode url={draftUrl} path={`/recept/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allRecipes } = await apiQuery(AllRecipesDocument, { all: true });
	return allRecipes.map(({ slug: recipe }) => ({ recipe }));
}

export async function generateMetadata({ params }: PageProps<'/recept/[recipe]'>): Promise<Metadata> {
	const { recipe: slug } = await params;
	const { recipe } = await apiQuery(RecipeDocument, { variables: { slug } });

	return await buildMetadata({
		title: recipe?.title,
		description: recipe?.intro,
		image: recipe?.image as FileField,
		pathname: `/recept/${slug}`,
	});
}
