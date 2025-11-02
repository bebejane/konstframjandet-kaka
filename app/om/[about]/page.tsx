import { apiQuery } from 'next-dato-utils/api';
import { AboutDocument, AllAboutsDocument } from '@/graphql';
import { Article, BackButton } from '@/components';
import { notFound } from 'next/navigation';
import { DraftMode } from 'next-dato-utils/components';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

export default async function AboutItemPage({ params }: PageProps<'/om/[about]'>) {
	const { about: slug } = await params;
	const { about, draftUrl } = await apiQuery(AboutDocument, { variables: { slug } });

	if (!about) return notFound();

	const { title, intro, content, image } = about;

	return (
		<>
			<Article title={title} image={image as FileField} intro={intro} content={content} />
			<BackButton href='/om'>Visa alla artiklar om oss</BackButton>
			<DraftMode url={draftUrl} path={`/om/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allAbouts } = await apiQuery(AllAboutsDocument, { all: true });
	return allAbouts.map(({ slug: intervju }) => ({ intervju }));
}

export async function generateMetadata({ params }: PageProps<'/om/[about]'>): Promise<Metadata> {
	const { about: slug } = await params;
	const { about } = await apiQuery(AboutDocument, { variables: { slug } });

	return await buildMetadata({
		title: about?.title,
		description: about?.intro,
		image: about?.image as FileField,
		pathname: `/om/${slug}`,
	});
}
