'use client';

import s from './PageHeader.module.scss';
import cn from 'classnames';
import React from 'react';
import { usePathname } from 'next/navigation';

export type Props = {
	header?: string | null;
	headerSmi?: string | null;
	content?: string | null;
};

export default function PageHeader({ header, headerSmi, content }: Props) {
	const pathname = usePathname();

	return (
		<header className={cn(s.header, pathname === '/' && s.home)}>
			<h1>{headerSmi}</h1>
			<h1>{header}</h1>
			{content && <p>{content}</p>}
		</header>
	);
}
