import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials.email as string
        const password = credentials.password as string

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) return null

        return {
          id: user.id.toString(),
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const isVerified = profile?.email_verified ? true : false

        const existingUser = await prisma.user.findFirst({
          where: {
            email: profile?.email as string,
          },
        })

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: profile?.email as string,
              first_name: profile?.given_name || "",
              last_name: profile?.family_name || "",
              created_at: new Date(),
              updated_at: new Date(),
              verified: isVerified,
            },
          })
        }
        return isVerified
      } else if (account?.provider === "credentials") {
        return !!user
      }
      return false
    },

    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id
      }

      if (trigger === "update" && session?.name) {
        token.name = session.name
      }

      if (trigger === "update" && session?.image) {
        token.image = session.image
      }
      return token
    },

    async redirect({ url, baseUrl }) {
      return url
    },
  },
  jwt: {
    maxAge: 24 * 60 * 60 * 30,
  },
  session: {
    maxAge: 24 * 60 * 60 * 30,
    strategy: "jwt",
  },
})