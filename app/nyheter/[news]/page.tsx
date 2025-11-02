import { apiQuery } from 'next-dato-utils/api';
import { NewsDocument, AllNewsDocument } from '@/graphql';
import { Article, BackButton } from '@/components';
import { notFound } from 'next/navigation';
import { DraftMode } from 'next-dato-utils/components';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

export default async function NewsItem({ params }: PageProps<'/nyheter/[news]'>) {
	const { news: slug } = await params;
	const { news, draftUrl } = await apiQuery(NewsDocument, { variables: { slug } });
	if (!news) return notFound();

	const { intro, title, content, image } = news;

	return (
		<>
			<Article title={title} image={image as FileField} intro={intro} content={content} />
			<DraftMode url={draftUrl} path={`/nyheter/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allNews } = await apiQuery(AllNewsDocument);
	return allNews.map(({ slug: news }) => ({ news }));
}

export async function generateMetadata({ params }: PageProps<'/nyheter/[news]'>): Promise<Metadata> {
	const { news: slug } = await params;
	const { news } = await apiQuery(NewsDocument, { variables: { slug } });

	return await buildMetadata({
		title: news?.title,
		description: news?.intro,
		image: news?.image as FileField,
		pathname: `/nyheter/${slug}`,
	});
}
