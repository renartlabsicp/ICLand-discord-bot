import express from 'express'
import cors from 'cors'
import { DiscordClient } from './types/discordClient'

export const createServer = (client: DiscordClient) => {
  const api = express()

  api.use(cors())
  api.use(express.json())

  api.post('/user', async (req, res) => {
    const { body: user } = req

    const guild = client.guilds.cache.get('984826414480101426')
    const member = await guild.members.fetch(user.id)
    const role = guild.roles.cache.find(r => r.name === 'Holder')

    member.roles.add(role)
  })

  return api
}
