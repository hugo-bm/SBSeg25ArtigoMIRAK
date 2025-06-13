/**
 * Represents a detailed entry in the CPE dictionary.
 * Includes status, metadata, and related titles/references.
 */
export type cpeDictionary = {
  // Indicates if this CPE entry has been deprecated
  deprecated: boolean;

  // Canonical name of the CPE (e.g., cpe:2.3:a:...)
  cpeName: string;

  // Unique identifier derived from the CPE name
  cpeNameId: string;

  // Last modification timestamp (or undefined if unavailable)
  lastModified: Date | undefined;

  //Creation timestamp of the entry (or undefined if unavailable)
  created: Date | undefined;

  // Multilingual titles describing the CPE
  titles: title[];

  // External references relevant to this CPE
  refs: ref[];

  // Optional list of newer CPEs that deprecated this one
  deprecatedBy: deprecatedBy[];
};
/**
 * Represents an external reference associated with a CPE entry.
 */
export type ref = {
  // URL or identifier pointing to a related external source
  ref: string;

  // Optional type of reference (e.g., 'Vendor', 'Product Page')
  type: string | undefined;
};
/**
 * Indicates the CPE that made this current entry obsolete.
 */
export type deprecatedBy = {
  // Canonical name of the CPE that replaced this one
  cpeName: string;

  // Unique ID of the new CPE (useful for indexing or lookup)
  cpeNameId: string;
};
/**
 * Represents a localized title associated with a CPE name.
 */
export type title = {
  // Title or description of the CPE (e.g., 'OpenSSL Project')
  title: string;

  // Language code for the title (e.g., 'en', 'pt')
  lang: string;
};
