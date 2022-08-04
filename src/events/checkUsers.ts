import { makeServerActor } from '../actors/makeServerActor'
import { DiscordClient } from '../types/discordClient'
import { Event, EventTypes } from '../types/event'
import { Guild } from '../types/guild'
import { User } from '../types/user'
import { fetchMembers } from '../utils/asyncFilterGuilds'
import { manageRole } from '../utils/manageRole'

export const checkUsers: Event = {
  name: 'ready',
  type: EventTypes.ONCE,
  async execute (client: DiscordClient) {
    const serverActor = makeServerActor()
    setInterval(async () => {
      const users: [User] | any = await serverActor.getAllUsers(true)
      const activeGuilds: [Guild] | any = await serverActor.getAllGuilds(true)
      const guildMembers = await Promise.all(activeGuilds.map((g: Guild) => (
        fetchMembers(g, client)
      )))
      const guildMembersCollection = {}
      guildMembers.forEach((members, index) => {
        guildMembersCollection[activeGuilds[index].id] = members
      })

      users.forEach(async (user: User) => {
        activeGuilds.forEach(async (g: Guild) => {
          const member = guildMembersCollection[g.id].get(user.discordId)
          if (member) {
            const discordGuild = client.guilds.cache.get(g.id)
            g.collections.forEach(async (collection) => {
              await manageRole(collection, discordGuild, member, user)
            })
          }
        })
      })
    }, 30 * 60 * 1000)
  }
}
