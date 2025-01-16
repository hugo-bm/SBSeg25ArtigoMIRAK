import nvdApiClient from "../../api/nvdApiClient";
import CLI from "../../cli/CLI";
import JsonCache from "../../database/jsonCacheDb";
import MirakData from "../entities/MirakData";

export default class ValidationCPEService {
  static #instance: ValidationCPEService;

  private constructor() {}

  public static get instance(): ValidationCPEService {
    if (!this.#instance) {
      this.#instance = new ValidationCPEService();
    }
    return this.#instance;
  }

  private isVendorCompatible(cpe: string, vendorToCheck: string): boolean {
    // Extrai o vendor usando uma expressão regular
    const match = cpe.match(/cpe:2\.3:a:([^:]+):/);

    if (match && match[1]) {
      const vendor = match[1];
      // Verifica se o vendor é compatível
      return vendor.includes(vendorToCheck);
    }

    // Retorna falso se o vendor não for encontrado
    return false;
  }

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
