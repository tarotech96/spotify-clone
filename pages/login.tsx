import React from 'react'
import { getProviders, signIn } from 'next-auth/react'

const Login: React.FC<{ providers: any }> = ({ providers }) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-black">
      <img
        src="https://links.papareact.com/9xl"
        alt="spotify-icon"
        className="mb-5 w-52"
      />

      {Object.values(providers).map((provider: any) => {
        return (
          <button
            key={provider.name}
            className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
            onClick={() =>
              signIn(provider.id, {
                callbackUrl: '/',
              })
            }
          >
            Login with {provider.name}
          </button>
        )
      })}
    </div>
  )
}
export default Login

export async function getServerSideProps() {
  const providers = await getProviders()

  return {
    props: {
      providers,
    },
  }
}
