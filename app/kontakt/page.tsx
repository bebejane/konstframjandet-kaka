import { ContactDocument, GeneralDocument, GlobalDocument } from '@/graphql';
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
	const { general } = await apiQuery(GeneralDocument);

	if (!contact) return notFound();
	const { id, image, intro, content } = contact;

	return (
		<>
			<PageHeader header={general?.contactSv} headerSmi={general?.contactSmi} content={intro} />
			<Article key={id} image={image as FileField} imageSize='small' content={content} />
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
