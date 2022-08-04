import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v10'
import { Collection } from 'discord.js'
import { readdir } from 'fs/promises'
import { join } from 'path'

import { Command } from '../types/command'
import { DiscordClient } from '../types/discordClient'
// import { help } from '../commands/help';

export const registerCommands = async (
  client: DiscordClient
): Promise<boolean> => {
  if (!client.id) {
    console.log('DISCORD_CLIENT_ID env variable not set.')
  }
  if (!client.guildId) {
    console.log('DISCORD_GUILD_ID env variable not set.')
  }

  try {
    console.log('Started refreshing application (/) commands.')
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN)

    const commandData = []

    const commandFiles = await readdir(
      join(process.cwd(), 'dist', 'commands'),
      'utf-8'
    )

    const commandFilteredFiles = commandFiles.filter((file) => file.endsWith('.js'))

    client.commands = new Collection()

    for (const file of commandFilteredFiles) {
      const fileData = await import(
        join(process.cwd(), 'dist', 'commands', file)
      )
      const name = file.split('.')[0]
      if (name !== 'help') {
        const command = fileData[name] as Command
        client.commands.set(command.data.name, command)
        commandData.push(command.data)
      }
    }

    // const helpCommandBuilder = help(client.commands);
    // cmdList.map((i) => [`/${i[0]}`, `/${i[0]}`])
    // const helpCommand = helpCommandBuilder['help'];
    // client.commands.set(helpCommand.data.name, helpCommand);
    // commandData.push(helpCommand.data);

    await rest.put(Routes.applicationCommands(client.id), {
      body: commandData
    })

    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
