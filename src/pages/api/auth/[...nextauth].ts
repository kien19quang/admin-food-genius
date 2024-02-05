import NextAuth, { NextAuthOptions } from "next-auth"
import FacebookProvider from "next-auth/providers/facebook"
import { Provider } from "next-auth/providers/index"
import Credentials from 'next-auth/providers/credentials';
import UserRepository from "@/services/Repositories/UserRepository";
import dayjs from "dayjs";


const providers: Provider[] = [
  FacebookProvider({
    clientId: process.env.FACEBOOK_CLIENT_ID || "",
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    authorization: {
      params: {
        scope: 'public_profile read_insights',
      },
    },
    id: 'facebook',
  }),
  Credentials({
    id: 'credentials',
    name: 'Credentials',
    credentials: {
      email: {
        label: 'Email',
        type: 'text'
      },
      password: {
        label: 'Password',
        type: 'passord'
      }
    },
    authorize: async (credentials: Record<"email" | "password", string> | undefined, req) => {
      if (!credentials?.email || !credentials?.password) {
        throw new Error('Email and password required');
      }
      
      const user = await UserRepository.login({ email: credentials.email, password: credentials.password })

      return user
    },
  })
]

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    jwt: async({token, user}) => {
      if (user) {
        return {...token, ...user}
      }

      if (dayjs().valueOf() > token.expiresIn && token.refreshToken) {
        return await UserRepository.refreshToken(token)
      }

      return token
    },
    session: async({session, token}) => {
      session.accessToken = token.accessToken
      session.user = token.user;
      session.expiresIn = token.expiresIn;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/_error'
  },
  logger: {
    error(code, metadata) {
      console.log(code, metadata)
    },
    warn(code) {
      console.log(code)
    },
    debug(code, metadata) {
      console.log(code, metadata)
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.JWT_SECRET_KEY
}

export default NextAuth(authOptions)