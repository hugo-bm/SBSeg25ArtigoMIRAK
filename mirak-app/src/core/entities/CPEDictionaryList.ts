import { cpeDictionary, deprecatedBy, ref, title } from "./types/CPEDictionary";
/**
 * Manages and validates CPE identifiers using data from the NVD CPE dictionary API.
 *
 * The `CpeDictionaryList` class is designed to store, manage, and evaluate a collection
 * of valid CPE identifiers for a specific product. Its main purpose is to detect and correct
 * CPE entries that may have an incorrect vendor/distributor based on heuristic validation.
 *
 * This class is commonly used when processing CPEs retrieved from software scanning tools
 * where vendor information may be missing or inaccurate.
 *
 * ### Validation Heuristics
 * When a possibly incorrect CPE is provided, the class applies three validation strategies:
 *
 * 1. **Version Match Validation**:
 *    If the CPE under evaluation matches the version of any known valid CPEs, the vendor from the valid CPE is adopted.
 *
 * 2. **Operating System Match**:
 *    If the OS identifier appears within the CPE string, it is assumed to be part of the OS's package manager.
 *    In that case, the vendor is replaced by the one related to the operating system.
 *
 * 3. **Most Probable Vendor (Majority Vote)**:
 *    Based on the frequency of vendor names across the stored valid CPEs, the most common one is assumed
 *    to be the most likely correct distributor.
 *
 * These validation methods were derived by analyzing the responses of the NVD CPE dictionary API
 * for real-world scenarios involving software such as Curl, Wget, Tomcat, Rsync, and Bash,
 * across different Linux distributions.
 *
 * ### Usage Example
 * ```ts
 * const cpeList = new CpeDictionaryList();
 * cpeList.load(validCpeArray); // Load known valid CPEs for a product
 *
 * const fixedCpe = cpeList.validateCpe("cpe:2.3:a:unknown:curl:7.68.0:*:*:*:*:*:*:*", "ubuntu");
 * console.log(fixedCpe); // Returns corrected CPE with proper vendor
 * ```
 *
 * @see https://nvd.nist.gov/products/cpe
 * @see https://nvd.nist.gov/developers/products
 */
export class CpeDictionaryList {
  private cpeDictionary: cpeDictionary[] = [];

  /**
   * Adds a new CPE entry to the internal dictionary.
   *
   * This method stores additional information related to a given CPE entry,
   * as retrieved from the NVD CPE Dictionary API. It works similarly to
   * adding a new word to a dictionary — each call registers a new known
   * and valid CPE object for future reference and validation.
   *
   * Typically used in scenarios where CPE data is being collected or
   * built progressively from API responses.
   *
   * @param data — Raw CPE data object retrieved from the CPE Dictionary API.
   *
   * @example
   * ```ts
   * const entry = {
   *   deprecated: false,
   *   cpeName: "cpe:2.3:a:curl:curl:7.68.0:*:*:*:*:*:*:*",
   *   cpeNameId: "9ggsag.556cv.RT4563.tyU6",
   *   lastModified: 06/03/2023,
   *   created: 07/09/2019,
   *   titles: [],
   *   refs: [],
   *   deprecatedBy: [],
   * };
   *
   * dictionaryList.push(entry);
   * ```
   */
  /* eslint-disable @typescript-eslint/no-explicit-any */
  public push(data: any): void {
    const item: cpeDictionary = {
      deprecated: false,
      cpeName: "",
      cpeNameId: "",
      lastModified: undefined,
      created: undefined,
      titles: [],
      refs: [],
      deprecatedBy: [],
    };
    item.deprecated = data.deprecated;
    item.cpeName = data.cpeName;
    item.cpeNameId = data.cpeNameId;
    item.lastModified = new Date(data.lastModified);
    item.created = new Date(data.created);
    item.titles = data.titles
      ? data.titles.map((title: title) => ({
          title: title.title,
          lang: title.lang,
        }))
      : [];
    item.refs = data.refs
      ? data.refs.map((ref: ref) => ({ ref: ref.ref }))
      : [];
    item.deprecatedBy = data.deprecatedBy
      ? data.deprecatedBy.map((deprecated: deprecatedBy) => ({
          cpeName: deprecated.cpeName,
          cpeNameId: deprecated.cpeNameId,
        }))
      : [];

    this.cpeDictionary.push(item);
  }
/**
   * Attempts to correct the given CPE identifier by applying a sequence of validation rules.
   *
   * This method checks whether the provided CPE string (`cpeOriginal`) might contain
   * an incorrect vendor or format. It uses the internally stored list of valid CPEs to
   * determine and return the most accurate version based on a predefined strategy.
   *
   * The validation process follows this specific order:
   * 
   * 1. **Version-based validation**: It finds a CPE in the list with the same version as the original.
   * 2. **Operating System-based validation**: If the CPE refers to an OS-specific package,
   *    replace the vendor with the OS vendor.
   * 3. **Most mentioned vendor fallback**: If the above fail, return a CPE using the most frequent vendor.
   *
   * This strategy was designed through experimentation to maximize the accuracy
   * of vendor correction across real-world datasets (e.g., Curl, Wget, Bash).
   *
   * @param os — The CPE identifier of the operating system (e.g., `"cpe:2.3:a:canonical:ubuntu:22.0.4:*:*:*:*:*:*:*"`, `"cpe:2.3:a:debian:debian:16.0.0:*:*:*:*:*:*:*"`).
   * @param cpeOriginal — The CPE string that may contain an incorrect vendor (e.g., `"cpe:2.3:a:wrong:curl:7.68.0:*:*:*:*:*:*:*"`).
   *
   * @returns A corrected CPE string with the most probable accurate vendor.
   *
   * @example
   * ```ts
   * const corrected = dictionary.getCorrectCpeName("ubuntu", "cpe:2.3:a:unknown:curl:7.68.0:*:*:*:*:*:*:*");
   * console.log(corrected); 
   * // "cpe:2.3:a:canonical:curl:7.68.0:*:*:*:*:*:*:*"
   * ```
   */
  public getCorrectCpeName(os: string, cpeOriginal: string): string {
    const sanitizeOSName = os.split("_")[0];
    const parts = sanitizeOSName.split(":");

    // Evaluates whether the CPE has a relationship with the original CPE version
    let cpeCorrectWithVersion: cpeDictionary | undefined = undefined;
    for (const cpeItem of this.cpeDictionary) {
      if (cpeItem.deprecated) {
        if (
          this.extractVersion(cpeItem.deprecatedBy[0].cpeName) ==
          this.extractVersion(cpeOriginal)
        ) {
          cpeCorrectWithVersion = cpeItem;
          break;
        }
      } else {
        if (
          this.extractVersion(cpeItem.cpeName) ==
          this.extractVersion(cpeOriginal)
        ) {
          cpeCorrectWithVersion = cpeItem;
          break;
        }
      }
    }

    if (cpeCorrectWithVersion) {
      if (cpeCorrectWithVersion.deprecated) {
        return this.replaceVendor(
          cpeOriginal,
          this.extractVendor(cpeCorrectWithVersion.deprecatedBy[0].cpeName) ??
            sanitizeOSName
        );
      } else {
        return this.replaceVendor(
          cpeOriginal,
          this.extractVendor(cpeCorrectWithVersion.cpeName) ?? sanitizeOSName
        );
      }
    }

    // Evaluates whether the CPE is related to the Operating System

    let cpeCorrectWithOS: cpeDictionary | undefined = undefined;

    for (const cpeItem of this.cpeDictionary) {
      if (cpeItem.deprecated) {
        if (
          cpeItem.deprecatedBy[0].cpeName.includes(parts[3]) ||
          cpeItem.deprecatedBy[0].cpeName.includes(parts[4])
        ) {
          cpeCorrectWithOS = cpeItem;
          break;
        }
      } else {
        // Check if the operating system vendor and product are related to the CPE
        if (
          cpeItem.cpeName.includes(parts[3]) ||
          cpeItem.cpeName.includes(parts[4])
        ) {
          cpeCorrectWithOS = cpeItem;
          break;
        }
      }
    }
    // Using the second path determined by the project to find the correct CPE with higher probability
    if (cpeCorrectWithOS) {
      if (cpeCorrectWithOS.deprecated) {
        return this.replaceVendor(
          cpeOriginal,
          this.extractVendor(cpeCorrectWithOS.deprecatedBy[0].cpeName) ??
            sanitizeOSName
        );
      } else {
        return this.replaceVendor(
          cpeOriginal,
          this.extractVendor(cpeCorrectWithOS.cpeName) ?? sanitizeOSName
        );
      }
    }
    // Get the vendor that repeats the most
    if (cpeCorrectWithOS == undefined) {
      // If it is not a system from the operating system package
      const vendors: string[] = [];
      let cpeCorrect: string | undefined = undefined;

      for (const cpeItem of this.cpeDictionary) {
        if (cpeItem.deprecated) {
          if (cpeItem.deprecatedBy[0].cpeName ? true : false) {
            const cpeParts = cpeItem.deprecatedBy[0].cpeName.split(":");
            vendors.push(cpeParts[3]);
          }
        } else {
          if (cpeItem.cpeName ? true : false) {
            const cpeParts = cpeItem.cpeName.split(":");
            vendors.push(cpeParts[3]);
          }
        }
      }
      // Using the third path determined by the project to find the correct CPE with the highest probability
      cpeCorrect = this.mostOccurringWord(vendors);
      if (cpeCorrect) {
        return this.replaceVendor(cpeOriginal, cpeCorrect);
      }
    }
    return this.replaceVendor(cpeOriginal, sanitizeOSName);
  }

  private replaceVendor(cpe: string, newVendor: string): string {
    return cpe.replace(/(cpe:2\.3:a:)[^:]+/, `$1${newVendor}`);
  }

  private extractVendor(cpe: string): string | null {
    // Usa regex para capturar o campo vendor
    const match = cpe.match(/cpe:2\.3:a:([^:]+):/);

    // Retorna o vendor se encontrado, ou null caso contrário
    return match ? match[1] : null;
  }

  private extractVersion(cpe: string): string {
    const part = cpe.split(":");
    const match = part[5].split(/[-_]/);
    return match ? match[0] : ""; // Returns the found version or an empty string
  }

  private mostOccurringWord(words: string[]): string {
    const counter: Record<string, number> = {};

    // Count the repetition of each word
    for (const word of words) {
      counter[word] = (counter[word] || 0) + 1;
    }

    // Find the word with the most mentions
    let mostOccurring = "";
    let maxRepetitions = 0;

    for (const [word, repetitions] of Object.entries(counter)) {
      if (repetitions > maxRepetitions) {
        mostOccurring = word;
        maxRepetitions = repetitions;
      }
    }

    return mostOccurring;
  }
  /**
   * Gets the total number of CPE entries currently stored in the dictionary.
   *
   * This property allows quick inspection of how many CPE records
   * have been added via the `push()` method.
   *
   * @returns The number of stored CPE records.
   *
   * @example
   * ```ts
   * const size = dictionary.length;
   * console.log(`Total CPEs: ${size}`);
   * ```
   */
  public get length(): number {
    return this.cpeDictionary.length;
  }
}
