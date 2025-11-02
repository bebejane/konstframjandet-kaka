import { InEnglishDocument } from '@/graphql';
import { Article, PageHeader } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';
import { DraftMode } from 'next-dato-utils/components';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

export default async function InEnglish() {
	const { inEnglish, draftUrl } = await apiQuery(InEnglishDocument);

	if (!inEnglish) return notFound();
	const { image, intro, content, title } = inEnglish;

	return (
		<>
			<Article title={title} image={image as FileField} intro={intro} content={content} />
			<DraftMode url={draftUrl} path={`/kontakt`} />
		</>
	);
}

export async function generateMetadata({ params }: PageProps<'/in-english'>): Promise<Metadata> {
	const { inEnglish } = await apiQuery(InEnglishDocument);

	return await buildMetadata({
		title: 'In English',
		description: inEnglish?.intro,
		image: inEnglish?.image as FileField,
		pathname: '/in-english',
	});
}
