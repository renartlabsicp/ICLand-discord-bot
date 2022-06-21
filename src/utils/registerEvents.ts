import { readdir } from 'fs/promises'
import { join } from 'path'

import type { DiscordClient } from '../types/discordClient'
import { EventTypes } from '../types/event'

export const registerEvents = async (
  client: DiscordClient
): Promise<boolean> => {
  if (!client.id) {
    console.log('DISCORD_CLIENT_ID env variable not set.')
  }
  if (!client.guildId) {
    console.log('DISCORD_GUILD_ID env variable not set.')
  }

  try {
    console.log('Started refreshing application events.')

    // const eventsData = []

    const eventFiles = await readdir(
      join(process.cwd(), 'dist', 'events'),
      'utf-8'
    )

    const eventFilteredFiles = eventFiles.filter((file) => file.endsWith('.js'))

    for (const file of eventFilteredFiles) {
      const fileData = await import(
        join(process.cwd(), 'dist', 'events', file)
      )
      const name = file.split('.')[0]
      const event = fileData[name]
      switch (event.type) {
        case (EventTypes.EMIT):
          client.emit(event.name, (...args) => event.execute(...args))
          break
        case (EventTypes.ON):
          client.on(event.name, (...args) => event.execute(...args))
          break
        case (EventTypes.ONCE):
          client.once(event.name, (...args) => event.execute(...args))
          break
      }
    }

    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
