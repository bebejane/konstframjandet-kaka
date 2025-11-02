import { apiQuery } from 'next-dato-utils/api';
import { MenuDocument } from '../graphql';

export type Section = {
	id: string;
	label: string;
	slug: string;
	general?: boolean;
	virtual?: boolean;
	sub?: MenuItem[];
};

export const sections: Section[] = [
	{ id: 'hem', label: 'Hem', slug: '/', general: true },
	{ id: 'intervjuer', label: 'KAKA snackar', slug: '/intervjuer' },
	{ id: 'recept', label: 'Receptboken', slug: '/recept' },
	{ id: 'tips', label: 'KAKA spanar', slug: '/tips', general: false },
	{ id: 'unga', label: 'Ungt inflytande', slug: '/unga', general: false },
	{ id: 'om', label: 'Om oss', slug: '/om', virtual: true, sub: [] },
	{ id: 'kontakt', label: 'Kontakt', slug: '/kontakt', general: true },
	{ id: 'sok', label: 'Sök', slug: '/sok', general: true },
];

export const buildMenu = async (): Promise<MenuItem[]> => {
	const res = await apiQuery(MenuDocument);

	const menu = sections.map((item) => {
		let sub: MenuItem[] | null = null;

		switch (item.id) {
			case 'about':
				sub = res.abouts.map((el) => ({
					id: `about-${el.slug}`,
					label: el.title,
					slug: `/om/${el.slug}`,
				}));
				if (res.abouts.length) {
					item.slug = `/om/${res.abouts[0].slug}`;
				}
				break;
			default:
				break;
		}
		return {
			...item,
			sub: sub !== null ? sub : (item.sub ?? null),
		};
	});

	return menu as MenuItem[];
};

export type Menu = MenuItem[];
export type MenuQueryResponse = {
	abouts: (AboutRecord & { altSlug: string })[];
	aboutMeta: { count: number };
	tipsMeta: { count: number };
	youthsMeta: { count: number };
};

export type MenuItem = {
	id: Section['id'];
	label: string;
	slug?: string;
	sub?: MenuItem[];
	count?: number;
	general?: boolean;
	virtual?: boolean;
};
