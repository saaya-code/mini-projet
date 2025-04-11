import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import dbConnect from "@/lib/db"
import User, {type IUser} from "@/models/User"

type UserType = IUser & {_id: typeof Object}
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        await dbConnect()

        try {
          const user:UserType = await User.findOne({ email: credentials.email }).select("+password")

          if (!user) {
            return null
          }

          const passwordMatch = await compare(credentials.password, user.password)

          if (!passwordMatch) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
        } catch (error) {
          console.error("Authentication error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        if ("role" in user) {
          token.role = user.role
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session && session.user) {
        session.user = {
          ...session.user,
          id: token.id as string,
          role: token.role as "admin" | "professor" | "student"
        } as any
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
