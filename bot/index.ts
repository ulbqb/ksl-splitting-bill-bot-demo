"use strict";

import dotenv from "dotenv";
dotenv.config();
import { MessageEvent, TextMessage, TemplateMessage, messagingApi } from "@line/bot-sdk";
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
      case "Receipt":
        receipt(bot, event);
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
                label: "Receipt",
                text: "Receipt"
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

async function receipt(bot: KaiaBotClient, event: MessageEvent) {
  try {
    const to = event.source.userId || "";
    const messages: Array<messagingApi.FlexMessage> = [
      {
        type: "flex",
        altText: "recept",
        contents: {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: "RECEIPT",
                weight: "bold",
                color: "#1DB446",
                size: "sm"
              },
              {
                type: "text",
                text: "Carol's Birthday Party",
                weight: "bold",
                size: "xl",
                margin: "md"
              },
              {
                type: "separator",
                margin: "xxl"
              },
              {
                type: "box",
                layout: "vertical",
                margin: "xxl",
                spacing: "sm",
                contents: [
                  {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                      {
                        type: "text",
                        text: "Pizza x 2",
                        size: "sm",
                        color: "#555555",
                        flex: 0
                      },
                      {
                        type: "text",
                        text: "60KAIA",
                        size: "sm",
                        color: "#111111",
                        align: "end"
                      }
                    ]
                  },
                  {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                      {
                        type: "text",
                        text: "Potato x 2",
                        size: "sm",
                        color: "#555555",
                        flex: 0
                      },
                      {
                        type: "text",
                        text: "40KAIA",
                        size: "sm",
                        color: "#111111",
                        align: "end"
                      }
                    ]
                  },
                  {
                    type: "separator",
                    margin: "xxl"
                  },
                  {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                      {
                        type: "text",
                        text: "TOTAL",
                        size: "xs",
                        color: "#555555"
                      },
                      {
                        type: "text",
                        text: "100KAIA",
                        size: "sm",
                        color: "#111111",
                        align: "end"
                      }
                    ]
                  },
                  {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                      {
                        type: "text",
                        text: "NUMBER OF PEOPLE",
                        size: "xs",
                        color: "#555555"
                      },
                      {
                        type: "text",
                        text: "5",
                        size: "sm",
                        color: "#111111",
                        align: "end"
                      }
                    ]
                  },
                  {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                      {
                        type: "text",
                        text: "PAYER",
                        size: "xs",
                        color: "#555555"
                      },
                      {
                        type: "text",
                        text: "Shogo",
                        size: "sm",
                        color: "#111111",
                        align: "end"
                      }
                    ]
                  }
                ]
              }
            ]
          },
          styles: {
            footer: {
              separator: true
            }
          }
        },
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
    const textContent = "You → Shogo: 20KAIA"
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
