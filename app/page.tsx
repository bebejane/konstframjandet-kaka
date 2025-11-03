import s from './page.module.scss';
import { StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { Block } from '@/components';
import { DraftMode } from 'next-dato-utils/components';

export type Props = {
	start: StartRecord;
};

export default async function Home() {
	const { start, draftUrl } = await apiQuery(StartDocument);
	return (
		<>
			<div className={s.container}>
				{start?.content.map((block, idx) => (
					<section key={idx} className={s.noborder}>
						<Block data={block} />
					</section>
				))}
			</div>
			<DraftMode url={draftUrl} path={`/`} />
		</>
	);
}
