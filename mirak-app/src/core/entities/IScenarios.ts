import { Configuration } from "../entities/types/Scenarios";

export default interface IScenarios {
  /**
   * Checks if a specific CPE is vulnerable
   * 
   * Receives the CPE string and the block containing the scenario for evaluation
   * 
   * @param cpe 
   * @param configuration 
   * @returns True if the CPE fits the scenario presented as vulnerable
   * @type Boolean
   * @example 
```typescript
const cpe = "cpe:2.3:a:cron_project:cron:3.0pl1:*:*:*:*:*:*:*";
const configuration: Configuration = {
operator: "AND",
nodes: [
    {
    operator: "OR",
    negate: false,
    cpeMatch: [
        {
        vulnerable: true,
        criteria: "cpe:2.3:a:cron_project:cron:*:*:*:*:*:*:*:*",
        versionEndIncluding: "3.0pl1-128."
        }
    ]
    },
    {
    operator: "OR",
    negate: false,
    cpeMatch: [
        {
        vulnerable: false,
        criteria: "cpe:2.3:o:canonical:ubuntu_linux:*:*:*:*:*:*:*:*"
        }
    ]
    }
]
};

console.log(isCpeVulnerable(cpe, configuration)); // Return true or false
```
   */
  isCpeVulnerable(cpe: string, configuration: Configuration): boolean;

  extractVersionProduct(cpe: string): number[];
}
