export class CheckTools {
  static checkObjProperty(obj: unknown, property: string): boolean {
    if (typeof obj === 'object' && obj !== null && property in obj) {
      return true;
    }
    return false;
  }
}
