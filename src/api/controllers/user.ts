import { Request, Response } from 'express'
import { client } from '../..'
import { makeServerActor } from '../../actors/makeServerActor'
import { asyncFilterGuilds, fetchMembers } from '../../utils/asyncFilterGuilds'
import { manageRole } from '../../utils/manageRole'
import type { Guild } from '../../types/guild'

class UserController {
  public async create (req: Request, res: Response): Promise<Response> {
    const { body: user } = req
    const actor = makeServerActor()

    const activeGuilds: [Guild] | any = await actor.getAllGuilds(true)

    const filteredGuilds = await asyncFilterGuilds(
      activeGuilds,
      async (g) => fetchMembers(g, client),
      user.discordId
    )

    filteredGuilds.forEach(async (g: Guild) => {
      g.collections.forEach(async (collection) => {
        const discGuild = client.guilds.cache.get(g.id)
        const member = await discGuild.members.fetch(user.discordId)

        await manageRole(collection, discGuild, member, user)
      })
    })

    return res.json({})
  }
}

export default new UserController()
