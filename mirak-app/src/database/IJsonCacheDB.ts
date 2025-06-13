/**
 * Represents a contract for interacting with a CPE JSON cache system.
 *
 * This interface defines a minimal API for adding, saving, loading,
 * and querying CPE (Common Platform Enumeration) data using JSON as a backing store.
 * It allows searching based on product and operating system, and supports
 * persistence and unloading of the cached data.
 */
export default interface IJsonCache {
  /**
   * Adds a new CPE entry to the cache.
   *
   * This method stores a mapping between a given CPE string and its
   * associated product and operating system identifiers.
   *
   * @param cpe - The full CPE string (e.g., "cpe:2.3:a:vendor:product:*:*:*:*:*:*:*:*").
   * @param product - The product name associated with the CPE.
   * @param os - The operating system name associated with the CPE.
   *
   * @example
   * cache.addCPE("cpe:2.3:a:vendor:myProduct:*:*:*:*:*:*:*:*", "myProduct", "linux");
   */
  addCPE(cpe: string, product: string, os: string): void;
  /**
   * Saves the current state of the cache to persistent storage (e.g., a JSON file).
   *
   * This is an asynchronous operation and should be awaited to ensure data consistency.
   *
   * @returns A Promise that resolves when the data has been successfully saved.
   *
   * @example
   * await cache.save();
   */
  save(): Promise<void>;

  /**
   * Loads the cache data from persistent storage into memory.
   *
   * This method should be called before performing any queries
   * if the cache is not already loaded.
   *
   * @returns A Promise that resolves when the data has been successfully loaded.
   *
   * @example
   * await cache.load();
   */
  load(): Promise<void>;

  /**
   * Searches for a CPE string based on a given product and operating system.
   *
   * This method looks for a match in the internal cache structure.
   *
   * @param product - The product name to search for.
   * @param os - The operating system to search for.
   * @returns The corresponding CPE string, or `undefined` if not found.
   *
   * @example
   * const cpe = cache.searchByProductAndOS("nginx", "linux");
   */
  searchByProductAndOS(product: string, os: string): string | undefined;

  /**
   * Unloads the cache from memory.
   *
   * This method clears internal data structures, helping free memory
   * when the cache is no longer needed.
   *
   * @example
   * cache.unload();
   */
  unload(): void;
}
