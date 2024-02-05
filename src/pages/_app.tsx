import NextHead from '@/components/Common/NextHead/NextHead';
import EmptyLayout from '@/layouts/EmptyLayout/EmptyLayout';
import { AppPropsWithLayout } from '@/models/common';
import '@/styles/antdConfig.scss';
import '@/styles/globals.scss';
import Theme from '@/styles/theme';
import { SessionProvider } from 'next-auth/react';
import NextNProgress from 'nextjs-progressbar';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppPropsWithLayout) {
  const Layout = Component.Layout ?? EmptyLayout;

  return Theme(
    <>
      <NextHead />
      <SessionProvider session={session} refetchOnWindowFocus={false} refetchInterval={10 * 60}>
        <Layout>
          <NextNProgress color="#0bcb6b" startPosition={0.1} stopDelayMs={200} height={2} showOnShallow={true} />
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </>
  )
}
