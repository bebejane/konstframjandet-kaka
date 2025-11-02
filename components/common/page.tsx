import s from './page.module.scss';

import {
	AllPartnersDocument,
	AllParticipantsDocument,
	AllProgramsDocument,
	AllShortTextsDocument,
	GeneralDocument,
} from '@/graphql';
import { CardContainer, Card, Thumbnail, PageHeader } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import { categories } from '@/lib/constant';
import Link from 'next/link';
import { parseAsString, createLoader } from 'nuqs/server';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

const filterSearchParams = { filter: parseAsString };
const loadSearchParams = createLoader(filterSearchParams);

export default async function WhatWeDo({ searchParams }: PageProps<'/vad-vi-gor'>) {
	const { filter } = await loadSearchParams(searchParams);
	const [{ allParticipants }, { allPrograms }, { allPartners }, { allShortTexts }, { general }] = await Promise.all([
		apiQuery(AllParticipantsDocument, { all: true }),
		apiQuery(AllProgramsDocument, { all: true }),
		apiQuery(AllPartnersDocument, { all: true }),
		apiQuery(AllShortTextsDocument, { all: true }),
		apiQuery(GeneralDocument),
	]);

	const posts = [...allParticipants, ...allPrograms, ...allPartners, ...allShortTexts]
		.sort((a, b) => (new Date(b._createdAt).getTime() > new Date(a._createdAt).getTime() ? 1 : -1))
		.filter((item) => !filter || categories.find((c) => c.__typename === item.__typename)?.title === filter);

	return (
		<>
			<PageHeader header={general?.whatSv} headerSmi={general?.whatSmi} content={general?.whatIntro} />
			<ul className={s.filter}>
				{categories.map(({ title, slug }) => (
					<Link
						key={slug}
						href={{
							pathname: `/vad-vi-gor`,
							query: { filter: title !== filter ? title : undefined },
						}}
					>
						<li className={title === filter ? s.active : undefined} key={slug}>
							{title}
						</li>
					</Link>
				))}
			</ul>
			<CardContainer key={filter}>
				{posts.map((item) => (
					<Card key={item.id}>
						<Thumbnail
							className={item.__typename === 'ShortTextRecord' ? 'textBox' : ''}
							title={item.__typename !== 'ShortTextRecord' ? item.title : undefined}
							category={categories.find((c) => c.__typename === item.__typename)?.title}
							date={item.__typename === 'ProgramRecord' ? item.startDate : null}
							image={item.image as FileField}
							city={item.__typename === 'PartnerRecord' ? item.city : undefined}
							slug={
								item.__typename !== 'ShortTextRecord'
									? `/vad-vi-gor/${categories.find((c) => c.__typename === item.__typename)?.slug}/${item.slug}`
									: undefined
							}
							titleRows={1}
						/>
					</Card>
				))}
			</CardContainer>
		</>
	);
}

export async function generateMetadata({ params }: PageProps<'/vad-vi-gor'>): Promise<Metadata> {
	const { general } = await apiQuery(GeneralDocument);
	return buildMetadata({
		title: 'Vad vi gör',
		description: general?.whatIntro,
		pathname: '/vad-vi-gor',
	});
}
