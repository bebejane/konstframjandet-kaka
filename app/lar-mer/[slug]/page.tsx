import { apiQuery } from 'next-dato-utils/api';
import { LearnMoreDocument, AllLearnMoreDocument } from '@/graphql';
import { Article, BackButton } from '@/components';
import { notFound } from 'next/navigation';
import { DraftMode } from 'next-dato-utils/components';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

export default async function WhatWeDo({ params }: PageProps<'/lar-mer/[slug]'>) {
	const { slug } = await params;
	const { learnMore, draftUrl } = await apiQuery(LearnMoreDocument, { variables: { slug } });

	if (!learnMore) return notFound();

	const { intro, name, content, image } = learnMore;
	return (
		<>
			<Article title={name} image={image as FileField} intro={intro} content={content} />
			<BackButton href='/lar-mer'>Visa alla</BackButton>
			<DraftMode url={draftUrl} path={`/lar-mer/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allLearnMores } = await apiQuery(AllLearnMoreDocument, { all: true });
	return allLearnMores.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<'/lar-mer/[slug]'>): Promise<Metadata> {
	const { slug } = await params;
	const { learnMore } = await apiQuery(LearnMoreDocument, { variables: { slug } });

	return await buildMetadata({
		title: learnMore?.name,
		description: learnMore?.intro,
		image: learnMore?.image as FileField,
		pathname: `/lar-mer/${slug}`,
	});
}
