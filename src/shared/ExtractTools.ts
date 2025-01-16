export default class ExtractTools{
    public static extractNumbersFromString(input: string): number[] | null {
        const matches = input.match(/\d+/g);        
        // Converts matches to numbers and returns the array
        return matches ? matches.map(Number) : null;
      }
}