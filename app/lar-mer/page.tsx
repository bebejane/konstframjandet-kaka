import s from './page.module.scss';
import {
	AllLearnMoreDocument,
	AllLearnMoreCategoriesDocument,
	AllLearnMoreShortTextsDocument,
	GeneralDocument,
} from '@/graphql';
import { CardContainer, Card, Thumbnail, PageHeader } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import Link from 'next/link';
import { createLoader, parseAsString } from 'nuqs/server';
import { Metadata } from 'next';
import { buildMetadata } from '@/app/layout';

const filterSearchParams = { filter: parseAsString };
const loadSearchParams = createLoader(filterSearchParams);

export default async function LearnMore({ searchParams }: PageProps<'/lar-mer'>) {
	const { filter } = await loadSearchParams(searchParams);
	const { allLearnMoreCategories } = await apiQuery(AllLearnMoreCategoriesDocument);
	const { allLearnMores } = await apiQuery(AllLearnMoreDocument);
	const { allLearnMoreShortTexts } = await apiQuery(AllLearnMoreShortTextsDocument);
	const { general } = await apiQuery(GeneralDocument);

	const learns = [...allLearnMores, ...allLearnMoreShortTexts]
		.sort((a, b) => (new Date(b._createdAt).getTime() > new Date(a._createdAt).getTime() ? 1 : -1))
		.map((item) => ({
			...item,
			category:
				allLearnMoreCategories.find((c) => item.__typename === 'LearnMoreRecord' && c.id === item.learnMoreCategory?.id)
					?.title ?? null,
		}))
		.filter((item) => !filter || item.category === filter);

	return (
		<>
			<PageHeader header={general?.learnMoreSv} headerSmi={general?.learnMoreSmi} content={general?.learnMoreIntro} />
			<ul className={s.filter}>
				{allLearnMoreCategories.map(({ id, title }) => (
					<Link href={`/lar-mer${title !== filter ? `?filter=${title}` : ''}`} key={id}>
						<li className={title === filter ? s.active : undefined}>{title}</li>
					</Link>
				))}
			</ul>
			<CardContainer key={filter}>
				{learns.map((item) => (
					<Card key={item.id}>
						<Thumbnail
							className={item.__typename === 'LearnMoreShortTextRecord' ? 'textBox' : ''}
							title={item.__typename === 'LearnMoreRecord' ? item.name : undefined}
							category={item.category}
							image={item.image as FileField}
							slug={`/lar-mer/${item.__typename === 'LearnMoreRecord' ? item.slug : null}`}
						/>
					</Card>
				))}
			</CardContainer>
		</>
	);
}

export async function generateMetadata({ params }: PageProps<'/lar-mer'>): Promise<Metadata> {
	const { general } = await apiQuery(GeneralDocument);
	return await buildMetadata({
		title: 'Lär mer',
		description: general?.learnMoreIntro,
		pathname: '/lar-mer',
	});
}
