import { SlashCommandBuilder } from '@discordjs/builders'
import { makeServerActor } from '../actors/makeServerActor'
import { Command } from '../types/command'
import { Guild } from '../types/guild'

export const reactivate: Command = {
  data: new SlashCommandBuilder()
    .setName('reactivate')
    .setDescription(
      'Reactivate ICLand bot.'
    ),

  async execute (interaction) {
    try {
      if (!interaction.isCommand() || interaction.commandName !== 'reactivate') { return }
      if (interaction.user.id !== interaction.guild.ownerId) {
        interaction.reply('Only the Server owner can use this command! Sorry!')
      } else {
        const actor = makeServerActor()
        const guild = interaction.guild
        const serverGuild = await actor.getGuild(guild.id) as Guild

        await actor.updateGuild({
          ...serverGuild,
          isActivate: true
        })
      }
    } catch (err) {
      console.log(err)
    }
  },
  help: {
    name: '',
    text: ''
  }
}
