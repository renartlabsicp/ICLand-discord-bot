import { Request, Response } from 'express'
import { client } from '../..'
import { configSpecialChannel } from '../../utils/configChannels'
import type { CategoryChannel, Role } from 'discord.js'
import type { NFTCanister } from '../../types/guild'

class GuildController {
  public async healthCheck (req: Request, res: Response): Promise<Response> {
    const { body: guild } = req

    const resp = client.guilds.cache.has(guild.id)

    return res.json({
      status: resp
    })
  }

  public async create (req: Request, res: Response): Promise<Response> {
    const { body: guild } = req
    const { collections } = guild

    const discordGuild = client.guilds.cache.get(guild.id)
    const iclandChannel = discordGuild.channels.cache.find((c: CategoryChannel) => c.name === 'icland')
    const everyoneRole = discordGuild.roles.cache.find((r: Role) => r.name === '@everyone')

    collections.forEach(async (collection: NFTCanister) => {
      const botRole = discordGuild.roles.cache.find((r: Role) => r.name === 'ICLand')
      await discordGuild.roles.create({
        hoist: true,
        name: collection.roleName,
        position: botRole.position - 1
      })

      const roles = await discordGuild.roles.fetch()
      const newRole = roles.find((r: Role) => r.name === collection.roleName)

      configSpecialChannel(everyoneRole, discordGuild, collection.roleName, iclandChannel, newRole)
    })

    return res.json({
      status: true
    })
  }
}

export default new GuildController()
