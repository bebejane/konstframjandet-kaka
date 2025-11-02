import { apiQuery } from 'next-dato-utils/api';
import { InterviewDocument, AllInterviewsDocument } from '@/graphql';
import { Article, BackButton } from '@/components';
import { notFound } from 'next/navigation';
import { DraftMode } from 'next-dato-utils/components';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

export default async function InterviewItemPage({ params }: PageProps<'/intervjuer/[interview]'>) {
	const { interview: slug } = await params;
	const { interview, draftUrl } = await apiQuery(InterviewDocument, { variables: { slug } });

	if (!interview) return notFound();

	const { title, intro, content, image } = interview;

	return (
		<>
			<Article title={title} image={image as FileField} intro={intro} content={content} />
			<BackButton href='/intervjuer'>Visa alla intervjuer</BackButton>
			<DraftMode url={draftUrl} path={`/intervjuer/${slug}`} />
		</>
	);
}

export async function generateStaticParams() {
	const { allInterviews } = await apiQuery(AllInterviewsDocument, { all: true });
	return allInterviews.map(({ slug: interview }) => ({ interview }));
}

export async function generateMetadata({ params }: PageProps<'/intervjuer/[interview]'>): Promise<Metadata> {
	const { interview: slug } = await params;
	const { interview } = await apiQuery(InterviewDocument, { variables: { slug } });

	return await buildMetadata({
		title: interview?.title,
		description: interview?.intro,
		image: interview?.image as FileField,
		pathname: `/intervjuer/${slug}`,
	});
}
