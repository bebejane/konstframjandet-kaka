import s from './index.module.scss';
import withGlobalProps from '@/lib/withGlobalProps';
import { AllNewsDocument } from '../../graphql';
import Link from 'next/link';
import { Markdown } from 'next-dato-utils/components';
import format from 'date-fns/format';
import { DatoSEO } from 'next-dato-utils/components';
import { pageSlugs } from '@/lib/i18n';
import { Button } from '../../components';

export type Props = {
	news: (NewsRecord & ThumbnailImage)[];
};

export default function News({ news }: Props) {
	return (
		<>
			<DatoSEO title={'Nyheter'} />
			<section className={s.news}>
				<ul>
					{news.map(({ id, title, intro, _createdAt, slug }) => (
						<li key={id}>
							<h3 className='small'>{format(new Date(_createdAt), 'dd MMMM, yyyy')}</h3>
							<h1>
								<Link href={`/nyheter/${slug}`}>{title}</Link>
							</h1>
							<div className='intro'>
								<Markdown className={s.intro}>{intro}</Markdown>
							</div>
							<Link href={`/nyheter/${slug}`}>
								<Button>Läs mer</Button>
							</Link>
						</li>
					))}
				</ul>
			</section>
		</>
	);
}

export const getStaticProps = withGlobalProps({ queries: [AllNewsDocument] }, async ({ props, revalidate }: any) => {
	return {
		props: {
			...props,
			page: {
				section: 'news',
				title: 'Nyheter',
				slugs: pageSlugs('news'),
			} as PageProps,
		},
		revalidate,
	};
});
