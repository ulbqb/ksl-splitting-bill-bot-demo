"use strict";

import dotenv from "dotenv";
dotenv.config();
import { MessageEvent, TextMessage, TemplateMessage } from "@line/bot-sdk";
import { KaiaBotClient, createKaiaBotClient } from "./kaia_bot_client";

const bot = createKaiaBotClient({
  sbUrl: process.env.SUPABASE_URL ?? "",
  sbKey: process.env.SUPABASE_KEY ?? "",
  sbChannelId: process.env.SUPABASE_CHANNEL_ID ?? "",
  lineAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN ?? "",
  wcProjectId: process.env.WALLET_CONNECT_PROJECT_ID ?? "",
  rpcEndpoint: process.env.RPC_ENDPOINT ?? "",
});

bot.on("message", (event: MessageEvent) => {
  if (event.message.type == "text") {
    switch (event.message.text) {
      case "Please tell me receipt.":
        receipt(bot, event);
        break;
      case "How much is my payment?":
        payment(bot, event);
        break;
      default:
        commandNotFound(bot, event);
    }
  }
});

bot.start();

async function commandNotFound(bot: KaiaBotClient, event: MessageEvent) {
  try {
    const to = event.source.userId || "";
    const messages: Array<TextMessage> = [
      {
        type: "text",
        text: "Please provide the specific request.",
      },
    ];
    await bot.sendMessage(to, messages);
  } catch (e) {
    console.log(e);
  }
}

async function receipt(bot: KaiaBotClient, event: MessageEvent) {
  try {
    const to = event.source.userId || "";
    const content = `Carol Brithday Party
【receipt】
pizza x 2
potato x 2
total: 100KAIA
payer: recipient`
    const messages: Array<TextMessage> = [
      {
        type: "text",
        text: content,
      },
    ];
    await bot.sendMessage(to, messages);
  } catch (e) {
    console.log(e);
  }
}

async function payment(bot: KaiaBotClient, event: MessageEvent) {
  try {
    const to = event.source.userId || "";
    const textContent = `Your payment is 20KAIA to recipient. 
Please push the button to pay recipient.`
    const messages: Array<TemplateMessage> = [
      {
        type: "template",
        altText: "This is a buttons template",
        template: {
          type: "buttons",
          text: textContent,
          actions: [
            {
              type: "uri",
              label: "Go to pay",
              uri: "https://ksl-splitting-bill-demo.vercel.app/?amount=20"
            }
          ]
        }
      },
    ];
    await bot.sendMessage(to, messages);
  } catch (e) {
    console.log(e);
  }
}
