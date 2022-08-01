import {Adapter, Logger, Schema} from '@satorijs/satori'
import { QQGuildBot } from './bot'

const logger = new Logger('qqguild')

export class WsClient extends Adapter.Client<QQGuildBot> {
  async start(bot: QQGuildBot) {
    Object.assign(bot, await bot.getSelf())
    await bot.internal.startClient(bot.config.intents)
    bot.internal.on('ready', bot.online.bind(bot))
    bot.internal.on('message', msg => {
      const session = bot.adaptMessage(msg)
      if (session) bot.dispatch(session)
    })
    bot.internal.on('error', error => logger.error(error))
  }

  async stop(bot: QQGuildBot) {
    bot.internal.stopClient()
    bot.offline()
  }
}

export namespace WsClient {
  export interface Config extends Adapter.WsClient.Config {}

  export const Config: Schema<Config> = Schema.intersect([
    Adapter.WsClient.Config,
  ])
}
