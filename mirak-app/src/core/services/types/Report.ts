import { Software } from "../../entities/types/MirakFile";

/**
 * Represents a vulnerability (CVE) evaluated during the scan,
 * including CVSS details and description.
 */
export type evaluatedCVE = {
   // Unique CVE identifier (e.g., 'CVE-2024-12345')
    cveId: string;
    // Human-readable vulnerability description
    description: string;
    // Optional short title or summary for the vulnerability
    title?: string;
    // CVSS version used for scoring (e.g., '3.1')
    cvssVersion?: string;
    // Raw CVSS vector string (e.g., 'CVSS:3.1/AV:N/AC:L/...')
    cvssString?: string;
    // Base score of the vulnerability (0.0 to 10.0)
    baseScore?: number;
    // Severity level of the vulnerability (e.g., 'LOW', 'HIGH')
    baseSeverity?: string;
  };
/**
 * It represents the essential information of a software found on the system,
 * along with its associated vulnerabilities and relevance assessment for RPKI.
 */
  export type evaluatedSoftware = {
    // Software details including vendor, product, and version
    software: Software;
    // Array of CVEs affecting this software
    cveAnalysis: evaluatedCVE[];
    // Relevance data used to determine the impact of the software
    rpkiAnalyses: evaluatedSoftwareData;
  };
/**
 * Metadata used to assess the relevance of a software's presence,
 * including RPKI-related observations and analyst notes.
 */
  export type evaluatedSoftwareData = {
    // Indicates whether the software is required in the environment
    software_required: string;
    // Whether the related port is active or in use
    related_port: boolean;
    // Whether the port used by this software is essential
    port_required: boolean;
    // Additional analyst notes or observations
    notes: string;
  }

  /**
 * Full description for software types.
 */
  export enum typeOfSoftwareFull {
    // Application software
    a = "Application",
    // Operating system software
    o = "Operating System",
    // Hardware or firmware-level software 
    h = "Hardware"
  }

  /**
 * Represents a simple object that summarizes vulnerabilities,
 * software details, and assessment metadata. Used for reporting at the export stage.
 */
  export type finalReportObject = {
    // Product name (e.g., 'nginx')
    product: string,
    // Product version (e.g., '1.18.0')
    version: string,
    // Software type identifier (e.g., 'a' | 'o' | 'h')
    type: string,
    // Vendor name (e.g., 'Canonical')
    vendor: string,
    // CVE identifier (e.g., 'CVE-2023-45678')
    cve_id: string,
    // Description of the vulnerability
    description: string,
    // Optional CVSS base score (0.0–10.0) or unknown string
    base_score?: number | string,
    // Optional severity rating (e.g., 'HIGH')
    base_severity?: string
    // Whether the software is required in the environment
    software_required: string;
    // Whether there is a network port related to the software
    related_port: string;
    // Whether the related port is required
    port_required: string;
    // Analyst notes
    notes: string;
  }