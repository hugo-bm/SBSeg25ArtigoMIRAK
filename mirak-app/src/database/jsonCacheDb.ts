import IJsonCache from "./IJsonCacheDB";
import * as fs from "node:fs/promises";
import { join, resolve } from "node:path";
import { cachedCPE, cachedCPEList } from "./types/CachedCPE";

/**
 * @singleton
 * Concrete implementation of the IJsonCache interface.
 *
 * This class manages the lifecycle and operations of a JSON-based cache that stores
 * Common Platform Enumeration (CPE) mappings related to product and OS combinations.
 * It supports adding, searching, saving, loading, and unloading cache data.
 *
 * The cache is persisted in a local JSON file located in a predefined directory.
 *
 * This class uses the Singleton design pattern to ensure only one instance of
 * the cache manager exists throughout the application's lifecycle.
 */
export default class JsonCache implements IJsonCache {
  private static _instance: JsonCache;
  private readonly directoryPath: string;
  private readonly filePath: string;
  private data: cachedCPEList;

  /**
   * Private constructor used to initialize file paths and cache structure.
   *
   * This constructor is called internally once when the singleton is created.
   * It sets up the directory and file path where the cache will be stored.
   *
   * @remarks
   * This constructor is private to enforce the Singleton pattern.
   */
  private constructor() {
    this.directoryPath = resolve(__dirname, "../cache/");
    this.filePath = resolve(join(this.directoryPath, "db_cache.json"));
    this.data = [];
  }

 /**
   * Returns the single instance of the JsonCache class.
   *
   * If the instance does not exist yet, it is created on first call.
   * Subsequent calls return the already initialized instance.
   *
   * @returns The shared singleton instance of JsonCache.
   *
   * @example
   * const cache = JsonCache.instance;
   */
  static get instance() {
    if (!this._instance) {
      this._instance = new JsonCache();
    }
    return this._instance;
  }
  searchByProductAndOS(product: string, os: string): string | undefined {
    const arrayData: ArrayIterator<[number, cachedCPE]> = this.data.entries();

    for (const cpe of arrayData) {
      if (cpe[1].os === os && cpe[1].product === product) {
        if (new Date(cpe[1].expirationDate).getTime() < Date.now()) {
          if (cpe[0] !== undefined) {
            this.data.splice(cpe[0]);
          }
          return undefined;
        } else {
          return cpe[1].cpeName;
        }
      }
    }
  }

  addCPE(cpe: string, product: string, os: string): void {
    const expirationDate: Date = new Date(Date.now());
    expirationDate.setHours(expirationDate.getHours() + 3);
    const newItem: cachedCPE = {
      cpeName: cpe,
      product: product,
      os: os,
      expirationDate: expirationDate,
    };
    this.data.push(newItem);
  }

  async save(): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(this.data), {
        mode: 0o600,
      });
    } catch (err: unknown) {
      throw new Error("Error accessing file:" + err);
    }
  }
  async load(): Promise<void> {
    try {
      const jsonData = await fs.readFile(this.filePath, "utf-8");
      const data: cachedCPEList = JSON.parse(jsonData);
      if (data.length > 0) {
        this.data = data;
      }
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((err as any).code === "ENOENT") {
        fs.mkdir(this.directoryPath, { recursive: true })
          .then(() => {
            fs.writeFile(this.filePath, JSON.stringify([]), { mode: 0o600 })
              .then(() => this.load())
              .catch((err) => {
                throw new Error("Error accessing file:" + err);
              });
          })
          .catch((err) => {
            throw new Error("Error accessing directory:" + err);
          });
      }
    }
  }
  unload(): void {
    this.data = [];
  }
}
