import Link from 'next/link';
import config from '@/datocms.config';
import * as changeCase from 'change-case';

export type Props = {
	link: ExternalLinkRecord | InternalLinkRecord;
	titel?: string;
	className?: string;
	children?: React.ReactNode;
};

export default async function DatoLink({ link, className, children }: Props) {
	if (!link) return <a className={className}>{children}</a>;

	const t = link.__typename;
	const slug = t === 'ExternalLinkRecord' ? link.url : t === 'InternalLinkRecord' ? await getInteranlRoute(link) : null;
	const record = t === 'InternalLinkRecord' && link.record ? link.record : null;
	const title = t === 'ExternalLinkRecord' ? link.title : record?.title;
	if (!slug) return <a className={className}>{children}</a>;

	return link.__typename === 'ExternalLinkRecord' ? (
		<a href={slug} className={className}>
			{children ?? title}
		</a>
	) : (
		<Link href={slug} className={className}>
			{children ?? title}
		</Link>
	);
}

async function getInteranlRoute(link: InternalLinkRecord) {
	const t = link.record.__typename;
	if (!t) return null;
	const apiKey = changeCase.kebabCase(t.replace('Record', '')) as keyof typeof config.routes;
	const route = await config.routes[apiKey]?.(link.record);
	return route?.[0];
}
