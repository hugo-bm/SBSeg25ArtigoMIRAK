/**
 * Represents a locally cached CPE (Common Platform Enumeration) entry.
 * Used to avoid repeated external requests by storing recent CPE data.
 */
export type cachedCPE = {
  /** Canonical CPE name (e.g., cpe:2.3:a:vendor:product:version:...) */
  cpeName: string;
  /** Expiration date for this cached entry. After this, it should be refreshed. */
  expirationDate: Date;
  /** Extracted product name associated with the CPE (e.g., 'openssl') */
  product: string;
  /** Operating system the CPE is associated with (e.g., 'linux', 'windows') */
  os: string;
};

/**
 * A list of locally cached CPE entries.
 * Used internally for cache lookups and persistence.
 */
export type cachedCPEList = cachedCPE[];
