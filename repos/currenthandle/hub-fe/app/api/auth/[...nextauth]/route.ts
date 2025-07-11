import NextAuth, { NextAuthOptions } from "next-auth";

const handler = NextAuth({
  providers: [
    {
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      id: "ezkl",
      name: "ezkl",
      type: "oauth",
      wellKnown: `${process.env.EZKL_HUB_URL}/auth/.well-known/openid-configuration`,
      authorization: { params: { scope: "openid profile" } },
      token: `${process.env.EZKL_HUB_URL}/auth/oidc/token`,
      userinfo: `${process.env.EZKL_HUB_URL}/auth/oidc/userinfo`,
      checks: ["nonce"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          image: profile.avatarUrl,
          email: profile.email,
        };
      },
    },
  ],
  pages: {
    signIn: "/",
  },
});

export { handler as GET, handler as POST };
