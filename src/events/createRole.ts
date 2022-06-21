import { Guild } from 'discord.js'
import { Event, EventTypes } from '../types/event'

export const createRole: Event = {
  name: 'guildCreate',
  type: EventTypes.ON,
  async execute (guild: Guild) {
    guild.roles.create({
      name: 'Holder',
      color: 'PURPLE',
      reason: 'This role is needed to manage the users that have at least 1 NFT from the organization collection!'
    })
  }
}
