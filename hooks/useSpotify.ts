import { useSession, signIn } from 'next-auth/react';
import React, { useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
})

function useSpotify() {
  const { data: session } = useSession();

  useEffect(() => {

    if(session) {
      if(session.error === 'Something went wrong when refreshing token') {
        signIn();
      }
    }
    
    spotifyApi.setAccessToken(session?.user.accessToken);

  }, [session])

  return spotifyApi;
}

export default useSpotify