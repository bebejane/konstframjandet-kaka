'use client';

import s from './SectionHeader.module.scss';
import cn from 'classnames';
import React from 'react';
import Link from 'next/link';
import { MenuItem, Section, sections } from '@/lib/menu';
import useStore from '@/lib/store';
import { usePathname } from 'next/navigation';
import Logo from '@/public/images/logo-text.svg';

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
	const header = isHome ? null : section?.header;
	const isSearch = sectionId === 'search';

	const content = (
		<h2>
			<span key={header} data-datocms-noindex>
				{header?.split('').map((c, idx) => (
					<span
						key={`${idx}`}
						style={{
							animationDelay: `${(idx / header.length) * 0.6}s`,
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
				<Logo />
			</Link>
			<header className={cn(s.header, !showMenu && s.full, isHome && s.home)} key={sectionId} data-datocms-noindex>
				{section?.slug && <Link href={section?.slug}>{content}</Link>}
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
