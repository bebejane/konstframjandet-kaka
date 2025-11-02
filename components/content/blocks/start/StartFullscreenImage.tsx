import s from './StartFullscreenImage.module.scss';
import React from 'react';
import { Image } from 'react-datocms';
import DatoLink from '@/components/nav/DatoLink';

export type Props = {
	data: StartFullscreenImageRecord;
};

export default function StartFullscreenImage({ data: { id, image, text, headline, link } }: Props) {
	return (
		<DatoLink link={link} className={s.container}>
			<figure>
				<Image data={image.responsiveImage} className={s.image} />
				<figcaption className='intro'>
					<h2>{headline}</h2>
					<p className='intro'>{text}</p>
					<div className={s.fade}></div>
				</figcaption>
			</figure>
		</DatoLink>
	);
}
