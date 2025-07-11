import { withAuth } from "next-auth/middleware";

export default withAuth(async function middleware() {}, {
  callbacks: {
    async authorized({ req, token }) {
      const { pathname } = req.nextUrl;
      if (pathname.startsWith("/") && pathname !== "/" && token === null) {
        return false;
      }
      return true;
    },
  },
});
