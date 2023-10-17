import type { NextPage } from 'next'
import Head from 'next/head'
// import styles from './index.module.css'
import { App } from '../components/App'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>hostd</title>
      </Head>
      <App />
    </>
  )
}

export default Home
