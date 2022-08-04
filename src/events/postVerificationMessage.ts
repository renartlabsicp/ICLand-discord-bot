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
          .setLabel('VERIFY')
          .setStyle('LINK')
          .setURL(process.env.FRONTEND_URL)
      )

    const embed = new MessageEmbed()
      .setColor('#E82278')
      .setTitle('ICLand')
      .setDescription('Click on the verify button to be redirected to the ICLand dapp. There you can verify by clicking on the pink "Verify" button, where you will be able to connect your wallet and Discord account. After you receive a message confirming a successful verification you can close the ICLand dapp and come back to this Discord server.')

    await channel.send({ embeds: [embed], components: [row] })
  }
}
