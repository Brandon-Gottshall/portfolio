import 'tailwindcss/tailwind.css'
import Layout from '../components/Layout'
import Head from 'next/head'

function MyApp ({ Component, pageProps }) {
  return (
    <Layout>
      <Head>
        <title>Brandon Gottshall - Gott Code</title>
        <link rel='icon' href='favicon.ico' />

      </Head>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
