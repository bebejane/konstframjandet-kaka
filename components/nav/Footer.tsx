import s from './Footer.module.scss';
import cn from 'classnames';
import type { MenuItem } from '@/lib/menu';
import KFLogo from '@/public/images/kf-logo.svg';
import { PROJECT_NAME } from '@/lib/constant';
import Link from 'next/link';

export type FooterProps = {
	menu: MenuItem[];
	footer: FooterQuery['footer'];
};

export default function Footer({ footer }: FooterProps) {
	if (!footer) return null;
	const { email, facebook, instagram, about } = footer;

	return (
		<footer className={cn(s.footer)} id='footer' data-datocms-noindex>
			<section>
				<div>
					Copyright {PROJECT_NAME}, {new Date().getFullYear()} <br />
					<a href={`mailto:${email}`}>{email}</a>
				</div>
				<div>Följ oss på {instagram && <Link href={instagram}>Instagram</Link>}</div>
				<div>{about}</div>
				<KFLogo className={s.kf} />
			</section>
		</footer>
	);
}
