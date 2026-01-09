import { AllInterviewsDocument, AllInterviewsCategoriesDocument } from '@/graphql';
import { CardContainer, Card, Thumbnail } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import { createLoader, parseAsString } from 'nuqs/server';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/layout';
import FilterBar from '@/components/common/FilterBar';

const filterSearchParams = { filter: parseAsString };
const loadSearchParams = createLoader(filterSearchParams);

export default async function Interviews({ searchParams }: PageProps<'/intervjuer'>) {
	const { filter } = await loadSearchParams(searchParams);
	const { allInterviews } = await apiQuery(AllInterviewsDocument, { all: true });
	const { allInterviewCategories } = await apiQuery(AllInterviewsCategoriesDocument, { all: true });

	return (
		<>
			{allInterviewCategories && allInterviewCategories.length > 0 && (
				<FilterBar
					value={filter}
					pathname={'/intervjuer'}
					options={allInterviewCategories.map(({ slug: value, title: label }) => ({ value, label }))}
				/>
			)}
			<CardContainer key={filter} filter={true}>
				{allInterviews
					.filter(({ category }) => !filter || category?.find((cat) => cat.slug === filter))
					.map(({ id, image, intro, title, slug }) => (
						<Card key={id}>
							<Thumbnail
								title={title}
								titleRows={2}
								intro={intro}
								image={image as FileField}
								slug={`/intervjuer/${slug}`}
							/>
						</Card>
					))}
			</CardContainer>
		</>
	);
}

export async function generateMetadata({ params }: PageProps<'/intervjuer'>): Promise<Metadata> {
	return await buildMetadata({
		title: 'Intervjuer',
		pathname: '/intervjuer',
	});
}
