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
      case "Payment statement":
        paymentStatement(bot, event);
        break;
      case "Pay":
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
        text: "Hello. Let's start making payment",
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "message",
                label: "Payment statement",
                text: "Payment statement"
              }
            },
            {
              type: "action",
              action: {
                type: "message",
                label: "Pay",
                text: "Pay"
              }
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

async function paymentStatement(bot: KaiaBotClient, event: MessageEvent) {
  try {
    const to = event.source.userId || "";
    const content = `🎉Carol Brithday Party🎉
【Payment statement】
Total: 100KAIA
Number of people: 5
Payer: shogo`
    const messages: Array<TextMessage> = [
      {
        type: "text",
        text: content,
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "message",
                label: "Pay",
                text: "Pay"
              }
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

async function payment(bot: KaiaBotClient, event: MessageEvent) {
  try {
    const to = event.source.userId || "";
    const textContent = "You → shogo: 20KAIA"
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
              label: "Proceed to Payment",
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
