import { apiQuery } from 'next-dato-utils/api';
import { NewsDocument, AllNewsDocument } from '@/graphql';
import { Article, BackButton } from '@/components';
import { notFound } from 'next/navigation';
import { DraftMode } from 'next-dato-utils/components';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

export type Props = {
	news: NewsRecord;
};

export default async function News({ params }: PageProps<'/pa-gang/[news]'>) {
	const { news: slug } = await params;
	const { news, draftUrl } = await apiQuery(NewsDocument, { variables: { slug } });
	if (!news) return notFound();
	const { intro, title, content, image, city } = news;
	return (
		<>
			<Article title={title} image={image as FileField} intro={intro} content={content} city={city} />
			<BackButton href='/pa-gang'>Visa alla</BackButton>
			<DraftMode url={draftUrl} path={`/pa-gang/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allNews } = await apiQuery(AllNewsDocument, { all: true });
	return allNews.map(({ slug: news }) => ({ news }));
}

export async function generateMetadata({ params }: PageProps<'/pa-gang/[news]'>): Promise<Metadata> {
	const { news: slug } = await params;
	const { news } = await apiQuery(NewsDocument, { variables: { slug } });

	return await buildMetadata({
		title: news?.title,
		image: news?.image as FileField,
		description: news?.intro,
		pathname: `/pa-gang/${slug}`,
	});
}
