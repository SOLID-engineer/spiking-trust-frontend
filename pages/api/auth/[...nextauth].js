/* eslint-disable no-param-reassign */
import axios from 'axios';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const options = {
  providers: [
    Providers.Credentials({
      id: 'credentials-facebook',
      credentials: { facebook: { type: 'text' } },
      authorize: async (credentials) => {
        const response = await axios.post('/login', { facebook: credentials.facebook });
        return response.data;
      },
    }),
    Providers.Credentials({
      id: 'credentials-google',
      credentials: { google: { type: 'text' } },
      authorize: async (credentials) => {
        const response = await axios.post('/login', { google: credentials.google });
        return response.data;
      },
    }),
  ],
  callbacks: {
    async session(session, data) {
      session.accessToken = data.accessToken;
      session.user = data.user;
      return session;
    },
    async jwt(token, data) {
      if (data) {
        token.accessToken = data.accessToken;
        token.user = data.user;
      }
      return token;
    },
  },
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  debug: true,
};

export default (req, res) => NextAuth(req, res, options);
