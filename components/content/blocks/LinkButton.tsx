import s from './LinkButton.module.scss';
import React from 'react';
import { Button } from '@/components';
import DatoLink from '@/components/nav/DatoLink';

export type LinkButtonBlockProps = { data: LinkButtonRecord; onClick: Function };

export default async function LinkButton({ data: { link } }: LinkButtonBlockProps) {
	const t = link.__typename;
	const record = t === 'InternalLinkRecord' && link.record ? link.record : null;
	const title = t === 'ExternalLinkRecord' ? link.title : t === 'InternalLinkRecord' && record ? record.title : null;
	return (
		<DatoLink link={link} className={s.button}>
			<Button>{title}</Button>
		</DatoLink>
	);
}
