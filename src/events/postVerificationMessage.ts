import { MessageActionRow, MessageButton, MessageEmbed, TextChannel } from 'discord.js'
import { Event, EventTypes } from '../types/event'

export const postVerificationMessage: Event = {
  name: 'channelCreate',
  type: EventTypes.ON,
  async execute (channel: TextChannel) {
    if (channel.name !== 'verification') return

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('icland-verify-button')
          .setLabel('VERIFY')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setLabel('DOCS')
          .setStyle('LINK')
          .setURL('https://localhost:3000')
      )

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('ICLand')
      .setDescription('Click on the verify button to be redirect to the Verification Dapp. There will be able to verify you wallet. Do not share your private keys. We will never ask for your seed phrase. We will never DM you.')

    await channel.send({ embeds: [embed], components: [row] })
  }
}
