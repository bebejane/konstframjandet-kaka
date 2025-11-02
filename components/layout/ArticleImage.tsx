'use client';

import s from './ArticleImage.module.scss';
import cn from 'classnames';
import React, { useEffect, useRef } from 'react';
import { Image, SRCImage } from 'react-datocms';
import useStore from '@/lib/store';

export type ArticleImageProps = {
	image?: FileField;
	className?: string;
	content?: any;
};

export default function ArticleImage({ image, className, content }: ArticleImageProps) {
	const [setImageId, setImages] = useStore((state) => [state.setImageId, state.setImages]);
	const captionRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		const images = [image];
		content?.blocks.forEach((el: any) => {
			el.__typename === 'ImageRecord' && images.push(el.image);
			el.__typename === 'ImageGalleryRecord' && images.push.apply(images, el.images);
		});

		setImages(images.filter((el) => el) as FileField[]);
	}, []);

	return (
		<>
			{image?.responsiveImage && (
				<figure className={cn(s.mainImage, className)} onClick={() => setImageId(image?.id)}>
					<SRCImage data={image.responsiveImage} pictureClassName={s.picture} />
					<figcaption ref={captionRef}>{image.title}</figcaption>
				</figure>
			)}
		</>
	);
}
