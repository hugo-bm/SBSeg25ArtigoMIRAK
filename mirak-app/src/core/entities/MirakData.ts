import { CheckTools } from "../../shared/CheckTools";
import { MirakFile, Software, SoftwareType, strategicfile, type as filetype } from "./types/MirakFile";

export default class MirakData {
/**
 * @singleton
 * Provides centralized access and management of Mirak file data.
 *
 * This class implements the Singleton pattern to ensure that only one
 * instance exists and is used throughout the application.
 *
 * Access the instance via the static `instance()` method.
 *
 * @example
 * const jsonData = await fs.readFile(path, "utf-8");
   const file: MirakFile = JSON.parse(jsonData);
 * const data = MirakData.instance();
 * data.mirakFile = file;
 */
  static #instance: MirakData;
  private dataFile: MirakFile | null;
  private constructor() {
    this.dataFile = null;
  }
    /**
   * Gets the singleton instance of the MirakData class.
   *
   * This static getter ensures that only one instance of MirakData
   * is created and reused throughout the application.
   *
   * @returns {MirakData} The single shared instance of the MirakData class.
   */
  public static get instance(): MirakData {
    if (!this.#instance) {
      this.#instance = new MirakData();
    }
    return this.#instance;
  }
 // Inform if the data was loaded successfully
  private isDataFileNull(): boolean {
    return this.dataFile === null ? true : false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public set mirakFile(json: any) {
    if (json.appsFound) {
      this.dataFile = json;
    }
  }
/**
 * Gets the software data related to the operating system.
 *
 * This getter provides access to information such as the OS name,
 * version, or other metadata represented by the {@link Software} type.
 *
 * @returns {Software} An object containing details about the operating system.
 */
  public get osData(): Software {
    if (this.isDataFileNull()) {
      throw new Error("Mirak file was not previously loaded");
    } else {
      return this.dataFile?.appsFound[0] as Software;
    }
  }
/**
 * Searches for a software entry by matching both vendor and product names.
 *
 * This method iterates over the available software records and returns
 * the first match that corresponds to the given vendor and product.
 *
 * @param {string} vendor - The name of the vendor (e.g., "Ubuntu", "RedHat").
 * @param {string} product - The name of the product (e.g., "nginx", "openssl").
 * @returns {Software | null} The first matching {@link Software} entry, or `null` if no match is found.
 */
  public softwareSearchByVendorAndProduct(
    vendor: string,
    product: string
  ): Software | null {
    if (this.isDataFileNull()) {
      throw new Error("Mirak file was not previously loaded");
    } else {
      const softwares = this.dataFile?.appsFound.find(
        (software) => software.vendor == vendor && software.product == product
      );
      return softwares ? softwares : null;
    }
  }
  /**
 * Retrieves the current IP address of the host system.
 *
 * @returns {string} The host machine's IP address in string format (e.g., "192.168.0.105").
 */
  public get hostIp(): string {
    let ip = null;
    if (this.isDataFileNull()) {
      throw new Error("Mirak file was not previously loaded");
    } else {
      ip = this.dataFile?.redeExternal.hostIP;
    }
    return ip ? ip : "";
  }
/**
 * Returns a list of open ports detected on the host system.
 *
 * @returns {number[]} An array of open port numbers (e.g., [22, 80, 443]).
 */
  public get openPorts(): number[] {
    let ports: number[] | undefined = undefined;
    if (this.isDataFileNull()) {
      throw new Error("Mirak file was not previously loaded");
    } else {
      ports = this.dataFile?.redeExternal.openPorts;
    }
    return ports ? ports : [];
  }
/**
 * Returns a map of ports currently in use and their associated software names.
 *
 * This information allows correlation between open ports and the services
 * or software listening on them.
 *
 * @returns {Record<number, string> | undefined}
 * An object where the key is the port number and the value is the name of the software,
 * or `undefined` if the data hasn't been loaded yet.
 *
 * @example
 * {
 *   22: "OpenSSH",
 *   80: "nginx"
 * }
 */
  public get portsUseBySoftware(): Record<number, string> | undefined {
    let portsAndSoftware: Record<number, string> | undefined = undefined;
    if (this.isDataFileNull()) {
      throw new Error("Mirak file was not previously loaded");
    } else {
      portsAndSoftware = this.dataFile?.redeExternal.portsUseBy;
    }
    return portsAndSoftware;
  }

/**
 * Searches for the ports associated with a given software name.
 *
 * This method returns all known ports that are in use by the specified software.
 * If the software is not found, an empty array is returned.
 *
 * @param softwareName - The name of the software (e.g., "nginx", "OpenSSH").
 * @returns An array of port numbers associated with the specified software.
 *
 * @example
 * searchesPortsForRelatedSoftware("nginx");
 * // Returns: [80, 443]
 */
  public searchesPortsForRelatedSoftware(softwareName: string): number[] {
    if (this.isDataFileNull()) {
      throw new Error("Mirak file was not previously loaded");
    } else {
      const softwares = this.dataFile?.redeExternal.portsUseBy;
      if (softwares) {
        return Object.entries(softwares)
        .filter(([_, value]) => value === softwareName)
        .map(([key, _]) => Number.parseInt(key));
      }
      return [];
    }
  }
/**
 * Gets the full list of all software entries identified during processing.
 *
 * This getter returns every {@link Software} object that has been detected, including
 * operating system, packages, services, or applications discovered during analysis.
 *
 * @returns An array of all discovered software entries.
 *
 * @example
 * const apps = mirakData.allAppsFound;
 * // Returns: [Software { name: 'nginx', version: '1.18.0', ... }, ...]
 */
  public get allAppsFound(): Software[] {
    if (this.isDataFileNull()) {
      throw new Error("Mirak file was not previously loaded");
    } else {
      const softwares = this.dataFile?.appsFound;
      if (!softwares) {
        throw new Error(
          'The "appsFound" attribute is undefined, the software in MirakFile may be corrupted'
        );
      }
      if (softwares.length > 0) {
        for(let index = 0; index < softwares.length; index ++)
        {
          if(!MirakData.isValidSoftware(softwares[index])) {
            throw new Error(
              `The "appsFound" has software with invalid property, the software at position ${index +1} in MirakFile may be corrupted`
            );
          }
        }
      }
      return softwares;
    }
  }
/**
 * Type guard that checks whether a given string is a valid `SoftwareType`.
 *
 * This static method helps validate and narrow down the type of the provided value,
 * confirming if it corresponds to a recognized {@link SoftwareType} enum or union.
 *
 * @param value — The string to validate (e.g., "os", "application", "service").
 * @returns `true` if the value is a valid `SoftwareType`, otherwise `false`.
 *
 * @example
 * if (MirakData.isValidSoftwareType(input)) {
 *   // input is now inferred as SoftwareType
 * }
 */
  public static isValidSoftwareType(value: string): value is SoftwareType {
    return value === "o" || value === "a" || value === "h";
  }
/**
 * Type guard that checks whether a given string is a valid `Software`.
 *
 * This static method helps validate and narrow down the type of the provided value,
 * confirming if it corresponds to a recognized {@link Software} enum or union.
 *
 * @param value — The object Software to validate (e.g., { name: 'nginx', version: '1.18.0', ... }).
 * @returns `true` if the value is a valid `Software`, otherwise `false`.
 *
 * @example
 * if (MirakData.isValidSoftware(input)) {
 *   // input is now inferred as SoftwareType
 * }
 */
  private static isValidSoftware(value: Software): value is Software {
    return (
      CheckTools.checkObjProperty(value, "cpeName") &&
      CheckTools.checkObjProperty(value, "vendor") &&
      CheckTools.checkObjProperty(value, "product") &&
      CheckTools.checkObjProperty(value,"version") &&
      CheckTools.checkObjProperty(value,"type") &&
      MirakData.isValidSoftwareType(value.type)
    );
  }
/**
* Type guard that checks whether a given string is a valid `filetype`.
*
* This static method helps validate and narrow down the type of the provided value,
* confirming if it corresponds to a recognized {@link filetype} enum or union.
*
* @param value — The string to validate (e.g., "file", "directory").
* @returns `true` if the value is a valid `SoftwareType`, otherwise `false`.
*
* @example
* if (MirakData.isValidStrategicFileType(input)) {
*   // input is now inferred as SoftwareType
* }
*/
  public static isValidStrategicFileType(value: string): value is filetype {
    return value === "file" || value === "directory";
  }
/**
 * Retrieves the list of strategic files found during the scan.
 *
 * These files are identified based on predefined criteria and are considered
 * important for analysis and reporting purposes.
 *
 * @returns An array of {@link strategicfile} objects if any were found; otherwise, `null`.
 *
 * @example
 * const files = mirakData.getStrategicFiles();
 * if (files) {
 *   files.forEach(file => console.log(file.fileName));
 * }
 */
  public getStrategicFiles(): strategicfile[] | null{
    if (this.isDataFileNull()){
      throw new Error("Mirak file was not previously loaded");
    }
    else {
      const files = this.dataFile?.strategicFiles;
      return files ?? null
    }
  }
/**
 * Clears all stored internal data from the current instance.
 *
 * This method resets internal states such as detected software, ports,
 * strategic files, and other cached or scanned data. It is useful when 
 * reusing the instance for a new scan without residual data from previous executions.
 *
 * @example
 * mirakData.clearData(); // Resets internal state before a new scan
 */
  public clearData() {
    this.dataFile = null;
  }
}
