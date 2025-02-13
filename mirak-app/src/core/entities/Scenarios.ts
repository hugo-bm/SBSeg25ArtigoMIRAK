import { Configuration, cpeMatch, Node } from "../entities/types/Scenarios";
import ExtractTools from "../../shared/ExtractTools";
import IScenarios from "./IScenarios";

export default class Scenarios implements IScenarios {
  private osCPEString: string;

  constructor(osCPE: string) {
    if (
      new RegExp(
        "^cpe:2\\.3:o:[^:]+:[^:]+:[^:]+:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*$"
      ).test(osCPE)
    ) {
      this.osCPEString = osCPE;
    } else {
      throw new Error("The Operating System CPE string is not valid!");
    }
  }

  public isCpeVulnerable(cpe: string, configuration: Configuration): boolean {
    if (!
      new RegExp(
        "^cpe:2\\.3:[oah]:[^:]+:[^:]+:[^:]+:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*$"
      ).test(cpe)
    ) {
      throw new Error("The CPE string is not valid!");
    }
    
    
    return configuration.operator
      ? this.evaluateNode(cpe, configuration.operator, configuration.nodes)
      : this.evaluateNode(cpe, "OR", configuration.nodes);
  }

  /**
   * Evaluates a node and its associated CPEs to establish whether the CPE, respecting the operators (AND/OR), meets the combination of conditions that determine vulnerability in this block of scenarios
   */
  private evaluateNode(
    cpe: string,
    blockOperator: "AND" | "OR",
    nodes: Node[]
  ): boolean {
    const results = nodes.map((node) => {
      const nodeResult = node.cpeMatch.some((cpeMatch) =>{
        // Check that it is not a support system using the scenario running with
        if (
          new RegExp(
            "^cpe:2\\.3:o:[^:]+:[^:]+:[^:]+:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*$"
          ).test(cpeMatch.criteria)
        ) {
          return this.evaluateCpeMatch(this.osCPEString, cpeMatch);
        }
        return this.evaluateCpeMatch(cpe, cpeMatch)
      }
      );

      if (node.operator === "OR") {
        return nodeResult;
      } else if (node.operator === "AND") {
        return node.cpeMatch.every((cpeMatch) =>      
          this.evaluateCpeMatch(cpe, cpeMatch),
        );
      }

      return node.negate ? !nodeResult : nodeResult;
    });

    // Returns true or false based on the node operator
    return blockOperator === "AND" ? results.every(Boolean) : results.some(Boolean);
  }

  /**
   *  Evaluates whether the CPE fits the vulnerability criteria
   */
  private evaluateCpeMatch(cpe: string, cpeMatch: cpeMatch): boolean {
    // Checks if they are the same CPE
    const match = cpe.startsWith(cpeMatch.criteria);
    

    if (!match) {
      // Checks if the CPE string is inside the range of versions (if applicable)
      if (
        cpeMatch.versionStartIncluding &&
        !this.isVersionGreaterOrEqual(cpe, cpeMatch.versionStartIncluding)
      ) {
        return false;
      }

      if (
        cpeMatch.versionEndIncluding &&
        !this.isVersionLessOrEqual(cpe, cpeMatch.versionEndIncluding)
      ) {
        return false;
      }

      if (
        cpeMatch.versionStartExcluding &&
        !this.isVersionGreater(cpe, cpeMatch.versionStartExcluding)
      ) {
        return false;
      }
      if (
        cpeMatch.versionEndExcluding &&
        !this.isVersionLess(cpe, cpeMatch.versionEndExcluding)
      ) {
        return false;
      }
      //Check if the version field contains the character "*", meaning they all match!
      if (
        this.extractVersionProduct(cpeMatch.criteria)[0] ===
        Number.MAX_SAFE_INTEGER
      ) {
        return cpeMatch.vulnerable;
      } else {
        return false;
      }
    }
    return cpeMatch.vulnerable;
  }

  private isVersionGreaterOrEqual(cpe: string, version: string): boolean {
    if (!cpe || !version) {
      return false;
    }
    const cpeVersion = this.extractVersionProduct(cpe);
    const targetVersion = this.extractVersionProduct(
      `cpe:2.3:*:*:*:${version}:*`
    );
    return this.compareProductVersions(cpeVersion, targetVersion) >= 0;
  }

  private isVersionLessOrEqual(cpe: string, version: string): boolean {
    if (!cpe || !version) {
      return false;
    }
    const cpeVersion = this.extractVersionProduct(cpe);
    const targetVersion = this.extractVersionProduct(
      `cpe:2.3:*:*:*:${version}:*`
    );
    return this.compareProductVersions(cpeVersion, targetVersion) <= 0;
  }

  private isVersionGreater(cpe: string, version: string): boolean {
    if (!cpe || !version) {
      return false;
    }
    const cpeVersion = this.extractVersionProduct(cpe);
    const targetVersion = this.extractVersionProduct(
      `cpe:2.3:*:*:*:${version}:*`
    );
    return this.compareProductVersions(cpeVersion, targetVersion) > 0;
  }

  private isVersionLess(cpe: string, version: string): boolean {
    if (!cpe || !version) {
      return false;
    }
    const cpeVersion = this.extractVersionProduct(cpe);
    const targetVersion = this.extractVersionProduct(
      `cpe:2.3:*:*:*:${version}:*`
    );
    return this.compareProductVersions(cpeVersion, targetVersion) < 0;
  }

  public extractVersionProduct(cpe: string): number[] {
    const versionField = cpe.split(":")[5];
    if (new RegExp("^d+(.d+)*$").test(versionField)) {
      return versionField.split(".").map((num) => parseInt(num));
    } else {
      if (versionField === "*") {
        return [Number.MAX_SAFE_INTEGER];
      }
      return versionField.split(".").map((part) => {
        if (isNaN(parseInt(part))) {
          return parseInt(part);
        } else {
          const numbers = ExtractTools.extractNumbersFromString(part);
          if (numbers == null) {
            return 0;
          } else {
            return numbers.reduce((prev, curr) => prev + curr);
          }
        }
      });
    }
  }

  private compareProductVersions(
    versionA: number[],
    versionB: number[]
  ): number {
    const length = Math.max(versionA.length, versionB.length);

    // Fill smaller arrays with 0 for alignment
    for (let i = 0; i < length; i++) {
      const part1 = versionA[i] || 0;
      const part2 = versionB[i] || 0;

      if (part1 > part2) return 1;
      if (part1 < part2) return -1;
    }

    return 0; // The versions are the same
  }
}
