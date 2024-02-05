import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      BACKEND_URL: string;
      JWT_SECRET_KEY: string;
      JWT_REFRESH_TOKEN: string
    }
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      _id: string;
      email: string;
      name: string;
    }
    accessToken: string
    refreshToken: string;
    expiresIn: number;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    accessToken: string;
    refreshToken: string;
    user: {
      _id: string;
      email: string;
      name: string;
    };
    expiresIn: number;
  }
}
