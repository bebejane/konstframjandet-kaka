'use client';

import useDevice from '@/lib/hooks/useDevice';
import s from './FilterBar.module.scss';
import cn from 'classnames';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export type FilterOption = {
	value: string | null;
	label: string | null;
};

export type Props = {
	options: FilterOption[];
	pathname: string;
	value?: string | null;
};

export default function FilterBar({ options = [], pathname, value: _value }: Props) {
	const [open, setOpen] = useState(true);
	const [value, setValue] = useState<string | null | undefined>(null);
	const { isMobile } = useDevice();

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
		if (!isMobile) return;
		const { value } = e.currentTarget.dataset;
		setValue(value);
		setOpen(!open);
	};

	useEffect(() => {
		isMobile && setValue(_value);
	}, [_value, isMobile]);

	const allOptions = [{ value: null, label: 'Alla' } as FilterOption].concat(options);
	const currentOption = allOptions.find((opt) => opt.value === value) ?? allOptions[0];

	return (
		<nav className={s.filter}>
			<ul>
				{(!open ? allOptions : [currentOption]).map((opt, idx) => (
					<Link
						key={`${idx}-${opt.value}`}
						className={cn((opt.value === value || (idx === 0 && !value)) && s.selected)}
						href={{ pathname, query: { filter: opt.value } }}
						data-value={opt.value}
						onClick={handleClick}
					>
						<li key={idx}>
							{opt.label}
							{idx === 0 && open && <span className={s.arrow}>›</span>}
						</li>
					</Link>
				))}
			</ul>
		</nav>
	);
}
