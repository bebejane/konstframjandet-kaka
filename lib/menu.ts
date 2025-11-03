import { apiQuery } from 'next-dato-utils/api';
import { MenuDocument } from '../graphql';

export type Section = {
	id: string;
	header?: string;
	label: string;
	slug: string;
	general?: boolean;
	virtual?: boolean;
	sub?: MenuItem[];
};

export const sections: Section[] = [
	{ id: 'hem', label: 'Hem', slug: '/', general: true },
	{ id: 'intervjuer', header: 'Intervjuer', label: 'KAKA snackar', slug: '/intervjuer' },
	{ id: 'recept', header: 'Recept', label: 'Receptboken', slug: '/recept' },
	{ id: 'tips', header: 'Tips', label: 'KAKA spanar', slug: '/tips', general: false },
	{ id: 'unga', header: 'Unga', label: 'Ungt inflytande', slug: '/unga', general: false },
	{ id: 'om', header: 'Om', label: 'Om oss', slug: '/om', virtual: true, sub: [] },
	{ id: 'kontakt', header: 'Kontakt', label: 'Kontakt', slug: '/kontakt', general: true },
	{ id: 'sok', header: 'Sök', label: 'Sök', slug: '/sok', general: true },
];

export const buildMenu = async (): Promise<MenuItem[]> => {
	const res = await apiQuery(MenuDocument, { all: true });

	const menu = sections.map((item) => {
		let sub: MenuItem[] | null = null;

		switch (item.id) {
			case 'om':
				sub = res.allAbouts.map((el) => ({
					id: `about-${el.slug}`,
					label: el.title,
					header: item.header,
					slug: `/om/${el.slug}`,
				}));
				if (res.allAbouts.length) item.slug = `/om/${res.allAbouts[0].slug}`;

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
