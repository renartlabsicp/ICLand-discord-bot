import type { CategoryChannel, Guild, Role } from 'discord.js'

export const configChannel = async (botRole: Role, everyoneRole: Role, guild: Guild, name: string, parent: CategoryChannel) => {
  guild.channels.create(name, {
    type: 'GUILD_TEXT',
    parent,
    permissionOverwrites: [
      {
        id: everyoneRole.id,
        allow: ['VIEW_CHANNEL']
      },
      {
        id: botRole.id,
        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
      },
      {
        id: everyoneRole.id,
        deny: ['SEND_MESSAGES']
      }
    ]
  })
}

export const configSpecialChannel = async (everyoneRole: Role, guild: Guild, name: string, parent: any, specialRole: Role) => {
  guild.channels.create(name, {
    type: 'GUILD_TEXT',
    parent,
    permissionOverwrites: [
      {
        id: specialRole.id,
        allow: ['SEND_MESSAGES', 'VIEW_CHANNEL']
      },
      {
        id: everyoneRole.id,
        deny: ['SEND_MESSAGES', 'VIEW_CHANNEL']
      }
    ]
  })
}
