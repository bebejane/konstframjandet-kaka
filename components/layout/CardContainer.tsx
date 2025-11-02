'use client';

import s from './CardContainer.module.scss';
import cn from 'classnames';
import { chunkArray } from '@/lib/utils';
import useDevice from '@/lib/hooks/useDevice';
import React, { ReactElement, useEffect, useRef, useState } from 'react';

export type Props = {
	children?: React.ReactNode | React.ReactNode[];
	columns?: 2 | 3;
	className?: string;
	filter?: boolean;
	hideLastOnDesktop?: boolean;
	hideLastOnMobile?: boolean;
};

export default function CardContainer({
	children,
	columns = 3,
	className,
	filter,
	hideLastOnDesktop = false,
	hideLastOnMobile = false,
}: Props) {
	const buildCards = () => {
		return chunkArray(
			(Array.isArray(children) ? children : [children]).map((el) => React.cloneElement(el as ReactElement)),
			!isDesktop ? 2 : columns
		) as [React.ReactNode[]];
	};

	const ref = useRef<HTMLUListElement | null>(null);
	const { isDesktop } = useDevice();
	const [cards, setCards] = useState(buildCards());

	useEffect(() => {
		setCards(buildCards());
	}, [isDesktop]);

	return (
		<ul
			ref={ref}
			className={cn(s.container, columns === 2 && s.two, columns === 3 && s.three, className, filter && s.filter)}
		>
			{cards.map((row, idx) => {
				return <React.Fragment key={idx}>{row.map((el) => el)}</React.Fragment>;
			})}
		</ul>
	);
}
