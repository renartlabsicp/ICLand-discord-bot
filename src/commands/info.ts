import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../types/command'

export const info: Command = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription(
      'Info command'
    ),

  async execute (interaction) {
    try {
      if (!interaction.isCommand() || interaction.commandName !== 'info') { return }
      await interaction.reply('This is the ICLand bot. It is used to verify your ICP Principal ID with your Discord bot, conceding you a special role in case that you HODL at least one NFT of the collection linked to this Discord server.')
    } catch (err) {
      console.log(err)
    }
  },

  help: {
    name: '',
    text: ''
  }
}
