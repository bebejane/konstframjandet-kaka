import { apiQuery } from 'next-dato-utils/api';
import { SitemapDocument } from '@/graphql';
import { DatoCmsConfig, getUploadReferenceRoutes, getItemReferenceRoutes } from 'next-dato-utils/config';
import { MetadataRoute } from 'next';
import { GlobalDocument } from '@/graphql';

export default {
	routes: {
		general: async () => ['/'],
		start: async () => ['/'],
		about: async ({ slug }) => [`/om/${slug}`],
		news: async ({ slug }) => [`/nyheter/${slug}`],
		interview: async ({ slug }) => [`/intervjuer/${slug}`],
		youth: async ({ slug }) => [`/unga/${slug}`],
		recipe: async ({ slug }) => [`/recept/${slug}`],
		recepie_category: async ({ id }) => ['/recept', ...((await getItemReferenceRoutes(id as string)) ?? [])],
		tip: async ({ slug }) => [`/tips/${slug}`],
		tips_category: async ({ id }) => ['/tips', ...((await getItemReferenceRoutes(id as string)) ?? [])],
		contact: async () => ['/kontakt'],
		in_english: async () => ['/in-english'],
		upload: async (record) => getUploadReferenceRoutes(record.id),
	},
	sitemap: async () => {
		const { allNews, allAbouts } = await apiQuery(SitemapDocument, { all: true });

		const dynameicRoutes = [
			...allNews.map(({ slug, _updatedAt }) => ({
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/pa-gang/${slug}`,
				lastModified: new Date(_updatedAt).toISOString(),
				changeFrequency: 'weekly',
				priority: 0.8,
			})),
			...allAbouts.map(({ slug, _updatedAt }) => ({
				url: `${process.env.NEXT_PUBLIC_SITE_URL}/om/${slug}`,
				lastModified: new Date(_updatedAt).toISOString(),
				changeFrequency: 'weekly',
				priority: 0.8,
			})),
		];

		const staticRoutes = [
			'/',
			'/kontakt',
			'/om',
			'/vad-vi-gor',
			'/pa-gang',
			'/lar-mer',
			'/om/in-english-verdde',
			'/om/samegillii-verdde',
		].map((pathname) => ({
			url: `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}}`,
			lastModified: new Date().toISOString(),
			changeFrequency: pathname === '/' ? 'weekly' : 'monthly',
			priority: pathname === '/' ? 1 : 0.8,
		}));

		return [...staticRoutes, ...dynameicRoutes] as MetadataRoute.Sitemap;
	},
	manifest: async () => {
		const { site } = await apiQuery(GlobalDocument);

		return {
			name: site.globalSeo?.siteName ?? '',
			short_name: site.globalSeo?.siteName ?? '',
			description: site.globalSeo?.fallbackSeo?.description ?? '',
			start_url: '/',
			display: 'standalone',
			background_color: '#ffffff',
			theme_color: '#F0A7FF',
			icons: [
				{
					src: '/favicon.ico',
					sizes: 'any',
					type: 'image/x-icon',
				},
			],
		} satisfies MetadataRoute.Manifest;
	},
	robots: async () => {
		return {
			rules: {
				userAgent: '*',
				allow: '/',
			},
		};
	},
} satisfies DatoCmsConfig;
