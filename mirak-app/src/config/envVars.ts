import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export default class envVars {
  private readonly _apiKey: string | undefined;
  private static _instance: envVars;

  private constructor(){
    this._apiKey = process.env.API_NVD_KEY;
  }

  public static get instance(): envVars {
    if (!this._instance) {
      this._instance = new envVars();
    }
    return this._instance;
  }

  public get apiKey(){
    return this._apiKey;
  }
}
