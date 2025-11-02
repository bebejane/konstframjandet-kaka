'use client';
import { Button } from '..';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type Props = {
	children: React.ReactNode;
	href?: string;
};

export default function BackButton(props: Props) {
	const { children, href } = props;
	const pathname = usePathname();
	const segemnts = pathname.split('/');
	segemnts.pop();

	return (
		<Link href={href || segemnts.join('/')}>
			<Button className='back'>{children}</Button>
		</Link>
	);
}
