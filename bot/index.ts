"use strict";

import dotenv from "dotenv";
dotenv.config();
import { MessageEvent, TextMessage } from "@line/bot-sdk";
import { KaiaBotClient, createKaiaBotClient } from "./kaia_bot_client";
import { getSdkError } from "@walletconnect/utils";
import { Transaction } from "web3-types";

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
      case "hogehoge":
        fugafuga(bot, event);
        break;
      default:
        say_hello(bot, event);
    }
  }
});

bot.start();

async function say_hello(bot: KaiaBotClient, event: MessageEvent) {
  try {
    const to = event.source.userId || "";
    const messages: Array<TextMessage> = [
      {
        type: "text",
        text: "Hello world",
      },
    ];
    await bot.sendMessage(to, messages);
  } catch (e) {
    console.log(e);
  }
}

async function fugafuga(bot: KaiaBotClient, event: MessageEvent) {
  try {
    const to = event.source.userId || "";
    const messages: Array<TextMessage> = [
      {
        type: "text",
        text: "fugafuga",
      },
    ];
    await bot.sendMessage(to, messages);
  } catch (e) {
    console.log(e);
  }
}
