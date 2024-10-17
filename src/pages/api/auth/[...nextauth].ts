import NextAuth, { AuthOptions } from "next-auth";
import DCProvider from "next-auth/providers/discord";
import { rest } from "@/utils/discordRest";
import { Routes } from "discord-api-types/v10";

export const authOptions: AuthOptions = {
  providers: [
    DCProvider({
      clientId: process.env.DISCORD_ID!,
      clientSecret: process.env.DISCORD_SECRET!,
      authorization: {
        params: {
          scope: "identify email guilds.join",
        },
      },
    }),
  ],
  callbacks: {
    signIn: async ({ account }) => {
      if (account) {
        try {
          const exists = await rest
            .get(
              Routes.guildMember(
                process.env.DISCORD_GUILDID!,
                account.providerAccountId
              )
            )
            .catch(() => false);

          if (!exists) {
            await rest.put(
              Routes.guildMember(
                process.env.DISCORD_GUILDID!,
                account.providerAccountId
              ),
              {
                body: {
                  access_token: account.accessToken,
                },
              }
            );
          }
        } catch (error) {
          console.error(error);
          return false;
        }
      }

      return true;
    },
    jwt: async ({ token, account }) => {
      if (account) {
        token.email = account.providerAccountId;
      }
      return token;
    },
  },
};
export default NextAuth(authOptions);
