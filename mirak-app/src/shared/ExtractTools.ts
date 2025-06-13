/**
 * Utility class that provides static methods for string parsing and data extraction.
 *
 * This class is intended to group reusable logic for extracting specific information
 * from strings, such as numbers, keywords, or patterns. It is not meant to be instantiated.
 */
export default class ExtractTools {
  /**
   * Extracts all numerical values from a given string.
   *
   * This method scans the input string and returns an array containing
   * all sequences of digits found, parsed as numbers. If no numbers are found,
   * it returns `null`.
   *
   * @param input - The string to be scanned for numeric values.
   * @returns An array of numbers if any are found; otherwise, `null`.
   *
   * @example
   * ExtractTools.extractNumbersFromString("abc123def45") // returns [123, 45]
   * ExtractTools.extractNumbersFromString("no numbers")  // returns null
   */
  public static extractNumbersFromString(input: string): number[] | null {
    const matches = input.match(/\d+/g);
    // Converts matches to numbers and returns the array
    return matches ? matches.map(Number) : null;
  }
  public static extractVersionProduct(cpe: string): number[] {
    const versionField = cpe.split(":")[5];
    if (new RegExp("^d+(.d+)*$").test(versionField)) {
      return versionField.split(".").map((num) => parseInt(num));
    } else {
      // If the software version has the character "*" 
      // which means all versions will be returned, the 
      // largest integer number available.
      if (versionField === "*") {
        return [Number.MAX_SAFE_INTEGER];
      }
      return versionField.split(".").map((part) => {
        if (isNaN(parseInt(part))) {
          return parseInt(part);
        } else {
          const numbers = ExtractTools.extractNumbersFromString(part);
          if (numbers == null) {
            return 0;
          } else {
            return numbers.reduce((prev, curr) => prev + curr);
          }
        }
      });
    }
  }
}
