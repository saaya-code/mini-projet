import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcrypt"
import dbConnect from "@/lib/db"
import User from "@/models/User"

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

        if (credentials.email === process.env.ADMIN_EMAIL || credentials.password === process.env.ADMIN_PASSWORD) {
          return {
            id: "ae58r9dptlf5gmlpo87t8y96",
            email: credentials.email,
            name: "Admin",
            role: "admin",
            image: "", // Replace with actual admin image path
          }
        }

        await dbConnect()

        try {
          const user = await User.findOne({ email: credentials.email }).select("+password")

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
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as "admin" | "professor" | "student"
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
