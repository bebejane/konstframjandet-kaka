import { apiQuery } from 'next-dato-utils/api';
import { YouthDocument, AllYouthsDocument } from '@/graphql';
import { Article, BackButton } from '@/components';
import { notFound } from 'next/navigation';
import { DraftMode } from 'next-dato-utils/components';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

export default async function YouthItemPage({ params }: PageProps<'/unga/[youth]'>) {
	const { youth: slug } = await params;
	const { youth, draftUrl } = await apiQuery(YouthDocument, { variables: { slug } });

	if (!youth) return notFound();

	const { title, intro, content, image } = youth;

	return (
		<>
			<Article title={title} image={image as FileField} intro={intro} content={content} />
			<BackButton href='/unga'>Visa alla unga</BackButton>
			<DraftMode url={draftUrl} path={`/unga/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allYouths } = await apiQuery(AllYouthsDocument, { all: true });
	return allYouths.map(({ slug: youth }) => ({ youth }));
}

export async function generateMetadata({ params }: PageProps<'/unga/[youth]'>): Promise<Metadata> {
	const { youth: slug } = await params;
	const { youth } = await apiQuery(YouthDocument, { variables: { slug } });

	return await buildMetadata({
		title: youth?.title,
		description: youth?.intro,
		image: youth?.image as FileField,
		pathname: `/unga/${slug}`,
	});
}
