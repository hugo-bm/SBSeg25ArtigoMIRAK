import CLI from "../../cli/CLI";
import MirakData from "../entities/MirakData";
import Scenarios from "../entities/Scenarios";
import { MirakFile, Software } from "../entities/types/MirakFile";
import SearchService from "./SearchService";
import {
  evaluatedCVE,
  evaluatedSoftware,
  evaluatedSoftwareData,
} from "./types/Report";
import { CVEsByCPE } from "./types/Vulnerability";
import * as fs from "node:fs/promises";
import ValidationCPEService from "./ValidationCPEService";
import { HttpError } from "../../api/errs";
import { dataForRpkiAnalysis } from "../shared/DataForAnalysis";
import ExtractTools from "../../shared/ExtractTools";


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
        // instantiating an rpki-focused assessment report
        const rpkiAnalyses: evaluatedSoftwareData = {
          software_required: "N/A",
          related_port: false,
          port_required: false,
          notes: "N/A",
        };

        const routinator = dataForRpkiAnalysis;

        if (partsCveString[4] == "routinator" && resultEvaluateCVE) {
          const defaultPorts = Object.keys(routinator.ports.incoming).map(
            Number
          );
          rpkiAnalyses.software_required = "yes";
          rpkiAnalyses.port_required = true;
          if (inputFile.portsUseBySoftware) {
            const ports =
              inputFile.searchesPortsForRelatedSoftware("routinator");

            if (ports.length > 0) {
              // Case has ports related with routinator
              rpkiAnalyses.related_port = true;

              const recommendedPorts = ports.filter((value) =>
                defaultPorts.includes(value)
              );

              if (
                ports.length === recommendedPorts.length &&
                [...ports]
                  .sort()
                  .every((num, i) => num === [...recommendedPorts].sort()[i])
              ) {
                rpkiAnalyses.notes = `This software is using ports ${ports.join(" ")}.`;
              } else if (ports.length >= 2 || ports.length <= 3) {
                const notRecommendedPorts = ports.filter(
                  (value) => !defaultPorts.includes(value)
                );
                rpkiAnalyses.notes =
                  `This software uses ports ${ports.join(" ")}.` +
                  ` Nonetheless, it is not recommended to utilize ports that differ from the standard.` +
                  ` The following ports are non-standard ${notRecommendedPorts.join(" ")}.`;
              }
            } else {
              rpkiAnalyses.notes =
                "This software is not using the default ports. It is recommended to use the default ports as needed." +
                ` The recommended ports for Routinator are: ${
                  Object.entries(routinator.ports.incoming)
                    .map(([key, value]) => `${key} ${value}`)
                    .join("; ") + "."
                }`;
            }
          }
        } else if (resultEvaluateCVE) {
          // software analysis stage required for rpki
          
          const dependenciesData = routinator.dependencies.filter(
            (value) => value.os == inputFile.osData.product
          );
          // getting the routinator version to filter the data
          const softwareFound = inputFile.softwareSearchByVendorAndProduct(
            "nlnetlabs",
            "routinator"
          );

          if (softwareFound) {
            let dependencies: Array<string> = [];
            if (
              ExtractTools.extractVersionProduct(softwareFound.cpeName)[1] == 9
            ) {
              dependencies = dependenciesData[0].softwares[0].map(String);
            } else {
              dependencies = dependenciesData[0].softwares[1].map(String);
            }
            const index = dependencies.findIndex(
              (value) => value == partsCveString[4]
            );
            if (index != -1 && dependencies[index + 1] != undefined) {
              const partsCpeDependence = dependencies[index + 1].split(":");
              const cpeDependenceVersion = ExtractTools.extractVersionProduct(
                dependencies[index + 1]
              );
              const cpeVersion = ExtractTools.extractVersionProduct(
                item.cpeTarget
              );
              if (
                partsCveString[4] == partsCpeDependence[4] &&
                cpeVersion.reduce((pv, cv) => pv + cv) >=
                  cpeDependenceVersion.reduce((pv, cv) => pv + cv)
              ) {
                rpkiAnalyses.software_required = "yes";
              }
              else {
                rpkiAnalyses.software_required = "no"
              }
            }
          }

          // port analysis step
          if (inputFile.portsUseBySoftware) {
            const ports = inputFile.searchesPortsForRelatedSoftware(
              partsCveString[4]
            );

            if (ports.length > 0) {
              // Case has ports related with routinator
              rpkiAnalyses.related_port = true;
              rpkiAnalyses.notes = `This software is currently using port${ports.length > 1 ? "s" : ""} ${ports.join(", ")}. This is not recommended.`;
            }
          }
        }

        const software: Software = {
          cpeName: item.cpeTarget,
          vendor: partsCveString[3],
          product: partsCveString[4],
          version: partsCveString[5],
          type: MirakData.isValidSoftwareType(partsCveString[2])
            ? partsCveString[2]
            : "a",
        };
        evaluationResult.push({
          software,
          cveAnalysis: resultEvaluateCVE,
          rpkiAnalyses: rpkiAnalyses
        });
      }
      cli.writeSuccess("Vulnerability assessment has end!");
      // Print simplified report (summary)
      cli.writeTitle("📑 The results of the evaluation of the runtime environment");
      const softwareVulnerabilityQtd = evaluationResult.map((software)=>software.cveAnalysis.length).reduce((pv, cv)=> pv + cv);
      if(softwareVulnerabilityQtd > 0) {
        const rpkiVulnerabilitysQtd = evaluationResult.filter((value) => value.software.product == "routinator")[0].cveAnalysis.length;
        
        cli.writeWarning(`The host environment with IP ${inputFile.hostIp} contains vulnerabilities that may affect correct operation.\n A total of ${softwareVulnerabilityQtd} vulnerabilities were discovered`);
        cli.writeMessage("Number of RPKI-related vulnerabilities found: "+ rpkiVulnerabilitysQtd);
        cli.writeMessage("Number of other vulnerabilities found: " + String(softwareVulnerabilityQtd - rpkiVulnerabilitysQtd));
      }
      else {
        cli.writeSuccess(`No vulnerabilities were found at the end of the analysis on the host with IP ${inputFile.hostIp}`);
      }
      const routinator = dataForRpkiAnalysis;
      const defaultPorts = Object.keys(routinator.ports.incoming).map(
        Number
      );
      const portNotRelatedWithRpki = inputFile.openPorts.filter((port)=> !defaultPorts.includes(port));
      cli.writeMessage("Number of ports not used by the RPKI solution discovered: " + portNotRelatedWithRpki.length)
      console.log("\n") // add whtite space for new information
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
