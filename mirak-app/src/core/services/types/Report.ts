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
    cveAnalysis: evaluatedCVE[];
    rpkiAnalyses: evaluatedSoftwareData;
  };

  export type evaluatedSoftwareData = {
    software_required: string;
    related_port: boolean;
    port_required: boolean;
    notes: string;
  }

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
    cve_id: string,
    description: string,
    base_score?: number | string,
    base_severity?: string
    software_required: string;
    related_port: string;
    port_required: string;
    notes: string;
  }