import { apiQuery } from 'next-dato-utils/api';
import { TipDocument, AllTipsDocument } from '@/graphql';
import { Article, BackButton } from '@/components';
import { notFound } from 'next/navigation';
import { DraftMode } from 'next-dato-utils/components';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

export default async function TipItemPage({ params }: PageProps<'/tips/[tip]'>) {
	const { tip: slug } = await params;
	const { tip, draftUrl } = await apiQuery(TipDocument, { variables: { slug } });

	if (!tip) return notFound();

	const { title, intro, content, image } = tip;

	return (
		<>
			<Article title={title} image={image as FileField} intro={intro} content={content} />
			<BackButton href='/tips'>Visa alla tips</BackButton>
			<DraftMode url={draftUrl} path={`/tips/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allTips } = await apiQuery(AllTipsDocument, { all: true });
	return allTips.map(({ slug: tip }) => ({ tip }));
}

export async function generateMetadata({ params }: PageProps<'/tips/[tip]'>): Promise<Metadata> {
	const { tip: slug } = await params;
	const { tip } = await apiQuery(TipDocument, { variables: { slug } });

	return await buildMetadata({
		title: tip?.title,
		description: tip?.intro,
		image: tip?.image as FileField,
		pathname: `/tips/${slug}`,
	});
}
