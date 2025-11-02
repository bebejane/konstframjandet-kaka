'use client';

import useStore from '@/lib/store';
import s from './template.module.scss';
import cn from 'classnames';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import SectionHeader from '@/components/layout/SectionHeader';

export default function Template({ children }: { children: React.ReactNode }) {
	const isHome = usePathname() === '/';
	const [showMenu] = useStore((state) => [state.showMenu]);

	return (
		<main id='content' className={cn(s.content, !showMenu && s.full, isHome && s.home)}>
			<article>
				<SectionHeader />
				{children}
			</article>
		</main>
	);
}
