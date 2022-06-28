import { CommandInteraction, Guild, Role, TextChannel } from 'discord.js'
import { DiscordClient } from './discordClient'

export enum EventTypes {
  EMIT = 'emit',
  ON = 'on',
  ONCE = 'once'
}
export interface Event {
  name: string;
  type: EventTypes;
  execute: (interaction: CommandInteraction | Guild | Role | TextChannel | DiscordClient) => Promise<void>;
}
