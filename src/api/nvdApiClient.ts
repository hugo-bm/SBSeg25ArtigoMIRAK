import { AxiosRequestConfig, AxiosResponse, HttpStatusCode } from "axios";
import { Vulnerabilities } from "../core/entities/Vulnerability";
import { VulnerabilityFactory } from "../core/factories/NvdFactory";
import { wait } from "../shared/GenericTools";
import CLI from "../cli/CLI";
import { CpeDictionaryList } from "../core/entities/CPEDictionaryList";
import api from "./axiosBaseApi";
import envVars from "../config/envVars";

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

  public static get instance() {
    if (!this._instance) {
      this._instance = new nvdApiClient();
    }
    return this._instance;
  }

  private async waitForNextWindow(): Promise<void> {
    const timeSinceLastRequest = Date.now() - this.lastRequestTime;

    // Tempo restante para respeitar a janela
    const waitTime = Math.max(this.waitTime - timeSinceLastRequest, 0);

    if (waitTime > 0) {
      await wait(waitTime);
    }
  }

  public async fetchDataForCPE(
    cpe: string,
    cli: CLI
  ): Promise<CpeDictionaryList | void> {
    await this.waitForNextWindow();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: AxiosRequestConfig<any> = {responseType: "json", headers: {

    }};

    if (options.headers && this.apiKey){
      options.headers['apiKey'] = this.apiKey;
    }

    try{
      const response = await api.get(
        `https://services.nvd.nist.gov/rest/json/cpes/2.0?cpeMatchString=${cpe}`,
        options
      );
  

      return await this.handleAPICPE(response, cli);
    }
    finally{
      this.lastRequestTime = Date.now() 
    }
    
  }
  public async fetchDataForCVE(
    cpe: string,
    cli: CLI
  ): Promise<Vulnerabilities | void> {
    await this.waitForNextWindow();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: AxiosRequestConfig<any> = {responseType: 'json', headers: {}};
    if (options.headers && this.apiKey){
      options.headers['apiKey'] = this.apiKey;
    }
    
    try{
      const response = await api.get(
        `https://services.nvd.nist.gov/rest/json/cves/2.0?cpeName=${cpe}`,
       options
      );
  
      return await this.handleAPICVE(response, cli);
    }finally{
      this.lastRequestTime = Date.now(); 
    }
  }

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
