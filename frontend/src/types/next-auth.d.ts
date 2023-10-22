import { Role } from "@prisma/client"
import NextAuth, { DefaultSession } from "next-auth"
import { JWT, DefaultUser } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: User
  }

interface User {
  email?: string;
  username?: string;
  role?: string;
  id?: string;
  first_name?: string;
  last_name?: string;
  image?: string;
  sex?: string;
  is_staff?: boolean;
  is_active?: boolean;
  date_joined?: string; 
  accessToken?: string;
  emailVerified?: boolean;
  provider?: string;
}



  interface Profile {
    family_name?: string
    given_name?: string
    picture?: string
    email_verified?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    username?: string
    accessToken?: string
    role?: Role
    email?: string
    first_name?: string
    last_name?: string
    image?: string
    is_active?: boolean
    emailVerified?: boolean
    provider?: string
  }
}
