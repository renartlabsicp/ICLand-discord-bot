import { Actor, HttpAgent } from '@dfinity/agent'
import fetch from 'cross-fetch'
import { serverIdlFactory } from '../idls/server.did'

export const makeServerActor = () => {
  const agent = new HttpAgent({
    fetch,
    host: 'https://ic0.app'
  })
  const actor = Actor.createActor(serverIdlFactory, {
    agent,
    canisterId: process.env.SERVER_CANISTER_ID
  })

  return actor
}
