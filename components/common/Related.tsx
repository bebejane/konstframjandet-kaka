import s from './Related.module.scss';
import React from 'react';
import { Image, SRCImage } from 'react-datocms';
import Link from 'next/link';
import config from '@/datocms.config';
import * as changeCase from 'change-case';

export type RelatedItem = ParticipantRecord | PartnerRecord | ProgramRecord;

export type Props = {
	header: string;
	items: RelatedItem[];
};

export default async function Related({ header, items }: Props) {
	if (!items?.length) return null;

	return (
		<section className={s.related}>
			<h2>{header}</h2>
			<ul>
				{items.map(async (item, idx) => {
					const t = item.__typename;
					if (!t) return null;
					const apiKey = changeCase.kebabCase(t.replace('Record', '')) as keyof typeof config.routes;
					const href = (await config.routes[apiKey]?.(item))?.[0];
					if (!href) throw new Error(`No route found for type: ${t}`);

					return (
						<li key={item.id}>
							<Link href={href}>
								<figure>
									{item.image?.responsiveImage && (
										<SRCImage data={item.image.responsiveImage} pictureClassName={s.image} />
									)}
								</figure>
								<figcaption>{item.title}</figcaption>
							</Link>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
