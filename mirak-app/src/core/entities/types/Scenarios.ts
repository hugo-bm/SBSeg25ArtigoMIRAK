/**
 * Represents a single CPE match condition within a configuration node.
 */
export type cpeMatch = {
  // Indicates whether the matched CPE is considered vulnerable
  vulnerable: boolean;

  // Matching criteria string (usually a CPE URI or logical expression)
  criteria: string;

  // Optional maximum version (inclusive) for which the match applies
  versionEndIncluding?: string;

  // Optional minimum version (inclusive) for which the match applies
  versionStartIncluding?: string;

  // Optional minimum version (exclusive) for which the match applies
  versionStartExcluding?: string;

  // Optional maximum version (exclusive) for which the match applies
  versionEndExcluding?: string;
};

/**
 * A node in the logical configuration tree of a vulnerability,
 * which can include nested children or individual CPE matches.
 */
export type Node = {
  // Logical operator that applies to this node: AND or OR
  operator: "AND" | "OR";

  // Whether the logic of this node is negated
  negate: boolean;

  // Array of individual CPE match rules in this node
  cpeMatch: cpeMatch[];

  // Optional child nodes for recursive configuration logic
  children?: Node[];
};

/**
 * A top-level configuration entry, which may contain multiple logic nodes.
 */
export type Configuration = {
  // Optional default operator for combining nodes (AND or OR)
  operator?: "AND" | "OR";

  // Array of logic nodes representing vulnerability conditions
  nodes: Node[];
};
