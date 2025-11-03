'use client';

import s from './Menu.module.scss';
import cn from 'classnames';
import { useState, useRef, useEffect } from 'react';
import type { Menu, MenuItem } from '@/lib/menu';
import Link from 'next/link';
import { Hamburger } from '..';
import useStore from '@/lib/store';
import { useScrollInfo } from 'next-dato-utils/hooks';
import { useWindowSize } from 'usehooks-ts';
import useDevice from '@/lib/hooks/useDevice';
import { usePathname, useRouter } from 'next/navigation';

export type MenuProps = { items: Menu };

export default function Menu({ items }: MenuProps) {
	const pathname = usePathname();
	const router = useRouter();
	const menuRef = useRef<HTMLUListElement | null>(null);
	const [showMenu, setShowMenu, searchQuery, setSearchQuery] = useStore((state) => [
		state.showMenu,
		state.setShowMenu,
		state.searchQuery,
		state.setSearchQuery,
	]);
	const [selected, setSelected] = useState<MenuItem | undefined>();
	const [searchFocus, setSearchFocus] = useState(false);
	const [path, setPath] = useState(pathname);
	const [menuPadding, setMenuPadding] = useState(0);
	const [footerScrollPosition, setFooterScrollPosition] = useState(0);
	const { scrolledPosition, documentHeight, viewportHeight } = useScrollInfo();
	const { width, height } = useWindowSize();
	const { isDesktop, isMobile } = useDevice();

	const onSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setSearchFocus(false);
		setShowMenu(false);
		setSearchQuery('');
		router.push(`/sok?q=${searchQuery}`, { scroll: true });
	};

	useEffect(() => {
		const footer = document.getElementById('footer');

		if (!footer || !menuRef.current) return;

		const footerHeight = footer.clientHeight - 1;
		const menuOffset = menuRef.current.offsetTop;
		const footerScrollPosition =
			scrolledPosition + viewportHeight < documentHeight - footerHeight
				? 0
				: footerHeight - (documentHeight - (scrolledPosition + viewportHeight));
		const menuPadding = isMobile
			? menuOffset + footerScrollPosition
			: footerScrollPosition
				? menuOffset + footerScrollPosition
				: 0;

		setMenuPadding(menuPadding);
		setFooterScrollPosition(footerScrollPosition);
	}, [path, scrolledPosition, documentHeight, viewportHeight, width, height, isMobile]);

	useEffect(() => {
		!isDesktop && setShowMenu(false);
		setPath(path);
	}, [isDesktop, pathname]);

	useEffect(() => {
		// Find selected item from pathname recursively
		const findSelected = (path: string, item: MenuItem): MenuItem | undefined => {
			if (item.slug === path) return item;
			if (item.sub?.length) {
				for (let i = 0; i < item.sub.length; i++) {
					const selected = findSelected(path, item.sub[i]);
					if (selected) return selected;
				}
			}
		};

		for (let i = 0; i < items.length; i++) {
			const selected = findSelected(pathname, items[i]);
			if (selected) {
				return setSelected(selected);
			}
		}
	}, [pathname]);

	return (
		<>
			<Hamburger />
			<nav
				className={cn(s.menu, !showMenu && s.hide)}
				style={{ minHeight: `calc(100vh - ${footerScrollPosition}px - 1px)` }}
			>
				<ul data-level={0} ref={menuRef} style={{ maxHeight: `calc(100vh - ${menuPadding}px - 1rem)` }}>
					{items.map((item, idx) =>
						item.id !== 'sok' ? (
							<MenuTree
								key={`${idx}-${pathname}`}
								item={item}
								level={0}
								selected={selected}
								setSelected={setSelected}
								path={pathname}
							/>
						) : (
							<li key={idx} className={s.search}>
								<form onSubmit={onSubmitSearch}>
									<input
										name='q'
										placeholder={`Sök${searchFocus ? '...' : ''}`}
										autoComplete={'off'}
										value={searchQuery ?? ''}
										onFocus={() => setSearchFocus(true)}
										onBlur={() => setSearchFocus(false)}
										onChange={({ target: { value } }) => setSearchQuery(value)}
									/>
								</form>
								<div onClick={() => setSearchFocus(false)} className={cn(s.close, !searchFocus && s.hide)}>
									×
								</div>
							</li>
						)
					)}
				</ul>
			</nav>
		</>
	);
}

export type MenuTreeProps = {
	item: MenuItem;
	level: number;
	selected: MenuItem | undefined;
	setSelected: (item: MenuItem) => void;
	path: string;
};

export function MenuTree({ item, level, selected, setSelected, path }: MenuTreeProps) {
	const expand = () => {
		setSelected(item);
		setTimeout(() => window.scrollTo(0, 0), 100);
	};
	const itemIncludesPath = (item: MenuItem) => {
		return item?.slug === path || item?.sub?.some((sub) => sub.slug === path);
	};

	const isVisible = (path: string, item: MenuItem) => {
		if (itemIncludesPath(item)) return true;
		if (!item.sub?.length) return false;

		for (let i = 0; i < item.sub.length; i++) {
			if (item.sub[i].sub && isVisible(path, item.sub[i])) return true;
			else if (itemIncludesPath(item.sub[i])) return true;
		}
		return false;
	};

	const isSelected = item.slug === selected?.slug && !item.virtual;
	const isLink = item.slug;
	const isBold = level === 0 || (item?.sub && item.sub?.length > 0);
	const label = item.label;

	return (
		<li data-parent={item.id} className={cn(isSelected && s.active, isBold && s.bold)}>
			{isLink && item.slug ? (
				<Link onClick={expand} href={item.slug} scroll={true}>
					{label}
				</Link>
			) : (
				<span onClick={expand}>{label}</span>
			)}
			{item?.sub && isVisible(path, item) && item.sub.length > 0 && (
				<ul onClick={(e) => e.stopPropagation()}>
					{item.sub.map((item, idx) => (
						<MenuTree key={idx} item={item} level={level} selected={selected} setSelected={setSelected} path={path} />
					))}
				</ul>
			)}
		</li>
	);
}
