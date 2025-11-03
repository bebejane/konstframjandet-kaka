import { AllTipsDocument } from '@/graphql';
import { CardContainer, Card, Thumbnail } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/layout';

export default async function TipsPage({}: PageProps<'/tips'>) {
	const { allTips } = await apiQuery(AllTipsDocument, { all: true });
	return null;
	return (
		<CardContainer>
			{allTips.map(({ id, image, intro, name, slug }) => (
				<Card key={id}>
					<Thumbnail title={name} titleRows={2} intro={intro} image={image as FileField} slug={`/tips/${slug}`} />
				</Card>
			))}
		</CardContainer>
	);
}

export async function generateMetadata({ params }: PageProps<'/tips'>): Promise<Metadata> {
	return await buildMetadata({
		title: 'Tips',
		pathname: '/tips',
	});
}
