export interface Guild {
  id: string;
  isActive: boolean;
  name: string;
  nftCanisterId: string;
  nftStandard: string;
  owner: string;
  website: string;
  members?: [any]
}
