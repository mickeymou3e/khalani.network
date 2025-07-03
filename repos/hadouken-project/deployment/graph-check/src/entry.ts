import { DiscordNotifier } from "./discord";
import { Graphql } from "./graphql";

export const handler = async (event) => {
  try {
    const graphql = new Graphql();
    const discordNotifier = new DiscordNotifier();

    const graphStatus = await graphql.checkStatus();

    if (!graphStatus.status) {
      const message = discordNotifier.getFormattedText(
        graphql.name,
        graphStatus.reason
      );
      await discordNotifier.sendMessage(message);
    }
    return graphStatus;
  } catch (e) {
    console.error(e);
    return {
      status: false,
      reason: "Unknown error main function",
    };
  }
};
