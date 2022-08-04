import { HttpAgent } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { getNFTActor } from '@psychedelic/dab-js'
import { MessageEmbed } from 'discord.js'
import { makeServerActor } from '../actors/makeServerActor'
import { DiscordClient } from '../types/discordClient'
import { Event, EventTypes } from '../types/event'
import type { Guild } from '../types/guild'
import fetch from 'cross-fetch'

const deactivateGuild = async (actor, client, guild) => {
  const discordGuild = client.guilds.cache.get(guild.id)
  const ownerId = discordGuild.ownerId
  const members = await discordGuild.members.fetch()
  const owner = members.get(ownerId)
  await actor.updateGuild({
    ...guild,
    isActive: false
  })
  await owner.send({ embeds: [embed] })
}

const embed = new MessageEmbed()
  .setColor('#E82278')
  .setTitle('Error on ICLand bot!')
  .setDescription('We verified that you do not hold any DogFinity NFTs. Please acquire one, and use the command reactive to turn on the bot on your server again.')

export const checkOwnerNFT: Event = {
  name: 'ready',
  type: EventTypes.ONCE,
  async execute (client: DiscordClient) {
    const actor = makeServerActor()
    const nftActor = getNFTActor({
      canisterId: process.env.DOG_CANISTER_ID,
      agent: new HttpAgent({
        fetch,
        host: 'https://ic0.app'
      }),
      standard: 'EXT'
    })

    setInterval(async () => {
      const activeGuilds = await actor.getAllGuilds(true) as Guild[]

      activeGuilds.forEach(async (g: Guild) => {
        console.log(g)
        try {
          const userNFTs = await nftActor.getUserTokens(Principal.fromText(g.owner))
          const hasNFT = userNFTs.length > 0
          if (!hasNFT) {
            deactivateGuild(actor, client, g)
          }
        } catch (err) {
          if (err.message === 'Other: No tokens') {
            deactivateGuild(actor, client, g)
          }
        }
      })
    }, 24 * 60 * 60 * 1000)
  }
}
