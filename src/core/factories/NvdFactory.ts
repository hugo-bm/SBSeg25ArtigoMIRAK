import { Vulnerability } from '../entities/types/Vulnerability';

import { CheckTools as ct } from '../../shared/CheckTools';

export class VulnerabilityFactory {
  /**
   *
   * @param json - An object found in the list of vulnerabilities contained in the 'vulnerabilities' property of the JSON response of an NVD query
   * @returns Return an object of type 'Vulnerability' or 'null' if the required data cannot be found
   * @type Vulnerability
   * @type null
   * @exemple
   * '''typescript
   * const vulnerability = VulnerabilityFactory.create(VulnerabilitiesJSON[0])
   * '''
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
      afectedCPE: json.cve.configurations,
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
