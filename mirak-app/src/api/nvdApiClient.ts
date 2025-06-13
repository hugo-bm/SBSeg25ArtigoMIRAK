import { AxiosRequestConfig, AxiosResponse, HttpStatusCode } from "axios";
import { Vulnerabilities } from "../core/entities/Vulnerability";
import { VulnerabilityFactory } from "../core/factories/NvdFactory";
import { wait } from "../shared/GenericTools";
import CLI from "../cli/CLI";
import { CpeDictionaryList } from "../core/entities/CPEDictionaryList";
import api from "./axiosBaseApi";
import envVars from "../config/envVars";

/**
 * @singleton
 * Provides centralized access to the NVD API.
 *
 * This class centralizes and regulates all HTTP requests made to the National Vulnerability Database (NVD)
 * API, ensuring that the application complies with the NVD's rate limiting policies. It dynamically calculates
 * the appropriate delay between requests based on the presence of an API key, the time taken by the previous
 * request, and static wait time rules provided by the NVD documentation.
 *
 * If an API key is present, the client is allowed to make more frequent requests; otherwise, it enforces
 * a stricter delay. The delay is dynamically adjusted by subtracting the elapsed time of the request
 * (including API response and local processing time) from the configured minimum interval.
 *
 * This class follows the **Singleton design pattern**, ensuring that only one instance exists
 * throughout the application's lifecycle. The constructor does not take parameters but is
 * responsible for initializing the internal state required for API control.
 *
 * @example
 * const cli = CLI.instance;
 * const client = nvdApiClient.instance;
 * const cpe_list = await client.fetchDataForCPE("cpe:2.3:a:microsoft:windows_10:1909:*:*:*:*:*:*:*", cli);
 * const cve_list = await client.fetchDataForCVE("cpe:2.3:a:microsoft:windows_10:1909:*:*:*:*:*:*:*", cli);
 */
export default class nvdApiClient {
  private waitTime: number;
  private lastRequestTime: number;
  private apiKey: string | undefined;

  private static _instance: nvdApiClient;

  private constructor() {
    this.apiKey = envVars.instance.apiKey;
    this.waitTime = this.apiKey ? 1000 : 7500;
    this.lastRequestTime = 0;
  }

  /**
   * Returns the single instance of the nvdApiClient class.
   *
   * This method implements the Singleton design pattern. It ensures that only
   * one instance of the class is created and reused throughout the application,
   * centralizing access and control to the NVD API.
   *
   * @returns The single instance of `nvdApiClient`.
   */
  public static get instance() {
    if (!this._instance) {
      this._instance = new nvdApiClient();
    }
    return this._instance;
  }
  // Calculates and waits the appropriate time before making a new request,
  // ensuring compliance with NVD rate limit rules depending on the presence
  // of an API key.
  private async waitForNextWindow(): Promise<void> {
    const timeSinceLastRequest = Date.now() - this.lastRequestTime;

    // Time remaining to respect the window
    const waitTime = Math.max(this.waitTime - timeSinceLastRequest, 0);

    if (waitTime > 0) {
      await wait(waitTime);
    }
  }

  /**
   * Retrieves dictionary information related to a specific CPE from the NVD API.
   *
   * This method queries the NVD API for data related to a given CPE string and returns
   * a list of dictionary entries associated with it. The input CPE should be in the 2.3 format,
   * using the wildcard character `*` in the fields where more general results are desired.
   *
   * To reduce the volume of irrelevant information, it is strongly recommended to
   * provide either the "vendor" or "product" fields.
   *
   * @param cpe - A string in CPE 2.3 format to be queried.
   * @param cli - CLI interface used to display progress and messages.
   * @returns A `CpeDictionaryList` object or `void` if no data is retrieved.
   */
  public async fetchDataForCPE(
    cpe: string,
    cli: CLI
  ): Promise<CpeDictionaryList | void> {
    await this.waitForNextWindow();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: AxiosRequestConfig<any> = {
      responseType: "json",
      headers: {},
    };

    if (options.headers && this.apiKey) {
      options.headers["apiKey"] = this.apiKey;
    }

    try {
      const response = await api.get(
        `https://services.nvd.nist.gov/rest/json/cpes/2.0?cpeMatchString=${cpe}`,
        options
      );

      return await this.handleAPICPE(response, cli);
    } finally {
      this.lastRequestTime = Date.now();
    }
  }

  /**
   * Retrieves vulnerability data associated with a specific CPE from the NVD API.
   *
   * This method queries the NVD API to obtain a list of vulnerabilities that affect
   * a specific product version identified by a CPE. The method expects the CPE to have
   * at least the "vendor", "product", and "version" fields filled to avoid 404 errors.
   *
   * The CLI object is used to provide feedback and status information during the request.
   *
   * @param cpe - A fully qualified CPE string with vendor, product, and version.
   * @param cli - CLI interface used to display progress and messages.
   * @returns A {@link Vulnerabilities} object or `void` if no data is retrieved.
   */
  public async fetchDataForCVE(
    cpe: string,
    cli: CLI
  ): Promise<Vulnerabilities | void> {
    await this.waitForNextWindow();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: AxiosRequestConfig<any> = {
      responseType: "json",
      headers: {},
    };
    if (options.headers && this.apiKey) {
      options.headers["apiKey"] = this.apiKey;
    }

    try {
      const response = await api.get(
        `https://services.nvd.nist.gov/rest/json/cves/2.0?cpeName=${cpe}`,
        options
      );

      return await this.handleAPICVE(response, cli);
    } finally {
      this.lastRequestTime = Date.now();
    }
  }
  // Processes the API response for a CVE query, extracting and converting
  // the relevant data into a Vulnerabilities object.
  private async handleAPICVE(
    response: AxiosResponse,
    cli: CLI
  ): Promise<Vulnerabilities> {
    return new Promise((resolve, reject) => {
      const vulnerabilities = new Vulnerabilities();

      if (response.status === HttpStatusCode.Ok) {
        for (const dataCVE of response.data.vulnerabilities) {
          const cveItem = VulnerabilityFactory.create(dataCVE);
          if (cveItem !== null) {
            vulnerabilities.addVulnerability(cveItem);
          }
        }

        resolve(vulnerabilities);
      } else {
        reject(
          `Response with status code ${response.status} - ${response.statusText}`
        );
      }
    });
  }

  // Processes the API response for a CPE query, extracting and converting
  // the relevant data into a CpeDictionaryList object.
  private async handleAPICPE(
    response: AxiosResponse,
    cli: CLI
  ): Promise<CpeDictionaryList> {
    return new Promise((resolve, reject) => {
      const Dictionary = new CpeDictionaryList();

      if (response.status === HttpStatusCode.Ok) {
        for (const dataCPE of response.data.products) {
          const cpeItem = dataCPE.cpe;
          if (cpeItem !== null) {
            Dictionary.push(cpeItem);
          }
        }

        resolve(Dictionary);
      } else {
        reject(
          `Response with status code ${response.status} - ${response.statusText}`
        );
      }
    });
  }
}
