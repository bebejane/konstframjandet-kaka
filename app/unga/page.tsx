import s from './page.module.scss';
import { AllTipsCategoriesDocument, AllTipsDocument } from '@/graphql';
import { CardContainer, Card, Thumbnail, PageHeader } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import { createLoader, parseAsString } from 'nuqs/server';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/layout';
import FilterBar from '@/components/common/FilterBar';

const filterSearchParams = { filter: parseAsString };
const loadSearchParams = createLoader(filterSearchParams);

export default async function Tips({ searchParams }: PageProps<'/tips'>) {
	const { filter } = await loadSearchParams(searchParams);
	const { allTips } = await apiQuery(AllTipsDocument, { all: true });
	const { allTipCategories } = await apiQuery(AllTipsCategoriesDocument, { all: true });

	return (
		<>
			{allTipCategories.length > 0 && (
				<FilterBar
					value={filter}
					pathname={'/tips'}
					options={allTipCategories.map(({ slug: value, title: label }) => ({ value, label }))}
				/>
			)}
			<CardContainer key={filter}>
				{allTips
					.filter(({ category }) => !filter || category.find((cat) => cat.slug === filter))
					.map(({ id, image, intro, name, slug }) => (
						<Card key={id}>
							<Thumbnail title={name} titleRows={2} intro={intro} image={image as FileField} slug={`/tips/${slug}`} />
						</Card>
					))}
			</CardContainer>
		</>
	);
}

export async function generateMetadata({ params }: PageProps<'/tips'>): Promise<Metadata> {
	return await buildMetadata({
		title: 'Tips',
		pathname: '/tips',
	});
}
