import CLI from "../../cli/CLI";
import MirakData from "../entities/MirakData";
import Scenarios from "../entities/Scenarios";
import {
  MirakFile,
  Permission,
  Software,
  strategicfile,
} from "../entities/types/MirakFile";
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
import { octalForText } from "../../shared/GenericTools";
import {
  resultStrategicFile,
  rpkiFilesForAnalysis,
  status,
} from "./types/StrategicFiles";
import path from "node:path";

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

    cli.writeTitle("Starting the evaluation of strategic files for RPKI");
    const rpkiStrategicFiles: strategicfile[] | null =
      inputFile.getStrategicFiles();
    const rpkiResultStrategicFiles: resultStrategicFile[] = rpkiStrategicFiles
      ? this.strategicFilesAnalysis(rpkiStrategicFiles)
      : [];
    cli.writeMessage("Evaluation of strategic files has processed");

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
          // Add notes of strategic files
          const routinatorNotes =
            rpkiResultStrategicFiles
              .find((item) => item.name === "routinator.conf")
              ?.status.map((item) => item.note)
              .join("\n") ?? "";
          rpkiAnalyses.notes = rpkiAnalyses.notes + routinatorNotes;
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
              } else {
                rpkiAnalyses.software_required = "no";
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
          rpkiAnalyses: rpkiAnalyses,
        });
      }

      cli.writeSuccess("Vulnerability assessment has end!");
      // Print simplified report (summary)
      cli.writeTitle(
        "📑 The results of the evaluation of the runtime environment"
      );
      const softwareVulnerabilityQtd = evaluationResult
        .map((software) => software.cveAnalysis.length)
        .reduce((pv, cv) => pv + cv);
      if (softwareVulnerabilityQtd > 0) {
        const rpkiVulnerabilitysQtd = evaluationResult.filter(
          (value) => value.software.product == "routinator"
        )[0].cveAnalysis.length;

        cli.writeWarning(
          `The host environment with IP ${inputFile.hostIp} contains vulnerabilities that may affect correct operation.\n A total of ${softwareVulnerabilityQtd} vulnerabilities were discovered`
        );
        cli.writeMessage(
          "Number of RPKI-related vulnerabilities found: " +
            rpkiVulnerabilitysQtd
        );
        cli.writeMessage(
          "Number of other vulnerabilities found: " +
            String(softwareVulnerabilityQtd - rpkiVulnerabilitysQtd)
        );
      } else {
        cli.writeSuccess(
          `No vulnerabilities were found at the end of the analysis on the host with IP ${inputFile.hostIp}`
        );
      }
      const routinator = dataForRpkiAnalysis;
      const defaultPorts = Object.keys(routinator.ports.incoming).map(Number);
      const portNotRelatedWithRpki = inputFile.openPorts.filter(
        (port) => !defaultPorts.includes(port)
      );
      cli.writeMessage(
        "Number of ports not used by the RPKI solution discovered: " +
          portNotRelatedWithRpki.length
      );
      const slurmFile = rpkiResultStrategicFiles.find(
        (item) => item.name === "slurm.json"
      );
      const routinatorConfigFile = rpkiResultStrategicFiles.find(
        (item) => item.name === "routinator.conf"
      );
      const routinatorDirectory = rpkiResultStrategicFiles.find(
        (item) => item.name === "routinator" && item.type == "directory"
      );
      // Directory of configurations
      if (routinatorDirectory !== undefined) {
        this.writeNotesOnConsole(routinatorDirectory.status, cli);
      }

      // Configurations of RPKI
      if (routinatorConfigFile !== undefined) {
        this.writeNotesOnConsole(routinatorConfigFile.status, cli);
      }

      // Exceptions of RPKI

      if (slurmFile !== undefined) {
        cli.writeWarning(
          `The exceptions file "${slurmFile.name}" is present in the Routinator settings. Be careful when using this feature!`
        );
        this.writeNotesOnConsole(slurmFile.status, cli);
      }
      console.log("\n"); // add whtite space for new information
    }
    return evaluationResult;
  }

  private writeNotesOnConsole(data: status[], cli: CLI): void {
    const success: string[] = [];
    const fail: string[] = [];
    for (const item of data) {
      if (item.status) {
        success.push(item.note);
      } else {
        fail.push(item.note);
      }
    }
    if (success.length > 0){
      cli.writeSuccess(success.join("\n"));
    }
    if (fail.length > 0){
      cli.writeError(fail.join("\n"));
    }
  }

  private strategicFilesAnalysis(data: strategicfile[]): resultStrategicFile[] {
    const index = new Map<string, number>();
    const routinatorStrategicFileOrDirectories: rpkiFilesForAnalysis[] =
      dataForRpkiAnalysis.essentialFilesOrDirectories.map((item) => {
        return {
          name: item.name,
          type: item.type as "file" | "directory",
          user: item.user,
          group: item.group,
          permissions: item.permissions,
        };
      });

    const result: resultStrategicFile[] = [];

    for (let i = 0; i < routinatorStrategicFileOrDirectories.length; i++) {
      index.set(
        `${routinatorStrategicFileOrDirectories[i].name}|${routinatorStrategicFileOrDirectories[i].type}`,
        i
      );
    }

    for (const item of data) {
      if (!MirakData.isValidStrategicFileType(item.type)) {
        throw new Error(
          'Invalid value of property "type" detected in strategic file object'
        );
      }

      const extractedName = path.basename(item.fileName);
      const foundIndex = index.get(`${extractedName}|${item.type}`);

      if (foundIndex != undefined) {
        const ExpectedData = routinatorStrategicFileOrDirectories[foundIndex];

        const ownerNotes = this.compareOwnerAndGroup(
          ExpectedData,
          item,
          extractedName
        );

        const permissionNotes = this.comperePermissions(
          ExpectedData,
          item,
          extractedName
        );

        const status: status[] = [
          {
            statusFor: "permission",
            status: permissionNotes.status,
            note: permissionNotes.notes,
          },
          {
            statusFor: "owner",
            status: ownerNotes.status,
            note: ownerNotes.notes,
          },
        ];

        if (extractedName === "routinator.conf") {
          const configNotes = this.analysisRoutinatorConfig(item);
          status.push({
            statusFor: "config",
            status: configNotes.status,
            note: configNotes.notes,
          });
        }

        result.push({
          name: extractedName,
          path: item.fileName,
          type: item.type,
          permission: this.mountFullPermission(item.permission),
          status: status,
        });
      }
    }
    return result;
  }

  private analysisRoutinatorConfig(data: strategicfile): {
    status: boolean;
    notes: string;
  } {
    const errorsFoundInFile = data.errors ?? [];
    const header =
      errorsFoundInFile.length == 0
        ? "The basic evaluation of the configurations present in the routinator.conf file did not identify any discrepancies, with all analyzed definitions found to be in compliance with the established standards."
        : "During the basic evaluation of the configurations contained in the routinator.conf file, discrepancies were identified in relation to the expected standards, as detailed below:";

    return {
      status: errorsFoundInFile.length > 0 ? false : true,
      notes: `${header}\n${errorsFoundInFile.map((item) => `- ${item}`).join("\n")}`,
    };
  }

  private compareOwnerAndGroup(
    expected: rpkiFilesForAnalysis,
    observed: strategicfile,
    name: string
  ): { status: boolean; notes: string } {
    const notes: string[] = [];
    let divergences: number = 0;

    if (expected.user !== observed.owner.user) {
      notes.push(
        `- User: expected is "${expected.user}", however, the user "${observed.owner.user}" was found.`
      );
      divergences++;
    } else {
      notes.push(
        `- User: the expected user "${observed.owner.user}" was correctly found.`
      );
    }

    if (expected.group !== observed.owner.group) {
      notes.push(
        `- Group: expected is "${expected.group}", however, the group "${observed.owner.group}" was found.`
      );
      divergences++;
    } else {
      notes.push(
        `- Group: the expected group "${observed.owner.group}" was correctly found.`
      );
    }

    const header =
      divergences > 0
        ? `When evaluating the ${observed.type} "${name}", inconsistencies were found in ownership settings:`
        : `When evaluating the ${observed.type} "${name}", ownership settings are consistent with the recommendations:`;

    return {
      status: divergences > 0 ? false : true,
      notes: `${header}\n${notes.join("\n")}`,
    };
  }

  private comperePermissions(
    expected: rpkiFilesForAnalysis,
    observed: strategicfile,
    name: string
  ): { status: boolean; notes: string } {
    const properties: Array<keyof Permission> = ["owner", "group", "others"];
    const notes: string[] = [];
    let divergences: number = 0;
    for (const property of properties) {
      if (expected.permissions[property] !== observed.permission[property]) {
        notes.push(
          `- ${property}: expected "${octalForText(expected.permissions[property])}", but found "${octalForText(observed.permission[property])}".`
        );
        divergences++;
      }
    }
    const header =
      divergences === 0
        ? `Upon evaluation of the permissions of the ${observed.type} "${name}", it was found that the permission settings fully comply with the recommended standards.`
        : `During the evaluation of the permissions of the ${observed.type} "${name}", discrepancies were identified in the permission settings compared to the recommended standards, as detailed below:`;

    //return comparisonReport.length > 0 ? comparisonReport : [];
    return {
      status: divergences > 0 ? false : true,
      notes: `${header}\n${notes.join("\n")}`,
    };
  }

  private mountFullPermission(permission: Permission): string {
    return (
      octalForText(permission.owner) +
      octalForText(permission.group) +
      octalForText(permission.owner)
    );
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
