import express from 'express'
import cors from 'cors'
import fetch from 'cross-fetch'
import { HttpAgent } from '@dfinity/agent'
import { Principal } from '@dfinity/principal'
import { getNFTActor } from '@psychedelic/dab-js'
import { DiscordClient } from '../types/discordClient'
import { makeServerActor } from '../actors/makeServerActor'
import { Guild } from '../types/guild'
import { asyncFilterGuilds, fetchMembers } from '../utils/asyncFilterGuilds'

export const createServer = (client: DiscordClient) => {
  const api = express()

  api.use(cors())
  api.use(express.json())

  api.post('/user', async (req, res) => {
    const { body: user } = req
    const actor = makeServerActor()

    const activeGuilds: [Guild] | any = await actor.getAllGuilds()

    const filteredGuilds = await asyncFilterGuilds(
      activeGuilds,
      async (g) => fetchMembers(g, client),
      user.discordId
    )

    filteredGuilds.forEach(async (g: Guild) => {
      const nftActor = getNFTActor({
        canisterId: g.nftCanisterId,
        agent: new HttpAgent({
          fetch,
          host: 'https://ic0.app'
        }),
        standard: g.nftStandard
      })
      try {
        const userNFTs = await nftActor.getUserTokens(Principal.fromText(user.id))

        if (userNFTs.length) {
          const discGuild = client.guilds.cache.get(g.id)
          const member = await discGuild.members.fetch(user.discordId)
          const role = discGuild.roles.cache.find(r => r.name === 'Holder')

          member.roles.add(role)
        }
      } catch (err) {
        console.log(err)
      }
    })

    res.json({})
  })

  api.post('/checkGuild', async (req, res) => {
    const { body: guild } = req

    const resp = client.guilds.cache.has(guild.id)

    res.json({
      status: resp
    })
  })

  return api
}
