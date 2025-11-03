import s from './Thumbnail.module.scss';
import cn from 'classnames';
import { Image } from 'react-datocms';
import Link from 'next/link';
import { truncateWords } from '@/lib/utils';
import { remark } from 'remark';
import strip from 'strip-markdown';

export type Props = {
	image?: FileField;
	slug: string;
	title: string;
	titleLength?: number;
	titleRows?: number;
	intro?: string;
	meta?: string;
};

export default function Thumbnail({ image, slug, intro, title, titleLength, titleRows = 3, meta }: Props) {
	const strippedIntro = truncateWords(remark().use(strip).processSync(intro).value as string, 500);

	return (
		<Link href={slug} className={s.thumbnail}>
			{image?.responsiveImage && (
				<div className={s.imageWrap}>
					<Image data={image.responsiveImage} pictureClassName={s.image} placeholderClassName={s.placeholder} />
					<div className={s.border} />
				</div>
			)}
			<h3 className={cn(s[`rows-${titleRows}`])}>
				<span>{titleLength ? truncateWords(title, titleLength) : title}</span>
			</h3>
			{(strippedIntro || meta) && (
				<div className='thumb-intro'>
					<p>
						{meta && <strong>{meta.trim()}</strong>}
						{strippedIntro}
					</p>
				</div>
			)}
		</Link>
	);
}
