import s from './CardContainer.module.scss';
import cn from 'classnames';

export type Props = {
	children?: React.ReactNode | React.ReactNode[];
	columns?: 2 | 3;
	className?: string;
	filter?: boolean;
};

export default function CardContainer({ children, columns = 3, className, filter }: Props) {
	return (
		<ul className={cn(s.container, columns === 2 && s.two, columns === 3 && s.three, className, filter && s.filter)}>
			{children}
		</ul>
	);
}
