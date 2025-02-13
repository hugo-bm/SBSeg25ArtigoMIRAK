export type MirakFile = {
  appsFound: Software[];
  redeExternal: MainNetwork;
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
