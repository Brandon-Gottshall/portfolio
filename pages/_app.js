import 'tailwindcss/tailwind.css'
import Layout from '../components/Layout'
import { ContextWrapper } from '../context/AppContext'

function MyApp ({ Component, pageProps }) {
  return (
    <ContextWrapper>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ContextWrapper>
  )
}

export default MyApp
