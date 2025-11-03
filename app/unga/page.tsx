import s from './page.module.scss';
import { AllYouthsCategoriesDocument, AllYouthsDocument } from '@/graphql';
import { CardContainer, Card, Thumbnail } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import { createLoader, parseAsString } from 'nuqs/server';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/layout';
import FilterBar from '@/components/common/FilterBar';

const filterSearchParams = { filter: parseAsString };
const loadSearchParams = createLoader(filterSearchParams);

export default async function YouthPage({ searchParams }: PageProps<'/unga'>) {
	const { filter } = await loadSearchParams(searchParams);
	const { allYouths } = await apiQuery(AllYouthsDocument, { all: true });
	const { allYouthCategories } = await apiQuery(AllYouthsCategoriesDocument, { all: true });

	return (
		<>
			{allYouthCategories.length > 0 && (
				<FilterBar
					key={'filter'}
					value={filter}
					pathname={'/unga'}
					options={allYouthCategories.map(({ slug: value, title: label }) => ({ value, label }))}
				/>
			)}
			<CardContainer key={filter} filter={true}>
				{allYouths
					.filter(({ category }) => !filter || category.find((cat) => cat.slug === filter))
					.map(({ id, image, intro, title, slug }) => (
						<Card key={id}>
							<Thumbnail title={title} titleRows={2} intro={intro} image={image as FileField} slug={`/unga/${slug}`} />
						</Card>
					))}
			</CardContainer>
		</>
	);
}

export async function generateMetadata({ params }: PageProps<'/unga'>): Promise<Metadata> {
	return await buildMetadata({
		title: 'Unga',
		pathname: '/unga',
	});
}
