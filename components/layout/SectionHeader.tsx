'use client';

import s from './SectionHeader.module.scss';
import cn from 'classnames';
import React from 'react';
import Link from 'next/link';
import { MenuItem } from '@/lib/menu';
//import { usePage } from '@/lib/context/page';
import useStore from '@/lib/store';
//import Logo from '/public/images/logo-text.svg';
import { usePathname } from 'next/navigation';

export type SectionHeaderProps = {
	menu: MenuItem[];
	overview?: boolean;
};

const sections = {
	'home': 'Hem',
	'about': 'Om',
	'recipes': 'Recept',
	'tips': 'Tips',
	'interviews': 'Intervjuer',
	'youths': 'Unga',
	'news': 'Nyheter',
	'contact': 'Kontakt',
	'in-english': 'In English',
	'search': 'Sök',
};

export default function SectionHeader() {
	const pathname = usePathname();
	//const { title } = usePage();

	const [showMenu] = useStore((state) => [state.showMenu]);
	const { section, parent, isHome, slugs } = usePage();

	const parentPath = slugs[0]?.parent;
	const isSearch = section === 'search';
	const label = !isSearch ? `${!isHome ? `${sections[section]}` : ''}` : 'Sök';

	const header = (
		<h2>
			<span key={label}>
				{label.split('').map((c, idx) => (
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
				{/*	<Logo />*/}
			</Link>
			<header className={cn(s.header, !showMenu && s.full, isHome && s.home)}>
				{parentPath && asPath !== parentPath && parent ? <Link href={parentPath}>{header}</Link> : <>{header}</>}
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
