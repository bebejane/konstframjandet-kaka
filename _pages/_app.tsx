import '/lib/styles/index.scss';
import { Layout } from '../components';
import { PageProvider } from '../lib/context/page';
import { DefaultDatoSEO } from 'next-dato-utils/components';
import { useRouter } from 'next/router';

const siteTitle = 'Konstpedagogik';

function App({ Component, pageProps, router }) {
	const page = pageProps.page || ({} as PageProps);
	const { asPath } = useRouter();

	const isHome = asPath === '/';
	const errorCode = parseInt(router.pathname.replace('/', ''));
	const isError =
		(!isNaN(errorCode) && errorCode > 400 && errorCode < 600) || router.pathname.replace('/', '') === '_error';

	if (isError) return <Component {...pageProps} />;

	return (
		<>
			<DefaultDatoSEO siteTitle={siteTitle} site={pageProps.site} path={asPath} />
			<PageProvider value={{ ...page, isHome }}>
				<Layout title={siteTitle} menu={pageProps.menu || []} footer={pageProps.footer}>
					<Component {...pageProps} />
				</Layout>
			</PageProvider>
		</>
	);
}

export default App;
