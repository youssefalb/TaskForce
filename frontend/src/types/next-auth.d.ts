import { Role } from "@prisma/client"
import NextAuth, { DefaultSession } from "next-auth"
import { JWT, DefaultUser } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: User
  }

  interface User {
    email?: string
    role?: Role
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
    accessToken?: string
    role?: Role
  }
}
