import { type, Permission } from "../../entities/types/MirakFile";

/**
 * Represents a file analyzed during RPKI evaluation.
 * Used to validate ownership and permissions.
 */
export interface rpkiFilesForAnalysis {
  // File name (e.g., 'slurm.conf')
  name: string;

  // File type: 'file' or 'directory'
  type: type;

  // File permission structure (owner, group, others)
  permissions: Permission;

  // Owner username
  user: string;

  // Owner group name
  group: string;
}

/**
 * Describes the result of analyzing a strategic file,
 * including its permission string and status breakdown.
 */
export interface resultStrategicFile {
  // File name
  name: string;

  // Path to the file
  path: string;

  // File type: 'file' or 'directory'
  type: type;

  // File permission string (e.g., 'R-X')
  permission: string;

  // List of status indicators for various assessment criteria,
  // including descriptive notes on results.
  status: status[];
}

/**
 * Represents the result of a specific evaluation criterion for a file.
 */
export type status = {
  // The aspect being evaluated (e.g., 'owner', 'permission').
  statusFor: string;

  // Whether the evaluation passed or failed.
  status: boolean;

  // Additional notes or explanation
  note: string;
};

/**
 * Encapsulates the message logic for a strategic file evaluation result,
 * including message generation functions.
 */
export type StrategicFileMessageBlock = {
  // Indicates whether the evaluation passed overall
  success: boolean;
  /**
   * Generates a message describing a successful check.
   * @param name - Name of the file
   * @param type - Type of the file (file/directory)
   */
  generatePositiveMsg: (name: string, type: string) => string;
  /**
   * Generates a message describing a failed check.
   * @param name - Name of the file
   * @param type - Type of the file
   * @param describeMsgBlock - Optional array of details about the failure
   */
  generateNegativeMsg: (
    name: string,
    type: string,
    describeMsgBlock?: string[]
  ) => string;

  // Optional details about the failure
  describeMsgBlock?: string[];
};
