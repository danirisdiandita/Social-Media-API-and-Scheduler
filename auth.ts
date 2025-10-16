import { prisma } from "@/lib/prisma"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === "google") {
        const isVerified = profile?.email_verified ? true : false
        // insert to database if user is not exists or else insert 

        const existingUser = await prisma.user.findFirst({
          where: {
            email: profile?.email as string
          }
        })


        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: profile?.email as string,
              first_name: profile?.given_name || "",
              last_name: profile?.family_name || "",
              created_at: new Date(),
              updated_at: new Date(),
              verified: isVerified
            }
          })
        }
        return isVerified
      } else if (account?.provider === "credentials") {
        if (user) {
          return true
        } else {
          // throw new Error("User not found")
          return false
        }
      } else {
        return false
      }
    },

    async jwt({ token, trigger, session }) {
      if (trigger === "update" && session?.name) {
        token.name = session.name
      }

      if (trigger === 'update' && session?.image) {
        token.image = session.image
      }
      return token
    },

    async redirect({ url, baseUrl }) {
      return url
    },
  },
  jwt: {
    maxAge: 24 * 60 * 60 * 30
  },
  session: {
    maxAge: 24 * 60 * 60 * 30,
    strategy: "jwt"
  }
})