import withGlobalProps from '@/lib/withGlobalProps';
import { AllYouthsCategoriesDocument, AllYouthsDocument } from '../../graphql';
import { CardContainer, Card, Thumbnail, FilterBar } from '../../components';
import { useRouter } from 'next/router';
import { DatoSEO } from 'next-dato-utils/components';
import { pageSlugs } from '@/lib/i18n';
import { useState } from 'react';

export type Props = {
	youths: YouthRecord[];
	categories: YouthCategoryRecord[];
};

export default function Youths({ youths, categories }: Props) {
	const { asPath } = useRouter();
	const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

	return (
		<>
			<DatoSEO title={'Unga'} />
			{categories.length > 0 && (
				<FilterBar
					options={categories.map(({ id, title }) => ({ id, label: title }))}
					onChange={(cat) => setCategoryFilter(cat ?? null)}
				/>
			)}
			<CardContainer key={`${asPath}-youths-${categoryFilter?.toString()}`}>
				{youths
					.filter(
						({ category }) =>
							!categoryFilter.length || categoryFilter?.find((id) => category.find((cat) => cat.id === id))
					)
					.map(({ id, image, title, intro, slug }) => (
						<Card key={id}>
							<Thumbnail title={title} image={image} intro={intro} titleRows={1} slug={`/unga/${slug}`} />
						</Card>
					))}
			</CardContainer>
		</>
	);
}

export const getStaticProps = withGlobalProps(
	{ queries: [AllYouthsDocument, AllYouthsCategoriesDocument] },
	async ({ props, revalidate }: any) => {
		return {
			props: {
				...props,
				page: {
					section: 'youths',
					title: 'Unga',
					slugs: pageSlugs('youths'),
				} as PageProps,
			},
			revalidate,
		};
	}
);
