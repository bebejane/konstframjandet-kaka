import s from './StartExhibition.module.scss';
import React from 'react';
import { CardContainer, Card, Thumbnail } from '@/components';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export type Props = {
	data: StartExhibitionRecord & {
		exhibitions: ExhibitionRecord[];
	};
};

export default function StartExhibition({ data: { exhibitions } }: Props) {
	//const t = useTranslations();

	return (
		<div className={s.container}>
			<header>
				<h2>{/*t('Menu.exhibitions')*/}</h2>
				<Link href={'/utstallningar-och-projekt'} className='small'>
					{/*t('General.showAll')*/}
				</Link>
			</header>
			<CardContainer hideLastOnDesktop={exhibitions.length % 3 !== 0}>
				{exhibitions.map(({ id, image, intro, title, slug, year, startDate, endDate, location }) => (
					<Card key={id}>
						<Thumbnail
							image={image}
							title={title}
							intro={intro}
							meta={`${startDate ? `${formatDate(startDate, endDate)} • ` : ''}${location
								.map((l) => l.title)
								.join(', ')}`}
							slug={`/${year.title}/utstallningar-och-projekt/${slug}`}
							titleLength={50}
							titleRows={1}
						/>
					</Card>
				))}
			</CardContainer>
		</div>
	);
}
