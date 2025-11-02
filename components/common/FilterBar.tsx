import s from './FilterBar.module.scss';
import cn from 'classnames';
import Link from 'next/link';

export type FilterOption = {
	value: string | null;
	label: string | null;
};

export type Props = {
	options: FilterOption[];
	pathname: string;
	value?: string | null;
};

export default function FilterBar({ options = [], pathname, value }: Props) {
	const open = true;
	const isMobile = false;

	return (
		<nav className={cn(s.filter, open && isMobile && s.open)}>
			<ul>
				<Link href={{ pathname }} className={cn(!value && s.selected)}>
					<li>
						Alla <span className={s.arrow}>›</span>
					</li>
				</Link>
				{options.map((opt, idx) => (
					<Link
						key={idx}
						className={cn(value === opt.value && s.selected)}
						href={{ pathname, query: { filter: opt.value } }}
					>
						<li key={idx}>
							{opt.label}
							<span className={s.arrow}>›</span>
						</li>
					</Link>
				))}
			</ul>
		</nav>
	);
}
