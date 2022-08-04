import { HttpAgent } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { getNFTActor } from '@psychedelic/dab-js'
import { Guild, GuildMember } from 'discord.js'
import { NFTCanister } from '../types/guild'
import { User } from '../types/user'
import fetch from 'cross-fetch'

export const manageRole = async (collection: NFTCanister, guild: Guild, member: GuildMember, user: User) => {
  const nftActor = getNFTActor({
    canisterId: collection.id,
    agent: new HttpAgent({
      fetch,
      host: 'https://ic0.app'
    }),
    standard: collection.standard
  })

  const role = guild.roles.cache.find(r => r.name === collection.roleName)
  const hasRole = member.roles.cache.has(role.id)

  try {
    const userNFTs = await nftActor.getUserTokens(Principal.fromText(user.id))
    const hasNFT = userNFTs.length > 0

    if (!hasNFT && hasRole) {
      member.roles.remove(role)
    } else if (hasNFT && !hasRole) {
      member.roles.add(role)
    }
  } catch (err) {
    if (err.message === 'Other: No tokens' && hasRole) {
      member.roles.remove(role)
    }
  }
}
