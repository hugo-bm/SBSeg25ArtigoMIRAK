import { Configuration } from "../entities/types/Scenarios";

export default interface IScenarios {
  /**
   * Evaluates whether a given CPE string is considered vulnerable based on a provided scenario configuration.
   *
   * This function receives a CPE string and a scenario block (in NVD configuration format),
   * and returns `true` if the CPE matches a vulnerable condition defined in the configuration.
   *
   * @param {string} cpe - The CPE string to evaluate (e.g., "cpe:2.3:a:cron_project:cron:3.0pl1:*:*:*:*:*:*:*").
   * @param {Configuration} configuration - A block representing vulnerability logic in the NVD structure format.
   * @returns {boolean} `true` if the CPE is considered vulnerable according to the scenario, otherwise `false`.
   *
   * @example
   * const cpe = "cpe:2.3:a:cron_project:cron:3.0pl1:*:*:*:*:*:*:*";
   * const configuration: Configuration = {
   *   operator: "AND",
   *   nodes: [
   *     {
   *       operator: "OR",
   *       negate: false,
   *       cpeMatch: [
   *         {
   *           vulnerable: true,
   *           criteria: "cpe:2.3:a:cron_project:cron:*:*:*:*:*:*:*:*",
   *           versionEndIncluding: "3.0pl1-128."
   *         }
   *       ]
   *     },
   *     {
   *       operator: "OR",
   *       negate: false,
   *       cpeMatch: [
   *         {
   *           vulnerable: false,
   *           criteria: "cpe:2.3:o:canonical:ubuntu_linux:*:*:*:*:*:*:*:*"
   *         }
   *       ]
   *     }
   *   ]
   * };
   *
   * console.log(isCpeVulnerable(cpe, configuration)); // true or false
   */
  isCpeVulnerable(cpe: string, configuration: Configuration): boolean;

  extractVersionProduct(cpe: string): number[];
}
