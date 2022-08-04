import type { Guild, Role } from 'discord.js'
import { Event, EventTypes } from '../types/event'
import { configChannel } from '../utils/configChannels'

export const createChannel: Event = {
  name: 'guildCreate',
  type: EventTypes.ON,
  async execute (guild: Guild) {
    const everyoneRole: Role = guild.roles.cache.find(r => r.name === '@everyone')
    const botRole: Role = guild.roles.cache.find(r => r.name === 'ICLand')

    guild.channels.create('icland', {
      type: 'GUILD_CATEGORY',
      position: 1,
      permissionOverwrites: [
        {
          id: guild.id,
          allow: ['VIEW_CHANNEL']
        }
      ]
    }).then(cat => {
      configChannel(botRole, everyoneRole, guild, 'verification', cat)
      configChannel(botRole, everyoneRole, guild, 'listing', cat)
      configChannel(botRole, everyoneRole, guild, 'sales', cat)
    })
  }
}
