export interface User {
  id: string;
  isActive: boolean;
  discordId: string;
  discriminator?: string;
  username?: string;
}
