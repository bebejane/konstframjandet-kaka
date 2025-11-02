import s from './page.module.scss';
import { apiQuery } from 'next-dato-utils/api';
import { AllParticipantsDocument, AllPartnersDocument, AllProgramsDocument, WhatWeDoDocument } from '@/graphql';
import { Article, BackButton, Related, Content } from '@/components';
import { categories } from '@/lib/constant';
import { notFound } from 'next/navigation';
import { RelatedItem } from '@/components/common/Related';
import { DraftMode } from 'next-dato-utils/components';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

export default async function WhatWeDo({ params }: PageProps<'/vad-vi-gor/[...slug]'>) {
	const {
		slug: [category, slug],
	} = await params;

	const { id, post, draftUrl, title, intro, content, image, partners, participants, programs } =
		await getPostData(slug);

	return (
		<>
			<Article key={id} title={title} image={image as FileField} intro={intro} content={content}>
				{post.__typename === 'ParticipantRecord' && (
					<div className={s.works}>
						<div className='works small'>
							<Content id={id} content={post.works} />
						</div>
					</div>
				)}
			</Article>
			{participants.length > 0 && <Related header='Utövare' items={participants as RelatedItem[]} />}
			{programs.length > 0 && <Related header='Aktivitet' items={programs as RelatedItem[]} />}
			{partners.length > 0 && <Related header='Samverkan' items={partners as RelatedItem[]} />}
			<BackButton href='/vad-vi-gor'>Visa alla</BackButton>
			<DraftMode url={draftUrl} path={`/vad-vi-gor/${category}/${slug}`} />
		</>
	);
}

const getPostData = async (slug: string) => {
	const { program, partner, participant, draftUrl } = await apiQuery(WhatWeDoDocument, {
		variables: { slug },
	});

	if (!participant && !program && !partner) return notFound();

	const post = participant || program || partner;
	if (!post) return notFound();

	const { __typename, id, intro, content, image } = post;
	const title = post.title;
	const partners = __typename === 'ProgramRecord' ? post.partner : [];
	const participants = __typename === 'ProgramRecord' ? post.partipants : [];
	const programs =
		__typename === 'PartnerRecord'
			? post._allReferencingPrograms
			: __typename === 'ParticipantRecord'
				? post._allReferencingPrograms
				: [];

	return {
		post,
		title,
		intro,
		content,
		image,
		partners,
		participants,
		programs,
		__typename,
		id,
		draftUrl,
	};
};

export async function generateStaticParams() {
	const [{ allParticipants }, { allPrograms }, { allPartners }] = await Promise.all([
		apiQuery(AllParticipantsDocument, { all: true }),
		apiQuery(AllProgramsDocument, { all: true }),
		apiQuery(AllPartnersDocument, { all: true }),
	]);

	return [...allParticipants, ...allPrograms, ...allPartners].map(({ slug, __typename }) => ({
		slug: [categories.find((c) => c.__typename === __typename)?.slug, slug],
	}));
}

export async function generateMetadata({ params }: PageProps<'/vad-vi-gor/[...slug]'>): Promise<Metadata> {
	const {
		slug: [category, slug],
	} = await params;

	const { title, post } = await getPostData(slug);
	return await buildMetadata({
		title,
		image: post?.image as FileField,
		description: post?.intro,
		pathname: `/vad-vi-gor/${category}/${slug}`,
	});
}
