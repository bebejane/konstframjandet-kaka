import s from './Article.module.scss';
import cn from 'classnames';
import StructuredContent from '@/components/content/Content';
import { Image } from 'react-datocms';
import { useScrollInfo } from 'next-dato-utils/hooks';
import Link from 'next/link';
import useStore from '@/lib/store';
import { format } from 'date-fns/format';
import { Markdown } from 'next-dato-utils/components';
import useDevice from '@/lib/hooks/useDevice';
import BalanceText from 'react-wrap-balancer';
import ArticleImage from '@/components/layout/ArticleImage';

export type ArticleProps = {
	children?: React.ReactNode | React.ReactNode[] | undefined;
	title?: string | null;
	subtitle?: string;
	intro?: string | null;
	image?: FileField;
	imageSize?: 'small' | 'medium' | 'large';
	content?: any;
	record?: any;
	date?: string;
	tip?: TipRecord[];
};

export default function Article({
	children,
	title,
	content,
	image,
	imageSize,
	intro,
	tip,
	date,
	record,
}: ArticleProps) {
	return (
		<>
			<div className={cn(s.article, 'article')}>
				<h1>
					<BalanceText>{title}</BalanceText>
				</h1>
				<ArticleImage
					image={image}
					content={content}
					className={cn(imageSize && s[imageSize], image?.height > image?.width && s.portrait)}
				/>
				<section className='intro'>
					{date && (
						<div className={s.date}>
							<span className='small'>{format(new Date(date), 'MMM').replace('.', '')}</span>
							<span>{format(new Date(date), 'dd').replace('.', '')}</span>
						</div>
					)}
					<Markdown className={s.intro} content={intro} />
				</section>
				{content && (
					<>
						<div className='structured'>
							<StructuredContent content={content} className='structured' />
						</div>
					</>
				)}
				{children}
			</div>
		</>
	);
}
