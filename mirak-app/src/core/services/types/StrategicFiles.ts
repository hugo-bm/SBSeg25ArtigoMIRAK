import { type, Permission } from "../../entities/types/MirakFile";

export interface rpkiFilesForAnalysis {
  name: string;
  type: type;
  permissions: Permission;
  user: string;
  group: string;
}

export interface resultStrategicFile {

  name: string;
  path: string;
  type: type;
  permission: string;
  status: status[];
}

export type status = {
  statusFor: string;
  status: boolean;
  note: string;
};

export type StrategicFileMessageBlock = {
  success: boolean;
  generatePositiveMsg: (name: string, type: string) => string;
  generateNegativeMsg: (
    name: string,
    type: string,
    describeMsgBlock?: string[]
  ) => string;
  describeMsgBlock?: string[];
};
