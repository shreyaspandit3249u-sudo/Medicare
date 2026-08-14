import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
      const isPublicRoute = ["/", "/login", "/register", "/manifest.webmanifest", "/favicon.ico"].includes(nextUrl.pathname) || nextUrl.pathname.startsWith("/icons")

      if (isApiAuthRoute) return true

      if (isPublicRoute) {
        if (isLoggedIn && (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")) {
          return Response.redirect(new URL("/medicines", nextUrl))
        }
        return true
      }

      const isMobileSub = nextUrl.pathname === "/manifest.json" || nextUrl.pathname === "/sw.js"
      if (isMobileSub) return true

      return isLoggedIn
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      } else if (!token.id && token.sub) {
        // Fallback for sub if id is missing in some contexts
        token.id = token.sub
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  providers: [], // Add empty providers array as it's required for the type
} satisfies NextAuthConfig
