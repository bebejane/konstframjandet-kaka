import { AllInterviewsDocument } from '@/graphql';
import { CardContainer, Card, Thumbnail, PageHeader } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/layout';

export default async function Interviews({ searchParams }: PageProps<'/intervjuer'>) {
	const { allInterviews } = await apiQuery(AllInterviewsDocument, { all: true });

	return (
		<>
			<CardContainer>
				{allInterviews.map(({ id, image, intro, title, slug }) => (
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
