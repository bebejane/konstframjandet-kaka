import { apiQuery } from 'next-dato-utils/api';
import { MainAboutDocument } from '@/graphql';
import { Article, BackButton } from '@/components';
import { notFound } from 'next/navigation';
import { DraftMode } from 'next-dato-utils/components';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

export default async function AboutPage({ params }: PageProps<'/om'>) {
	const { allAbouts, draftUrl } = await apiQuery(MainAboutDocument);
	const about = allAbouts[0] ?? null;

	if (!about) return notFound();
	const { intro, title, content, image } = about;

	return (
		<>
			<Article title={title} image={image as FileField} intro={intro} content={content} />
			<DraftMode url={draftUrl} path={`/om`} />
		</>
	);
}

export async function generateMetadata({ params }: PageProps<'/om'>): Promise<Metadata> {
	const { allAbouts, draftUrl } = await apiQuery(MainAboutDocument);
	const about = allAbouts[0] ?? null;

	return await buildMetadata({
		title: about?.title,
		description: about?.intro,
		image: about?.image as FileField,
		pathname: `/om`,
	});
}
