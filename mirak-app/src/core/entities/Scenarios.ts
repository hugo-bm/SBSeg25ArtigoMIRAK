import { Configuration, cpeMatch, Node } from "../entities/types/Scenarios";
import ExtractTools from "../../shared/ExtractTools";
import IScenarios from "./IScenarios";

/**
 * Handles the evaluation of software vulnerabilities based on scenario configurations.
 *
 * This class is responsible for determining whether a given software environment
 * matches any known vulnerability scenario.
 *
 * A scenario is defined using a set of criteria (e.g., CPEs, logical operators, and version bounds)
 * that describe when a system or application is considered vulnerable. These criteria
 * are typically extracted from sources like the NVD (National Vulnerability Database).
 *
 * The evaluation also takes into account execution context characteristics
 * such as operating system identifiers and discovered software components.
 *
 * ### Usage
 * Use this class to assess whether a system is affected by a known vulnerability,
 * given its current software configuration and CPE identifiers.
 *
 * @example
 * const scenarios = new Scenarios("cpe:2.3:o:canonical:ubuntu_linux:22.04:*:*:*:*:*:*:*");
 * const isVulnerable = scenarios.isCpeVulnerable(cpe, configuration);
 * console.log(isVulnerable); // true or false
 *
 * @see Configuration
 * @see CPE
 */
export default class Scenarios implements IScenarios {
  private osCPEString: string;
/**
   * Initializes a new instance of the Scenarios class.
   *
   * @param osCPE - A string containing the OS CPE identifier.
   * This value defines the environment context for the analysis (e.g., distro and version).
   *
   * @example
   * const scenario = new Scenarios('cpe:/o:canonical:ubuntu_linux:22.04');
   */
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
    
    // All versions path
    if (versionField === "*") {
      return [Number.MAX_SAFE_INTEGER];
    }
  
    // Desirable path: only numbers separated by periods
    if (/^\d+(\.\d+)*$/.test(versionField)) {
      return versionField.split(".").map(Number);
    }
  
    // General path: extracts all numbers found in the string
    const numbers = ExtractTools.extractNumbersFromString(versionField);
    return numbers ?? [0]; // Em caso de falha, retorna [0] por segurança
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
