import 'tailwindcss/tailwind.css'
import Layout from '../components/Layout'
import Head from 'next/head'

function MyApp ({ Component, pageProps }) {
  return (
    <Layout>
        <Head>
          <title>Brandon Gottshall - Gott Code</title>
          <link rel='icon' href='favicon.ico' />
          {/* Font Loading */}
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />
          <link
            href='https://fonts.googleapis.com/css2?family=Oxanium:wght@200;400&display=swap'
            rel='stylesheet'
          />
        </Head>
        <Component {...pageProps} />
      </Layout>
  )
}

export default MyApp
