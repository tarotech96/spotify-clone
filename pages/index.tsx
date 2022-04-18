import type { NextPage } from 'next'
import { getSession } from 'next-auth/react'
import Head from 'next/head'
import Center from '../components/Center'
import Player from '../components/Player'
import SideBar from '../components/SideBar'

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Spotify</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen overflow-hidden bg-black">
        <SideBar />
        <Center />
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  )
}

export default Home

// export async function getServerSideProps(context: any) {
//   console.log(context);
//   const session = await getSession(context);

//   return {
//     props: {
//       session,
//     },
//   }
// }
