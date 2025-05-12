export type MirakFile = {
  appsFound: Software[];
  redeExternal: MainNetwork;
  strategicFiles: strategicfile[]
};

export type Software = {
  type: SoftwareType;
  vendor: string;
  product: string;
  version: string;
  cpeName: string;
};

export type SoftwareType = "a" | "o" | "h";

export type MainNetwork = {
  hostIP: string;
  openPorts: number[];
  portsUseBy: Record<number, string>;
};

export type type = "file" | "directory";

export type Permission = {
  owner: number; // exemplo: 7
  group: number; // exemplo: 5
  others: number; // exemplo: 5
};

export type Owner = {
  user: string,
  group: string
}

export type strategicfile = {
type: type,
fileName: string,
permission: Permission,
owner: Owner,
errors?: string[]
}
