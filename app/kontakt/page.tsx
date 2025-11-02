import { ContactDocument } from '@/graphql';
import { Article, PageHeader } from '@/components';
import { apiQuery } from 'next-dato-utils/api';
import { notFound } from 'next/navigation';
import { DraftMode } from 'next-dato-utils/components';
import { buildMetadata } from '@/app/layout';
import { Metadata } from 'next';

export type Props = {
	contact: ContactRecord;
	general: GeneralRecord;
};

export default async function Contact() {
	const { contact, draftUrl } = await apiQuery(ContactDocument);

	if (!contact) return notFound();
	const { id, image, intro, content, title } = contact;

	return (
		<>
			<Article title={title} image={image as FileField} intro={intro} imageSize='small' content={content} />
			<DraftMode url={draftUrl} path={`/kontakt`} />
		</>
	);
}

export async function generateMetadata({ params }: PageProps<'/kontakt'>): Promise<Metadata> {
	const { contact } = await apiQuery(ContactDocument);

	return await buildMetadata({
		title: 'Kontakt',
		description: contact?.intro,
		image: contact?.image as FileField,
		pathname: '/kontakt',
	});
}
