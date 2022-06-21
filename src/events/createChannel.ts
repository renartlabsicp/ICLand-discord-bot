import type { CategoryChannel, Guild, Role, TextChannel } from 'discord.js'
import { Event, EventTypes } from '../types/event'

const channelConfig = (
  guild: Guild,
  parent: CategoryChannel,
  name: string,
  everyoneRole: Role,
  specialRole?: Role

): Promise<TextChannel> => (
  guild.channels.create(name, {
    type: 'GUILD_TEXT',
    parent,
    permissionOverwrites: specialRole
      ? [{
          id: specialRole.id,
          allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
        },
        {
          id: everyoneRole.id,
          deny: ['VIEW_CHANNEL', 'SEND_MESSAGES']

        }]
      : [{
          id: guild.id,
          allow: ['VIEW_CHANNEL']
        },
        {
          id: everyoneRole.id,
          deny: ['SEND_MESSAGES']
        }]
  })
)

export const createChannel: Event = {
  name: 'roleCreate',
  type: EventTypes.ON,
  async execute (role: Role) {
    if (role.name !== 'OWNER') return
    const guild: Guild = role.guild
    const everyoneRole: Role = guild.roles.cache.find(r => r.name === '@everyone')

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
      channelConfig(guild, cat, 'verification', everyoneRole)
      channelConfig(guild, cat, 'activity', everyoneRole, role)
      channelConfig(guild, cat, 'owners', everyoneRole, role)
    })
  }
}
