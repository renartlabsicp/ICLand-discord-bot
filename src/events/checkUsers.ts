import fetch from 'cross-fetch'
import { HttpAgent } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { getNFTActor } from '@psychedelic/dab-js'
import { makeServerActor } from '../actors/makeServerActor'
import { DiscordClient } from '../types/discordClient'
import { Event, EventTypes } from '../types/event'
import { Guild } from '../types/guild'
import { User } from '../types/user'
import { asyncFilterGuilds, fetchMembers } from '../utils/asyncFilterGuilds'

export const checkUsers: Event = {
  name: 'ready',
  type: EventTypes.ONCE,
  async execute (client: DiscordClient) {
    const serverActor = makeServerActor()
    setInterval(async () => {
      const users: [User] | any = await serverActor.getAllUsers()
      const activeGuilds: [Guild] | any = await serverActor.getAllGuilds()

      users.forEach(async (user: User) => {
        const filteredGuilds = await asyncFilterGuilds(
          activeGuilds,
          async (g) => fetchMembers(g, client),
          user.discordId
        )

        filteredGuilds.forEach(async (g: Guild) => {
          const nftActor = getNFTActor({
            canisterId: g.nftCanisterId,
            agent: new HttpAgent({
              fetch,
              host: 'https://ic0.app'
            }),
            standard: g.nftStandard
          })
          const discGuild = client.guilds.cache.get(g.id)
          const member = await discGuild.members.fetch(user.discordId)
          const role = discGuild.roles.cache.find(r => r.name === 'Holder')
          const hasRole = member.roles.cache.has(role.id)

          try {
            const userNFTs = await nftActor.getUserTokens(Principal.fromText(user.id))
            const hasNFT = !!userNFTs.length

            if (!hasNFT && hasRole) {
              member.roles.remove(role)
            } else if (hasNFT && !hasRole) {
              member.roles.add(role)
            }
          } catch (err) {
            if (hasRole) {
              member.roles.remove(role)
            }
          }
        })
      })
    }, 15 * 1000)
  }
}
