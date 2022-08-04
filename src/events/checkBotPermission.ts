import { MessageEmbed, Role } from 'discord.js'
import { makeServerActor } from '../actors/makeServerActor'
import { DiscordClient } from '../types/discordClient'
import { Event, EventTypes } from '../types/event'
import type { Guild, NFTCanister } from '../types/guild'

const embed = new MessageEmbed()
  .setColor('#E82278')
  .setTitle('Error on ICLand bot!')
  .setDescription('During the process of verifying the users of your Discord server, we found an error. Apparently, the ICLand bot does not have the permissions necessary to assign the roles created to manage the NFT holders. Please, move the ICLand bot role to be above the holder roles. After doing that, use the reactivate normalize the bot on your server!')

export const checkBotPermission: Event = {
  name: 'ready',
  type: EventTypes.ONCE,
  async execute (client: DiscordClient) {
    const actor = makeServerActor()
    setInterval(async () => {
      const activeGuilds = await actor.getAllGuilds(true) as Guild[]

      activeGuilds.forEach(async (g: Guild) => {
        const discordGuild = client.guilds.cache.get(g.id)
        const botPosition = discordGuild.roles.cache.find((r: Role) => r.name === 'ICLand')
        const rolesPosition = g.collections.map((collection: NFTCanister) => {
          const role = discordGuild.roles.cache.find((r: Role) => r.name === collection.roleName)
          return role.position
        })

        const hasPermission = rolesPosition.every(position => position < botPosition.position)

        if (!hasPermission) {
          const ownerId = discordGuild.ownerId
          const members = await discordGuild.members.fetch()
          const owner = members.get(ownerId)
          await actor.updateGuild({
            ...g,
            isActive: false
          })
          await owner.send({ embeds: [embed] })
        }
      })
    }, 15 * 60 * 1000)
  }
}
