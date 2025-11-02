import s from './index.module.scss';
import withGlobalProps from '@/lib/withGlobalProps';
import { AllTipsCategoriesDocument, AllTipsDocument } from '../../graphql';
import { CardContainer, Card, Thumbnail, FilterBar } from '../../components';
import { useRouter } from 'next/router';
import { DatoSEO } from 'next-dato-utils/components';

import { pageSlugs } from '@/lib/i18n';
import { useState } from 'react';

export type Props = {
	tips: TipRecord[];
	categories: TipCategoryRecord[];
};

export default function Tips({ tips, categories }: Props) {
	const { asPath } = useRouter();
	const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

	return (
		<>
			<DatoSEO title={'Tips'} />
			{categories.length > 0 && (
				<FilterBar
					options={categories.map(({ id, title }) => ({ id, label: title }))}
					onChange={(cat) => setCategoryFilter(cat ?? null)}
				/>
			)}
			<CardContainer key={`${asPath}-tips-${categoryFilter?.toString()}`}>
				{tips
					.filter(
						({ category }) =>
							!categoryFilter.length || categoryFilter?.find((id) => category?.find((cat) => cat.id === id))
					)
					.map(({ id, image, name, intro, slug }) => (
						<Card key={id}>
							<Thumbnail title={name} image={image} intro={intro} titleRows={1} slug={`/tips/${slug}`} />
						</Card>
					))}
			</CardContainer>
		</>
	);
}

export const getStaticProps = withGlobalProps(
	{ queries: [AllTipsDocument, AllTipsCategoriesDocument] },
	async ({ props, revalidate }: any) => {
		return {
			props: {
				...props,
				page: {
					section: 'tips',
					title: 'Tips',
					slugs: pageSlugs('tips'),
				} as PageProps,
			},
			revalidate,
		};
	}
);
