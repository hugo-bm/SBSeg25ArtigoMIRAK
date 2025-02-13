export default class ExtractTools{
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