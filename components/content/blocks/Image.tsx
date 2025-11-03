'use client';

import s from './Image.module.scss';
import cn from 'classnames';
import React from 'react';
import { Image as DatoImage } from 'react-datocms';
import { Markdown } from 'next-dato-utils/components';
import { useStore } from '@/lib/store';

export type ImageBlockProps = {
	id: string;
	data: ImageRecord;
};

export default function Image({ id, data: { image, layout } }: ImageBlockProps) {
	const [setImageId] = useStore((state) => [state.setImageId]);
	return (
		<figure
			className={cn(s.figure, s[layout], image.height > image.width && s.portrait)}
			onClick={() => setImageId(image.id)}
		>
			{image.responsiveImage && <DatoImage data={image.responsiveImage} className={s.image} />}
			{image.title && (
				<figcaption>
					<Markdown allowedElements={['em', 'p']} content={image.title} />
				</figcaption>
			)}
		</figure>
	);
}
