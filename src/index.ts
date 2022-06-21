import 'dotenv/config'
import { Client } from 'discord.js'
import { registerCommands } from './utils/registerCommands'
import { registerEvents } from './utils/registerEvents'
import { createServer } from './api'
import type { DiscordClient } from './types/discordClient'

const token = process.env.DISCORD_TOKEN
const port = process.env.PORT || 8080

export const client = new Client({
  intents: ['GUILDS']
}) as DiscordClient

const api = createServer(client)

api.listen(port, () => {
  console.log('Express server is listening on port 8080')
});

(async (): Promise<void> => {
  client.id = process.env.DISCORD_CLIENT_ID || ''
  client.guildId = process.env.DISCORD_GUILD_ID || ''
  const registerCommandsSuccess = await registerCommands(client)

  if (registerCommandsSuccess) {
    console.log('All bot commands registered in Guild.')
  } else {
    console.log('Failed to register bot commands.')
  }

  const registerEventsSuccess = await registerEvents(client)

  if (registerEventsSuccess) {
    console.log('All bot events registered in Guild.')
  } else {
    console.log('Failed to register bot events.')
  }
})()

client.once('ready', () => {
  console.log('Discord client is ready!')
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return
  const command = client.commands.get(interaction.commandName)
  if (!command) return
  try {
    await command.execute(interaction)
  } catch (error) {
    console.log(error)
    return interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true
    })
  }
})

client.login(token)
