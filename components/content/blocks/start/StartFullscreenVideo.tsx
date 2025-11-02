import s from './StartFullscreenVideo.module.scss';
import cn from 'classnames';
import React from 'react';
import { VideoPlayer } from '@/components';
import Link from 'next/link';
//import { useRef } from 'react';
import { Markdown } from 'next-dato-utils/components';
import useStore from '@/lib/store';
import DatoLink from '@/components/nav/DatoLink';

export type Props = { data: StartFullscreenVideoRecord };

export default function StartFullscreenVideo({ data: { video, text, headline, link } }: Props) {
	//const ref = useRef();
	//const [showMenu] = useStore((state) => [state.showMenu]);

	return (
		<div className={cn(s.fullScreenVideo, s.full)}>
			<DatoLink link={link}>
				<VideoPlayer data={video} />
			</DatoLink>
			<div className={s.textWrap}>
				<h2>{headline}</h2>
				<Markdown className={cn(s.text, 'intro')} content={text} />
			</div>
		</div>
	);
}
