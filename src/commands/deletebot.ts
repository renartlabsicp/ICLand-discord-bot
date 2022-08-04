import { SlashCommandBuilder } from '@discordjs/builders'
import { GuildBasedChannel, Role } from 'discord.js'
import { makeServerActor } from '../actors/makeServerActor'
import { Command } from '../types/command'
import { Guild, NFTCanister } from '../types/guild'

export const deletebot: Command = {
  data: new SlashCommandBuilder()
    .setName('deletebot')
    .setDescription(
      'Delete ICLand Bot from the discord server.'
    ),

  async execute (interaction) {
    try {
      if (!interaction.isCommand() || interaction.commandName !== 'deletebot') { return }
      if (interaction.user.id !== interaction.guild.ownerId) {
        interaction.reply('Only the Server owner can use this command! Sorry!')
      } else {
        const actor = makeServerActor()
        const guild = interaction.guild
        const serverGuild = await actor.getGuild(guild.id) as Guild

        serverGuild.collections.forEach(async (collection: NFTCanister) => {
          const role = guild.roles.cache.find((r: Role) => r.name === collection.roleName)
          await role.delete()
        })

        const iclandCat = guild.channels.cache.find((c: GuildBasedChannel) => c.name === 'icland' && c.type === 'GUILD_CATEGORY')
        const iclandChannels = guild.channels.cache.filter((c: GuildBasedChannel) => c.parentId === iclandCat.id)

        iclandChannels.forEach(async c =>
          await c.delete()
        )
        await iclandCat.delete()
        await guild.leave()
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
