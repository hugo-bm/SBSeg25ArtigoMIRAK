import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });
/**
 * Provides controlled access to environment variables used by the application.
 *
 * This class uses the Singleton pattern to ensure that environment variables
 * are loaded and accessed consistently across the entire application.
 *
 * Currently, it exposes the NVD API key (`API_NVD_KEY`) via a read-only property.
 * The `.env` file must be located one level above the current directory.
 * @example
 * ``` ts
 * const configs = envVars.instance;
 * console.log(configs.apiKey)
 * ```
 */
export default class envVars {
  private readonly _apiKey: string | undefined;
  private static _instance: envVars;
  /**
   * Initializes the environment variables from the `.env` file.
   *
   * This constructor is private to enforce the Singleton pattern.
   * It retrieves the `API_NVD_KEY` value from `process.env`.
   */
  private constructor() {
    this._apiKey = process.env.API_NVD_KEY;
  }
  /**
   * Returns the singleton instance of the envVars class.
   *
   * Ensures that environment variables are loaded only once.
   * @example
   * ``` ts
   * const configs = envVars.instance;
   * console.log(configs.apiKey)
   * ```
   */
  public static get instance(): envVars {
    if (!this._instance) {
      this._instance = new envVars();
    }
    return this._instance;
  }
  /**
   * Retrieves the value of the NVD API key.
   *
   * @returns The API key defined in the environment variable `API_NVD_KEY`,
   * or `undefined` if the variable is not set.
   */
  public get apiKey() {
    return this._apiKey;
  }
}
