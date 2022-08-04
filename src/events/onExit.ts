import type { Guild } from 'discord.js'
import { makeServerActor } from '../actors/makeServerActor'
import { Event, EventTypes } from '../types/event'
import type { Guild as ServerGuild } from '../types/guild'

export const onExit: Event = {
  name: 'guildDelete',
  type: EventTypes.ON,
  async execute (guild: Guild) {
    const serverActor = makeServerActor()
    const guildInfo: ServerGuild = await serverActor.getGuild(guild.id) as ServerGuild

    const body = {
      ...guildInfo,
      isActive: false
    }

    await serverActor.updateGuild(body)
  }
}
