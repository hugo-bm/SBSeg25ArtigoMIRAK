import CLI from "../../cli/CLI";
import MirakData from "../entities/MirakData";
import Scenarios from "../entities/Scenarios";
import { MirakFile, Software } from "../entities/types/MirakFile";
import SearchService from "./SearchService";
import { evaluatedCVE, evaluatedSoftware } from "./types/Report";
import { CVEsByCPE } from "./types/Vulnerability";
import * as fs from "node:fs/promises";
import ValidationCPEService from "./ValidationCPEService";
import { HttpError } from "../../api/errs";

export default class EvaluationService {
  static #instance: EvaluationService;

  private constructor() {}

  public static get instance(): EvaluationService {
    if (!this.#instance) {
      this.#instance = new EvaluationService();
    }
    return this.#instance;
  }

  public async evaluateServices(
    path: string,
    cli: CLI
  ): Promise<evaluatedSoftware[]> {
    let searchResult: CVEsByCPE[] = [];
    const evaluationResult: evaluatedSoftware[] = [];

    // Reading file step
    cli.writeTitle("Starting reading Mirak input file");
    const inputFile = MirakData.instance;
    inputFile.mirakFile = await this.MirakFile(path, cli);
    cli.writeSuccess("Read of Mirak file is complete");

    cli.writeTitle(
      "Starting search for each cpe valid in CPE Dictionary Database API (NVD)"
    );

    // CPE identifier correction step
    const CPEValidator: ValidationCPEService = ValidationCPEService.instance;

    try {
      await CPEValidator.FixCPEWithDictionary(inputFile, cli);
    } catch (error) {
      if (error instanceof HttpError) {
        if ([403, 503, 500].includes(error.statusCode)) {
          cli.writeError(String(error));
          cli.writeWarning(
            `The following error occurred while communicating with the NVD database: ${error.name}. \n A new attempt will be made in 1 minute. Sorry for the inconvenience.`
          );
          setTimeout(async () => {
            await CPEValidator.FixCPEWithDictionary(inputFile, cli);
          }, 60000);
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }

    // Step of searching for vulnerabilities in the external api

    cli.writeTitle("Starting search for each cpe in CVE Database API (NVD)");

    const cpeForConsultation: string[] = inputFile.allAppsFound.map(
      (software) => software.cpeName
    );

    searchResult = await this.searchForVulnerabiliies(cpeForConsultation, cli);

    // Vulnerability presence assessment step
    cli.writeSuccess("External API CVE research completed");
    if (searchResult.length != 0) {
      cli.writeTitle("Vulnerability assessment is starting!");
      const evaluation = new Scenarios(inputFile.osData.cpeName);
      for (const item of searchResult) {
        const resultEvaluateCVE: evaluatedCVE[] = [];
        const partsCveString: string[] = item.cpeTarget.split(":");
        cli.writeMessage(
          `Vulnerability assessment for item ${partsCveString[3]}-${partsCveString[4]} is starting`
        );
        cli.startProgressBar(item.CVEList.length);
        item.CVEList.forEach((cve, index) => {
          cli.updateProgressBar(index + 1);
          const resultEvaluate = cve.afectedCPE.map((block) => {
            return evaluation.isCpeVulnerable(item.cpeTarget, block);
          });
          // There is at least one "true" value
          if (resultEvaluate.some(Boolean)) {
            const newCveEvaluate: evaluatedCVE = {
              cveId: cve.cveId,
              description: cve.description,
              title: cve.title,
              cvssVersion: cve.cvssVersion,
              cvssString: cve.cvssString,
              baseScore: cve.baseScore,
              baseSeverity: cve.baseSeverity,
            };
            resultEvaluateCVE.push(newCveEvaluate);
          }
        });
        cli.stopProgressBar();
        cli.writeMessage(
          `Vulnerability assessment for item ${partsCveString[3]}-${partsCveString[4]} is ending`
        );

        if (
          MirakData.isValidSoftwareType(partsCveString[2]) &&
          resultEvaluateCVE
        ) {
          const software: Software = {
            cpeName: item.cpeTarget,
            vendor: partsCveString[3],
            product: partsCveString[4],
            version: partsCveString[5],
            type: partsCveString[2],
          };
          evaluationResult.push({ software, CVE: resultEvaluateCVE });
        } else {
          const software: Software = {
            cpeName: item.cpeTarget,
            vendor: partsCveString[3],
            product: partsCveString[4],
            version: partsCveString[5],
            type: "a",
          };
          evaluationResult.push({ software, CVE: resultEvaluateCVE });
        }
      }
      cli.writeSuccess("Vulnerability assessment has end!");
    }
    return evaluationResult;
  }

  private async MirakFile(
    path: string,
    cli: CLI
  ): Promise<MirakFile | undefined> {
    try {
      const jsonData = await fs.readFile(path, "utf-8");
      const data: MirakFile = JSON.parse(jsonData);
      return data;
    } catch (error) {
      cli.writeError(
        `Err on read Mirak file on path : ${path}\n Err description:` + error
      );
    }
  }

  private async searchForVulnerabiliies(
    cpeList: string[],
    cli: CLI
  ): Promise<CVEsByCPE[]> {
    const search: SearchService = SearchService.instance;
    const response = await search.searchVulnerabilities(cpeList, cli);
    return response;
  }
}
