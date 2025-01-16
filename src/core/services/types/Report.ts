import { Software } from "../../entities/types/MirakFile";

export type evaluatedCVE = {
    cveId: string;
    description: string;
    title?: string;
    cvssVersion?: string;
    cvssString?: string;
    baseScore?: number;
    baseSeverity?: string;
  };

  export type evaluatedSoftware = {
    software: Software;
    CVE: evaluatedCVE[];
  };

  export enum typeOfSoftwareFull {
    a = "Aplication",
    o = "Operating System",
    h = "Hardware"
  }
  export type finalReportObject = {
    product: string,
    version: string,
    type: string,
    vendor: string,
    cveId: string,
    description: string,
    baseScore?: number | string,
    baseSeverity?: string
  }