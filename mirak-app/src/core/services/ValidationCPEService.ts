import nvdApiClient from "../../api/nvdApiClient";
import CLI from "../../cli/CLI";
import JsonCache from "../../database/jsonCacheDb";
import MirakData from "../entities/MirakData";

/**
 * @singleton
 * Provides CPE correction and validation services using NVD dictionary and cache.
 *
 * This service scans a `MirakData` instance for CPE identifiers that are incomplete or imprecise.
 * It focuses on those marked with the custom tag `-tag_rec-app`, attempts to correct them using
 * a local cache, and when unavailable, queries the NVD dictionary API. The updated identifiers are
 * saved back into the `appsFound` property of the original instance.
 *
 * @remarks
 * This class implements the Singleton design pattern, ensuring that a single instance
 * is used throughout the application.
 */
export default class ValidationCPEService {
  static #instance: ValidationCPEService;

  private constructor() {}


  /**
   * Retrieves the singleton instance of the `ValidationCPEService`.
   *
   * Ensures centralized management of CPE validation and correction logic, especially
   * when working with shared cache and network resources.
   *
   * @returns The singleton instance of `ValidationCPEService`.
   *
   * @example
   * const validator = ValidationCPEService.instance;
   */
  public static get instance(): ValidationCPEService {
    if (!this.#instance) {
      this.#instance = new ValidationCPEService();
    }
    return this.#instance;
  }

  /**
   * Checks whether the vendor extracted from a given CPE string matches a given vendor string.
   *
   * This helper function extracts the vendor portion of the CPE string using a regular expression
   * and compares it to the provided `vendorToCheck`, aiding in dictionary matching or validation processes.
   *
   * @param cpe - The full CPE 2.3 string from which to extract the vendor.
   * @param vendorToCheck - The vendor name to compare against.
   * @returns `true` if the extracted vendor matches `vendorToCheck`, otherwise `false`.
   *
   * @example
   * isVendorCompatible("cpe:2.3:a:adobe:reader:*:*:*:*:*:*:*:*", "adobe"); // true
   */
  private isVendorCompatible(cpe: string, vendorToCheck: string): boolean {
    // Extract vendor using regular expression
    const match = cpe.match(/cpe:2\.3:a:([^:]+):/);

    if (match && match[1]) {
      const vendor = match[1];
      // Verifica se o vendor é compatível
      return vendor.includes(vendorToCheck);
    }

    // Retorna falso se o vendor não for encontrado
    return false;
  }

   /**
   * Dynamically corrects CPE identifiers in the `appsFound` property of the provided `MirakData` instance.
   *
   * This method scans each application found for the tag `-tag_rec-app`, signaling that the identifier
   * may be incomplete or imprecise. It first checks a local cache for a corrected CPE.
   * If none is found, it queries the NVD CPE dictionary API and updates the instance accordingly.
   * Operating system entries are ignored since they can be corrected using static strategies.
   *
   * @param inputFile - The `MirakData` object containing the list of discovered applications to validate.
   * @param cli - A `CLI` instance used to print progress and messages during the correction process.
   *
   * @returns A `Promise` that resolves when all corrections are complete.
   *
   * @example
   * await validator.FixCPEWithDictionary(mirakInstance, cli);
   */
  public async FixCPEWithDictionary(inputFile: MirakData, cli: CLI) {
    const apiClient = nvdApiClient.instance;
    const softwares = inputFile.allAppsFound;
    const totalOfCPEs: number = softwares.length | 1;
    const cache: JsonCache = JsonCache.instance;
    let index = 1;
    cli.startProgressBar(totalOfCPEs);
    try {
      await cache.load();
      for (const software of softwares) {
        index += 1;
        cli.updateProgressBar(index);
        if (
          new RegExp(
            "^cpe:2\\.3:[aho]:[^:]+:[^:]+:[^:]+:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*$"
          ).test(software.cpeName)
        ) {
          if (this.isVendorCompatible(software.cpeName, "-tag_rec-app")) {
            const cpeParts = software.cpeName.split(":");
            const cacheResult = cache.searchByProductAndOS(
              cpeParts[4],
              inputFile.osData.product
            );
            if (cacheResult == undefined) {
              const dict = await apiClient.fetchDataForCPE(
                `cpe:2.3:a:*:${cpeParts[4]}:*`,
                cli
              );

              if (dict) {
                const sanitizeCPEName =
                  cpeParts[9] == "(none)"
                    ? software.cpeName.replace("(none)", "noarch")
                    : software.cpeName;
                software.cpeName = dict?.getCorrectCpeName(
                  inputFile.osData.product,
                  sanitizeCPEName
                );
                cache.addCPE(
                  software.cpeName,
                  cpeParts[4],
                  inputFile.osData.product
                );
              }
            } else {
              software.cpeName = cacheResult;
            }

            software.vendor = software.cpeName.split(":")[3];
          }
        } else {
          throw new Error("invalid CPE located!");
        }
      }
    }  finally {
      cli.stopProgressBar();
      await cache.save();
      cache.unload();
    }
  }
}
