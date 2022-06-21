import { SlashCommandBuilder } from '@discordjs/builders'
import { GuildBasedChannel, Role } from 'discord.js'
import { Command } from '../types/command'

export const deletebot: Command = {
  data: new SlashCommandBuilder()
    .setName('deletebot')
    .setDescription(
      'Delete from the discord server.'
    ),

  async execute (interaction) {
    try {
      if (!interaction.isCommand() || interaction.commandName !== 'deletebot') { return }
      const guild = interaction.guild
      const ownerRole = guild.roles.cache.find((r: Role) => r.name === 'OWNER')
      const iclandCat = guild.channels.cache.find((c: GuildBasedChannel) => c.name === 'icland' && c.type === 'GUILD_CATEGORY')
      const iclandChannels = guild.channels.cache.filter((c: GuildBasedChannel) => c.parentId === iclandCat.id)

      iclandChannels.forEach(async c =>
        await c.delete()
      )
      await iclandCat.delete()
      await ownerRole.delete()
      await guild.leave()
    } catch (err) {
      console.log(err)
    }
  },

  help: {
    name: '',
    text: ''
  }
}
