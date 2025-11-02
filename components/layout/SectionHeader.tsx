'use client';

import s from './SectionHeader.module.scss';
import cn from 'classnames';
import React from 'react';
import Link from 'next/link';
import { MenuItem, Section, sections } from '@/lib/menu';
import useStore from '@/lib/store';
import { usePathname } from 'next/navigation';

export type SectionHeaderProps = {
	menu: MenuItem[];
	overview?: boolean;
};

export default function SectionHeader() {
	const pathname = usePathname();
	const isHome = pathname === '/';
	const [showMenu] = useStore((state) => [state.showMenu]);

	const sectionId = (pathname.split('/')?.[1] || 'home') as Section['id'];
	const section = sections.find(({ id }) => id === sectionId);
	const label = isHome ? null : section?.label;
	const isSearch = sectionId === 'search';

	const header = (
		<h2>
			<span key={label}>
				{label?.split('').map((c, idx) => (
					<span
						key={`${idx}`}
						style={{
							animationDelay: `${(idx / label.length) * 0.6}s`,
						}}
					>
						{c}
					</span>
				))}
			</span>
		</h2>
	);

	return (
		<>
			<Link href='/' className={cn(s.logo, isHome && s.home)}>
				<img src='/images/logo.svg' />
			</Link>
			<header className={cn(s.header, !showMenu && s.full, isHome && s.home)} key={sectionId}>
				{section?.slug && <Link href={section?.slug}>{header}</Link>}
			</header>
			{!isHome && (
				<>
					<div className={s.spacer}></div>
					<div className={s.line}></div>
				</>
			)}
		</>
	);
}
