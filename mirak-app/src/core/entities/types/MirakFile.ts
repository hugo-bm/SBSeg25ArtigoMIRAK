/**
 * Root structure representing a parsed MIRAK file,
 * containing detected software, network info, and critical files.
 */
export type MirakFile = {
  // List of installed or found software components
  appsFound: Software[];
  // External network configuration (e.g., host IP and open ports)
  redeExternal: MainNetwork;
  // List of strategically relevant files or directories
  strategicFiles: strategicfile[];
};
/**
 * Describes a detected software component, typically matched via CPE.
 */
export type Software = {
  // Software category (application, OS, hardware)
  type: SoftwareType;
  // Name of the software vendor (e.g., 'Microsoft')
  vendor: string;
  // Name of the software product (e.g., 'Office')
  product: string;
  // Software version (e.g., '2019', '5.2.1')
  version: string;
  // Canonical CPE name associated with this software
  cpeName: string;
};
/**
 * Represents the category of the software.
 *
 * - "a" = application (e.g., browsers, editors)
 * - "o" = operating system
 * - "h" = hardware (firmware-level)
 */
export type SoftwareType = "a" | "o" | "h";

/**
 * Represents the external network configuration relevant to the system or evaluation context.
 */
export type MainNetwork = {
  // IP address of the host system being evaluated
  hostIP: string;
  // List of open ports (e.g., [22, 80, 443])
  openPorts: number[];
  // Maps each open port to its associated service (e.g., { 22: 'SSH' })
  portsUseBy: Record<number, string>;
};

/**
 * Represents the type of a filesystem entry.
 */
export type type = "file" | "directory";

/**
 * Represents Unix-style permission bits for a file or directory.
 * Values should be in the range 0–7 (octal), representing rwx permissions.
 */
export type Permission = {
  // Permission bits for the file owner (e.g., 7 for rwx)
  owner: number;
  // Permission bits for the group (e.g., 5 for r-x)
  group: number;
  // Permission bits for others (e.g., 5 for r-x)
  others: number;
};

/**
 * Describes ownership metadata of a file.
 */
export type Owner = {
  // Username of the owner (e.g., 'root', 'appuser')
  user: string;
  // Group name associated with the file (e.g., 'admin', 'devs')
  group: string;
};

/**
 * Represents a file or directory deemed strategically relevant to the evaluation.
 */
export type strategicfile = {
  // Entry type: either a file or a directory
  type: type;
  // Path of the file/directory
  fileName: string;
  // Access permissions in numeric Unix style (owner, group, others)
  permission: Permission;
  // Owner and group metadata for the file
  owner: Owner;
  // Optional list of parsing or validation errors found in the file.
  // This is only used to load the result of Mirak-extractor's evaluation
  //of the RPKI configuration file.
  errors?: string[];
};
