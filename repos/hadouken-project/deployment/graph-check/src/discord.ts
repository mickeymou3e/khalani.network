import * as dedent from "dedent-js";

export class DiscordNotifier {
  private webhookAddress: string;

  constructor() {
    this.webhookAddress = process.env.DiscordWebhook;
  }

  getFormattedText(graphName: string, reason: string): string {
    return dedent`${graphName} - is not working ❌
    Reason: ${reason}`;
  }

  async sendMessage(message: string) {
    await fetch(this.webhookAddress, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
      }),
    });
  }
}
