import { CommandInteraction, MessageActionRow, MessageButton, MessageEmbed } from 'discord.js'
import { Event, EventTypes } from '../types/event'

export const verifyProcess: Event = {
  name: 'interactionCreate',
  type: EventTypes.ON,
  async execute (interaction: CommandInteraction) {
    if (!interaction.isButton()) return
    if (interaction.customId === 'icland-verify-button') {
      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Verification Step')
        .setDescription('The button below will redirect you to the [ORGANIZATION NAME] Dapp, where you can verify your account.')

      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setLabel('VERIFY')
            .setStyle('PRIMARY')
            .setURL('https://localhost:3000/verify'))

      interaction.reply({ embeds: [embed], ephemeral: true, components: [row] })
    }
  }
}
