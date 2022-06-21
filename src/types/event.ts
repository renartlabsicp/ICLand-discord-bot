import { CommandInteraction, Guild, Role, TextChannel } from 'discord.js'

export enum EventTypes {
  EMIT = 'emit',
  ON = 'on',
  ONCE = 'once'
}
export interface Event {
  name: string;
  type: EventTypes;
  execute: (interaction: CommandInteraction | Guild | Role | TextChannel) => Promise<void>;
}
