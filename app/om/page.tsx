import s from './page.module.scss';

import { apiQuery } from 'next-dato-utils/api';
import { AllAboutsDocument, AllAboutShortTextsDocument, GeneralDocument } from '@/graphql';
import { Card, CardContainer, PageHeader, Thumbnail } from '@/components';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/layout';

export type Props = {
	abouts: (AboutRecord | AboutShortTextRecord)[];
	general: GeneralRecord;
};

export default async function Abouts() {
	const [{ allAbouts }, { allAboutShortTexts }, { general }] = await Promise.all([
		apiQuery(AllAboutsDocument, { all: true }),
		apiQuery(AllAboutShortTextsDocument, { all: true }),
		apiQuery(GeneralDocument),
	]);

	return (
		<>
			<PageHeader header={general?.aboutSv} headerSmi={general?.aboutSmi} content={general?.aboutIntro} />
			<CardContainer>
				{[...allAbouts, ...allAboutShortTexts]
					.sort((a, b) => (new Date(b._createdAt).getTime() > new Date(a._createdAt).getTime() ? 1 : -1))
					.map((item) => (
						<Card key={item.id} className={s.margin}>
							<Thumbnail
								className={item.__typename === 'AboutShortTextRecord' ? 'textBox' : ''}
								title={item.__typename === 'AboutRecord' ? item.title : undefined}
								image={item.image as FileField}
								intro={item.__typename === 'AboutRecord' ? item.intro : undefined}
								slug={`/om/${item.__typename === 'AboutRecord' ? item.slug : undefined}`}
								titleRows={1}
							/>
						</Card>
					))}
			</CardContainer>
		</>
	);
}

export async function generateMetadata({ params }: PageProps<'/om'>): Promise<Metadata> {
	const { general } = await apiQuery(GeneralDocument);
	return await buildMetadata({
		title: 'Om',
		description: general?.aboutIntro,
		pathname: '/om',
	});
}
