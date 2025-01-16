import nvdApiClient from "../../api/nvdApiClient";
import CLI from "../../cli/CLI";
import { CVEsByCPE } from "./types/Vulnerability";

export default class SearchService {
  static #instance: SearchService;

  private constructor() {}

  public static get instance(): SearchService {
    if (!this.#instance) {
      this.#instance = new SearchService();
    }
    return this.#instance;
  }

  public async searchVulnerabilities(
    cpes: string[],
    cli: CLI
  ): Promise<CVEsByCPE[]> {
    if (cpes.length > 0) {
      const result: CVEsByCPE[] = [];
      const apiClient = nvdApiClient.instance;
      for (const cpe of cpes) {
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
      return result;
    } else {
      return [];
    }
  }
}
