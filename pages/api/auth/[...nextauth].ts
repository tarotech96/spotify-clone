import NextAuth from 'next-auth'
import SpotifyProvider from 'next-auth/providers/spotify';
import spotifyApi, { LOGIN_URL } from '../../../lib/spotify';


async function refreshAccessToken(token: any) {
  try {

    spotifyApi.setAccessToken(token.accessToken);
    spotifyApi.setRefreshToken(token.refreshToken);

    // process refresh token
    const { body: refreshToken } = await spotifyApi.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshToken.access_token,
      accessTokenExpires: Date.now() + refreshToken.expires_in * 1000,
      refreshToken: refreshToken.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.error(error);
    return {
      ...token,
      error: 'Something went wrong when refreshing token'
    }
  }
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: LOGIN_URL
    })
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, user }) {
      const accessTokenExpires = token && token.accessTokenExpires as number;

      // initial signin
      // reference to token nextauth token rotation
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          username: account.providerAccountId,
          accessTokenExpiresAt: account.expires_at && account.expires_at * 1000,
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < accessTokenExpires) {
        console.log('Existing token still valid');
        return token;
      }

      // Access token has expired, so we need to refresh it
      console.log('Access token expired, refreshing...');
      return await refreshAccessToken(token);

    },

    async session({ session, token }) {

      if (session.user) {
        // Object.assign(session.user, {
        //   ...session.user,
        //   accessToken: token.accessToken,
        //   refreshToken: token.refreshToken,
        //   username: token.username,
        // })
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.username = token.username;
      }
      return session;
    }
  }
})