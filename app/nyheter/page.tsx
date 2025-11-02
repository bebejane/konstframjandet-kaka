import s from './page.module.scss';
import { AllNewsDocument } from '@/graphql';
import Link from 'next/link';
import { Markdown } from 'next-dato-utils/components';
import { format } from 'date-fns';
import { Button } from '@/components';
import { apiQuery } from 'next-dato-utils/api';

export default async function News() {
	const { allNews } = await apiQuery(AllNewsDocument);
	return (
		<>
			<section className={s.news}>
				<ul>
					{allNews.map(({ id, title, intro, _createdAt, slug }) => (
						<li key={id}>
							<h3 className='small'>{format(new Date(_createdAt), 'dd MMMM, yyyy')}</h3>
							<h1>
								<Link href={`/nyheter/${slug}`}>{title}</Link>
							</h1>
							<div className='intro'>
								<Markdown className={s.intro} content={intro} />
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
