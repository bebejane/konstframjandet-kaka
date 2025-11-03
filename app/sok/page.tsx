import s from './page.module.scss';
import { Article, Loader } from '@/components';
import { Suspense } from 'react';
import Search from './SearchResults';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

export default async function SearchPage({ searchParams }: PageProps<'/sok'>) {
	return (
		<Article>
			<section className={s.container}>
				<div className={s.form}>
					<form action={'/sok'} method={'GET'}>
						<input id={'q'} type={'text'} name={'q'} defaultValue={''} />
					</form>
				</div>
				<Suspense fallback={<Loader className={s.loader} />}>
					<Search params={searchParams} />
				</Suspense>
			</section>
		</Article>
	);
}

export async function generateMetadata({ params }: PageProps<'/sok'>): Promise<Metadata> {
	return await buildMetadata({
		title: 'Sök',
		pathname: '/sok',
	});
}
