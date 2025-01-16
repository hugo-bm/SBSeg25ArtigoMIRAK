import { CheckTools } from "../../shared/CheckTools";
import { MirakFile, Software, SoftwareType } from "./types/MirakFile";

export default class MirakData {
  static #instance: MirakData;
  private dataFile: MirakFile | null;
  private constructor() {
    this.dataFile = null;
  }

  public static get instance(): MirakData {
    if (!this.#instance) {
      this.#instance = new MirakData();
    }
    return this.#instance;
  }

  private isDataFileNull(): boolean {
    return this.dataFile === null ? true : false;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public set mirakFile(json: any) {
    if (json.appsFound) {
      this.dataFile = json;
    }
  }

  public get osData(): Software {
    if (this.isDataFileNull()) {
      throw new Error("Mirak file was not previously loaded");
    } else {
      return this.dataFile?.appsFound[0] as Software;
    }
  }
  /**
   * Searches for the first occurrence of a software, informing the vendor and product
   *
   * @param {string} vendor
   * @param {string} product
   * @returns  Returns the first occurrence of the software corresponding to the query or returns null if there is no occurrence.
   * @type {Software}
   * @type {null}
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
  public get hostIp() {
    let ip = null;
    if (this.isDataFileNull()) {
      throw new Error("Mirak file was not previously loaded");
    } else {
      ip = this.dataFile?.redeExternal.hostIP;
    }
    return ip ? ip : "";
  }

  public get openPorts(): number[] {
    let ports: number[] | undefined = undefined;
    if (this.isDataFileNull()) {
      throw new Error("Mirak file was not previously loaded");
    } else {
      ports = this.dataFile?.redeExternal.openPorts;
    }
    return ports ? ports : [];
  }

  public get portsUseBySoftware() {
    let portsAndSoftware: Record<number, string> | undefined = undefined;
    if (this.isDataFileNull()) {
      throw new Error("Mirak file was not previously loaded");
    } else {
      portsAndSoftware = this.dataFile?.redeExternal.portsUseBy;
    }
    return portsAndSoftware;
  }

  /**
   * Searches for the first occurrence of a software name, informing the port
   *
   * @param {number} port
   * @returns  Returns the first occurrence of the software name corresponding to the query or returns empty string if there is no occurrence.
   * @type {Software}
   */
  public softwareNameSearchByPort(port: number): string {
    if (this.isDataFileNull()) {
      throw new Error("Mirak file was not previously loaded");
    } else {
      const softwares = this.dataFile?.redeExternal.portsUseBy;
      if (softwares) {
        return softwares[port] ? softwares[port] : "";
      }
      return "";
    }
  }

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

  public static isValidSoftwareType(value: string): value is SoftwareType {
    return value === "o" || value === "a" || value === "h";
  }

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

  public clearData() {
    this.dataFile = null;
  }
}
