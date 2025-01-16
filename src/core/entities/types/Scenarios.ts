export type cpeMatch = {
  vulnerable: boolean;
  criteria: string;
  versionEndIncluding?: string;
  versionStartIncluding?: string;
  versionStartExcluding?: string;
  versionEndExcluding?: string;
};

export type Node = {
    operator: "AND" | "OR";
    negate: boolean;
    cpeMatch: cpeMatch[];
    children?: Node[];
  };

  export type Configuration = {
    operator?: "AND" | "OR";
    nodes: Node[];
  };
