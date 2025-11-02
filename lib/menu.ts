import { apiQuery } from 'next-dato-utils/api';
import { MenuDocument } from '../graphql';

const base: Menu = [
	{ id: 'home', label: 'Hem', slug: '/', general: true },
	//{ id: 'news', label: 'Nyheter', slug: '/nyheter', general: true },
	{ id: 'interviews', label: 'KAKA snackar', slug: '/intervjuer' },
	{ id: 'recipes', label: 'Receptboken', slug: '/recept' },
	{ id: 'tips', label: 'KAKA spanar', slug: '/tips', general: false },
	{ id: 'youths', label: 'Ungt inflytande', slug: '/unga', general: false },
	{ id: 'about', label: 'Om oss', slug: '/om', virtual: true, sub: [] },
	{ id: 'contact', label: 'Kontakt', slug: '/kontakt', general: true },
	{ id: 'search', label: 'Sök', slug: '/sok', general: true },
	//{ id: 'in-english', label: 'In English', slug: '/in-english', general: true }
];

export const buildMenu = async () => {
	const res = await apiQuery(MenuDocument);

	const menu = base.map((item) => {
		let sub: MenuItem[];

		switch (item.id) {
			case 'about':
				//@ts-ignore
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
			sub: sub || item.sub || null,
			count: res[`${item.id}Meta`]?.count ?? null,
		};
	});

	return menu.filter(({ count }) => count || count === null);
};

export type Menu = MenuItem[];
export type MenuQueryResponse = {
	abouts: (AboutRecord & { altSlug: string })[];
	aboutMeta: { count: number };
	tipsMeta: { count: number };
	youthsMeta: { count: number };
};

export type MenuItem = {
	id: SectionId;
	label: string;
	slug?: string;
	sub?: MenuItem[];
	count?: number;
	general?: boolean;
	virtual?: boolean;
};
