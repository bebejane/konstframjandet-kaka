import s from './page.module.scss';
import { AllRecipeCategoriesDocument, AllRecipesDocument } from '@/graphql';
import { CardContainer, Card, Thumbnail, PageHeader } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import { createLoader, parseAsString } from 'nuqs/server';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/layout';
import FilterBar from '@/components/common/FilterBar';

const filterSearchParams = { filter: parseAsString };
const loadSearchParams = createLoader(filterSearchParams);

export default async function Recipes({ searchParams }: PageProps<'/recept'>) {
	const { filter } = await loadSearchParams(searchParams);
	const { allRecipes } = await apiQuery(AllRecipesDocument, { all: true });
	const { allRecipeCategories } = await apiQuery(AllRecipeCategoriesDocument, { all: true });

	return (
		<>
			{allRecipeCategories.length > 0 && (
				<FilterBar
					value={filter}
					pathname={'/recept'}
					options={allRecipeCategories.map(({ slug: value, title: label }) => ({ value, label }))}
				/>
			)}
			<CardContainer key={filter}>
				{allRecipes
					.filter(({ category }) => !filter || category.find((cat) => cat.slug === filter))
					.map(({ id, image, intro, title, slug }) => (
						<Card key={id}>
							<Thumbnail
								title={title}
								titleRows={2}
								intro={intro}
								image={image as FileField}
								slug={`/recept/${slug}`}
							/>
						</Card>
					))}
			</CardContainer>
		</>
	);
}

export async function generateMetadata({ params }: PageProps<'/recept'>): Promise<Metadata> {
	return await buildMetadata({
		title: 'Recept',
		pathname: '/recept',
	});
}
