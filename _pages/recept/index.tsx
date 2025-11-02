import s from './index.module.scss';
import withGlobalProps from '@/lib/withGlobalProps';
import { AllRecipeCategoriesDocument, AllRecipesDocument } from '../../graphql';
import { CardContainer, Card, Thumbnail, FilterBar } from '../../components';
import { useRouter } from 'next/router';
import { DatoSEO } from 'next-dato-utils/components';
import { pageSlugs } from '@/lib/i18n';
import { useState } from 'react';
import { set } from 'date-fns';
import { ca } from 'date-fns/locale';

export type Props = {
	recipes: (RecipeRecord & ThumbnailImage)[];
	categories: RecipeCategoryRecord[];
};

export default function Recipe({ recipes, categories }: Props) {
	const { asPath } = useRouter();
	const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

	return (
		<>
			<DatoSEO title={'Recept'} />
			{categories.length > 0 && (
				<FilterBar
					options={categories.map(({ id, title }) => ({ id, label: title }))}
					onChange={(cat) => setCategoryFilter(cat ?? null)}
				/>
			)}
			<CardContainer key={`${asPath}-${categoryFilter?.toString()}`}>
				{recipes
					.filter(
						({ category }) =>
							!categoryFilter.length || categoryFilter?.find((id) => category.find((cat) => cat.id === id))
					)
					.map(({ id, image, intro, title, slug }) => (
						<Card key={id}>
							<Thumbnail title={title} titleRows={2} intro={intro} image={image} slug={`/recept/${slug}`} />
						</Card>
					))}
			</CardContainer>
		</>
	);
}

export const getStaticProps = withGlobalProps(
	{ queries: [AllRecipesDocument, AllRecipeCategoriesDocument] },
	async ({ props, revalidate }: any) => {
		return {
			props: {
				...props,
				page: {
					section: 'recipes',
					title: 'Recept',
					slugs: pageSlugs('recipes'),
				} as PageProps,
			},
			revalidate,
		};
	}
);
