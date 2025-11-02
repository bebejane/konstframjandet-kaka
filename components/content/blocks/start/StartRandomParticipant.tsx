import s from './StartRandomParticipant.module.scss';
import React from 'react';
import { CardContainer, Card, Thumbnail } from '@/components';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export type Props = {
	data: StartRandomParticipantRecord & {
		interviews: ParticipantRecord[];
	};
};

export default function StartRandomParticipant({ data: { interviews } }: Props) {
	//const t = useTranslations();

	return (
		<div className={s.container}>
			<header>
				<h2>{t('Menu.interviews')}</h2>
				<Link href={'/medverkande'} className='small'>
					{t('General.showAll')}
				</Link>
			</header>
			<CardContainer hideLastOnDesktop={interviews.length % 3 !== 0}>
				{interviews.map(({ id, image, intro, name, slug, year }) => (
					<Card key={id}>
						<Thumbnail
							image={image}
							title={name}
							intro={intro}
							slug={`/${year.title}/medverkande/${slug}`}
							titleLength={50}
							titleRows={1}
						/>
					</Card>
				))}
			</CardContainer>
		</div>
	);
}
