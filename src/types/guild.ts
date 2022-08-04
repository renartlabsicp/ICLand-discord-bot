export interface NFTCanister {
  id: string;
  standard: string;
  roleName: string;
}

export interface Guild {
  id: string;
  collections: NFTCanister[];
  isActive: boolean;
  name: string;
  owner: string;
  website: string;
}
