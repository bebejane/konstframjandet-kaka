import s from './page.module.scss';
import { AllNewsDocument, GeneralDocument } from '@/graphql';
import { Card, CardContainer, PageHeader, Thumbnail } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import { isSameDay } from 'date-fns';
import { DraftMode } from 'next-dato-utils/components';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

export default async function News() {
	const { allNews } = await apiQuery(AllNewsDocument, { all: true });
	const { general } = await apiQuery(GeneralDocument);

	const currentNews = allNews
		.filter(({ title, date, endDate }) => {
			const t = new Date();
			const s = new Date(date);
			const e = new Date(endDate);
			t.setHours(0, 0, 0, 0);
			s.setHours(0, 0, 0, 0);
			e.setHours(23, 59, 59, 999);
			return endDate ? e >= t : isSameDay(t, s) || s > t;
		})
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

	const pastNews = allNews
		.filter(({ id }) => !currentNews.find(({ id: currentId }) => currentId === id))
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return (
		<>
			<PageHeader header={general?.newsSv} headerSmi={general?.newsSmi} content={general?.newsIntro} />
			<CardContainer>
				{currentNews.map(({ id, title, date, endDate, image, slug, city }) => (
					<Card key={id}>
						<Thumbnail
							title={title}
							image={image as FileField}
							city={city}
							date={date}
							endDate={endDate}
							titleRows={1}
							slug={`/pa-gang/${slug}`}
						/>
					</Card>
				))}
			</CardContainer>

			<h1 className={s.past}>Genomfört</h1>
			<CardContainer>
				{pastNews.map(({ id, title, date, endDate, image, slug, city }) => (
					<Card key={id}>
						<Thumbnail
							title={title}
							image={image as FileField}
							city={city}
							date={date}
							endDate={endDate}
							titleRows={1}
							slug={`/pa-gang/${slug}`}
						/>
					</Card>
				))}
			</CardContainer>
		</>
	);
}

export async function generateMetadata({ params }: PageProps<'/pa-gang'>): Promise<Metadata> {
	const { general } = await apiQuery(GeneralDocument);
	return await buildMetadata({
		title: 'På gang',
		description: general?.newsIntro,
		pathname: '/pa-gang',
	});
}
