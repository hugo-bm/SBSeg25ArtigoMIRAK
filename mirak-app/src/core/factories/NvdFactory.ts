import { Vulnerability } from '../entities/types/Vulnerability';

import { CheckTools as ct } from '../../shared/CheckTools';
/**
 * Factory class for creating `Vulnerability` objects from raw JSON data.
 *
 * This class implements the Factory Design Pattern to encapsulate the logic required to parse
 * external data structures (such as those returned from the NVD API) and transform them into
 * structured, typed `Vulnerability` instances usable by the application.
 *
 * It ensures that all `Vulnerability` objects are built consistently and shields the rest of the
 * codebase from the format and inconsistencies of external sources.
 *
 * ## Usage Example
 * ```ts
 * import { VulnerabilityFactory } from './VulnerabilityFactory';
 *
 * const json = nvdResponse.vulnerabilities[0];
 * const vulnerability = VulnerabilityFactory.create(json);
 *
 * if (vulnerability) {
 *   console.log(vulnerability.cveId);
 * }
 * ```
 *
 * @see Vulnerability
 * @pattern Factory
 */
export class VulnerabilityFactory {
/**
 * Creates a `Vulnerability` instance from a raw JSON object.
 *
 * This static factory method parses a raw object (usually from the `vulnerabilities` array in an NVD JSON response)
 * and attempts to transform it into a valid `Vulnerability` instance.
 * Returns `null` if the object does not contain the required structure or data.
 *
 * @param json — An object found in the 'vulnerabilities' property of the NVD JSON response.
 * @returns A `Vulnerability` instance if valid data is found, otherwise `null`.
 *
 * @example
 * ```ts
 * const vulnerability = VulnerabilityFactory.create(nvdResponse.vulnerabilities[0]);
 * if (vulnerability) {
 *   console.log(vulnerability.cveId);
 * }
 * ```
 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static create(json: any): Vulnerability | null {
    if (
      !(
        ct.checkObjProperty(json.cve, 'id') &&
        ct.checkObjProperty(json.cve.descriptions[0], 'value')
      )
    ) {
      return null;
    }
    const obj: Vulnerability = {
      cveId: json.cve.id,
      description: json.cve.descriptions[0].value,
      affectedCPE: json.cve.configurations,
    };

    if (ct.checkObjProperty(json.cve, 'metrics')) {
      obj.cvssVersion = Object.keys(json.cve.metrics)[0].slice(-3);
      if (
        ct.checkObjProperty(json.cve.metrics, 'cvssMetric' + obj.cvssVersion)
      ) {
        obj.cvssString =
          json.cve.metrics[
            'cvssMetric' + obj.cvssVersion
          ][0].cvssData.vectorString;

        // obj.impactScore =
        //   json.cve.metrics['cvssMetric' + obj.cvssVersion][0].impactScore;
        // obj.exploitabilityScore =
        //   json.cve.metrics[
        //     'cvssMetric' + obj.cvssVersion
        //   ][0].exploitabilityScore;

        obj.baseScore =
          json.cve.metrics['cvssMetric' + obj.cvssVersion][0].cvssData.baseScore;
        obj.baseSeverity =
          json.cve.metrics[
            'cvssMetric' + obj.cvssVersion
          ][0].cvssData.baseSeverity;
      }
    }

    if (ct.checkObjProperty(json.cve, 'cisaVulnerabilityName')) {
      obj.title = json.cve.cisaVulnerabilityName;
    }

    return obj;
  }
}
