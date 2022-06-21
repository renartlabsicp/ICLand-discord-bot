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
      console.log('test')
    } catch (err) {
      console.log(err)
    }
  },

  help: {
    name: '',
    text: ''
  }
}
