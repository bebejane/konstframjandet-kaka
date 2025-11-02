import s from './page.module.scss';
import cn from 'classnames';
import { StartDocument } from '@/graphql';
import { apiQuery } from 'next-dato-utils/api';
import { Block } from '@/components';
import { DraftMode } from 'next-dato-utils/components';

export type Props = {
	start: StartRecord;
};

const fullBlocks = ['StartFullscreenImageRecord', 'StartFullBleedImageRecord', 'StartFullscreenVideoRecord'];

export default async function Home() {
	const { start, draftUrl } = await apiQuery(StartDocument);
	console.log(start?.content);
	return (
		<>
			<div className={s.container}>
				{start?.content.map((block, idx) => (
					<section key={idx} className={cn(fullBlocks.includes(block.__typename) && s.noborder)}>
						<Block data={block} />
					</section>
				))}
			</div>
			<DraftMode url={draftUrl} path={`/`} />
		</>
	);
}
