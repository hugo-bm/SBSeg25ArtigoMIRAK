import nvdApiClient from "../../api/nvdApiClient";
import CLI from "../../cli/CLI";
import { CVEsByCPE } from "./types/Vulnerability";

/**
 * @singleton
 * Provides a centralized service for searching vulnerabilities (CVEs) by CPE identifiers.
 *
 * This class is responsible for orchestrating vulnerability lookups through external APIs,
 * using the provided CPE identifiers. It ensures that only valid CPE 2.3 formatted strings
 * are processed and handles error logging and feedback via the CLI interface.
 *
 * @remarks
 * This class follows the Singleton design pattern to guarantee a single shared instance
 * during the application's lifecycle.
 */
export default class SearchService {
  static #instance: SearchService;

  private constructor() {}

  /**
   * Retrieves the singleton instance of the `SearchService` class.
   *
   *
   * @returns The singleton instance of `SearchService`.
   *
   * @example
   * const search = SearchService.instance;
   */
  public static get instance(): SearchService {
    if (!this.#instance) {
      this.#instance = new SearchService();
    }
    return this.#instance;
  }

  /**
   * Searches for CVEs (vulnerabilities) for all given CPE identifiers.
   *
   * This method receives a list of CPE strings and validates their format against
   * the CPE 2.3 standard. It then queries the external API for each valid CPE and collects
   * all vulnerabilities found. The CLI instance is used to provide feedback to the user during execution.
   *
   * @param cpes - An array of strings in CPE 2.3 format (e.g., `cpe:2.3:a:vendor:product:version:*:*:*:*:*:*:*`).
   * @param cli - An instance of the `CLI` class to handle output and logging.
   *
   * @returns A `Promise` that resolves to an array of {@link CVEsByCPE} results,
   *          each containing the CPE and its corresponding list of vulnerabilities.
   *
   * @throws Will throw or log errors if any CPEs are invalid or if the external API fails.
   *
   * @example
   * const results = await searchService.searchVulnerabilities(
   *   ["cpe:2.3:a:microsoft:office:2016:*:*:*:*:*:*:*"],
   *   cli
   * );
   */
  public async searchVulnerabilities(
    cpes: string[],
    cli: CLI
  ): Promise<CVEsByCPE[]> {
    if (cpes.length > 0) {
      const result: CVEsByCPE[] = [];
      const apiClient = nvdApiClient.instance;
      let index = 0;
      cli.startProgressBar(cpes.length)
      for (const cpe of cpes) {
        cli.updateProgressBar(++index);
        if (
         
          new RegExp(
            "^cpe:2\\.3:[ao]:[^:]+:[^:]+:[^:]+:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*$"
          ).test(cpe)
        ) {
          const resp = await apiClient.fetchDataForCVE(cpe, cli);

          if (typeof resp === "undefined") {
            cli.writeError("Error: busca resultou vazia");
          } else {
            result.push({ cpeTarget: cpe, CVEList: resp.all });
          }
        }
      }
      cli.stopProgressBar()
      return result;
    } else {
      return [];
    }
  }
}
