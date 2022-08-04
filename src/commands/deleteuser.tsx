import { SlashCommandBuilder } from '@discordjs/builders'
import { Command } from '../types/command'
import { makeServerActor } from '../actors/makeServerActor'
import type { User } from '../types/user'

export const deleteuser: Command = {
  data: new SlashCommandBuilder()
    .setName('deleteuser')
    .setDescription(
      'Remove your data from the checking process pipeline.'
    ),
  async execute (interaction) {
    try {
      if (!interaction.isCommand() || interaction.commandName !== 'deleteuser') { return }
      const discordUser = interaction.user
      const actor = makeServerActor()
      const serverUser = await actor.getUser(discordUser.id) as User
      await actor.updateUser({
        ...serverUser,
        isActive: false
      })
      interaction.reply({ content: 'Your data was fully removed from the checking process!', ephemeral: true })
    } catch (err) {
      console.log(err)
    }
  },
  help: {
    name: '',
    text: ''
  }
}
