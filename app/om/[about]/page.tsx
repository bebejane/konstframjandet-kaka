import { apiQuery } from 'next-dato-utils/api';
import { AboutDocument, AllAboutsDocument } from '@/graphql';
import { Article, BackButton } from '@/components';
import { notFound } from 'next/navigation';
import { DraftMode } from 'next-dato-utils/components';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

export type Props = {
	about: AboutRecord;
};

const noBackLinks = ['/om/in-english-verdde', '/om/samegillii-verdde'];

export default async function AboutItem({ params }: PageProps<'/om/[about]'>) {
	const { about: slug } = await params;
	const { about, draftUrl } = await apiQuery(AboutDocument, { variables: { slug } });
	if (!about) return notFound();

	const { intro, title, content, image } = about;

	return (
		<>
			<Article title={title} image={image as FileField} intro={intro} content={content} />
			{!noBackLinks.includes(`/om/${slug}`) && <BackButton href='/om'>Visa alla</BackButton>}
			<DraftMode url={draftUrl} path={`/om/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allAbouts } = await apiQuery(AllAboutsDocument);
	return allAbouts.map(({ slug: about }) => ({ about }));
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
