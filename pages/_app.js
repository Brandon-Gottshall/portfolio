import 'tailwindcss/tailwind.css'
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import Layout from '../components/Layout'

const firebaseConfig = {
  apiKey: 'AIzaSyDPnj8N8e7t1u5RqfBcABAEjJKQ5ypWRT8',
  authDomain: 'portfolio-ee2a0.firebaseapp.com',
  projectId: 'portfolio-ee2a0',
  storageBucket: 'portfolio-ee2a0.appspot.com',
  messagingSenderId: '943464959167',
  appId: '1:943464959167:web:6e6845d6757dda52798a0a',
  measurementId: 'G-YW042E2BKS'
}

function MyApp ({ Component, pageProps }) {
  const app = initializeApp(firebaseConfig)
  const database = getDatabase(app)
  return (
    <Layout>
      <Component {...pageProps} database={database} />
    </Layout>
  )
}

export default MyApp
