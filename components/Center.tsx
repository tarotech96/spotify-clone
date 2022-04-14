import { ChevronDownIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { shuffle } from 'lodash'
import { useRecoilState, useRecoilValue } from 'recoil'
import { playlistIdState, playlistState } from '../atoms/playlistAtom'
import useSpotify from '../hooks/useSpotify'
import Songs from './Songs'

const defaultAvatar =
  'https://scontent.fhan3-5.fna.fbcdn.net/v/t39.30808-1/271706629_2204007059739692_2552037973838356429_n.jpg?stp=dst-jpg_p160x160&_nc_cat=109&ccb=1-5&_nc_sid=7206a8&_nc_ohc=lPEnoo78Xu0AX--VYds&_nc_ht=scontent.fhan3-5.fna&oh=00_AT8yj-8sAuFgxtmvqZD3c4skvmcyswkr3Fauf3zYBwOOHw&oe=625CAF93'

const colors = [
  'from-indigo-500',
  'from-red-500',
  'from-blue-500',
  'from-green-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
]

const Center: React.FC = () => {
  const { data: session } = useSession()
  const spotifyApi = useSpotify()
  const [color, setColor] = useState<string>('')
  const [playlist, setPlaylist] = useRecoilState<any>(playlistState)
  const playlistId = useRecoilValue(playlistIdState)

  useEffect(() => {
    // Create shuffled array of colors by using shuffle and set last item to color
    setColor(shuffle(colors)[colors.length - 1])
  }, [playlistId])

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body)
      })
      .catch((err) => {
        console.error('Something went wrong retrieving playlist', err)
      })
  }, [playlistId, spotifyApi])

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div className="flex cursor-pointer items-center space-x-3 rounded-full bg-red-300 p-1 pr-2 text-white opacity-90 hover:opacity-80">
          <img
            className="h-10 w-10 rounded-full"
            src={session?.user?.image || defaultAvatar}
            alt="avatar"
          />
          <h2>{session?.user?.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>

      <section
        className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 p-8 text-white`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt=""
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className="xl:text-5l text-2xl font-bold md:text-3xl">
            {playlist?.name}
          </h1>
        </div>
      </section>

      {/* Songs of the playlist */}
      <div>
        <Songs />
      </div>
    </div>
  )
}

export default Center
