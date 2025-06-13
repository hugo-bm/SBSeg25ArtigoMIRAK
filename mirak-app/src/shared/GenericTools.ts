/**
 * Waits asynchronously for the specified number of milliseconds.
 *
 * This helper function introduces a non-blocking delay using a Promise,
 * which is useful in asynchronous flows, such as retry logic or rate limiting.
 * If an error occurs while awaiting, it may be interpreted as a permission issue.
 *
 * @param ms - The number of milliseconds to wait.
 * @returns A Promise that resolves after the given delay.
 *
 * @example
 * await wait(1000); // pauses execution for 1 second
 */ 
export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Returns the current date and time as a numeric-only string.
 *
 * The resulting format contains only digits (e.g., "20250607123045" for
 * June 7, 2025, at 12:30:45), which is useful for filenames, timestamps, or IDs.
 * If an error occurs while retrieving the date, it may be interpreted
 * as a permission issue (e.g., system time access restrictions).
 *
 * @returns A numeric string representing the current date and time.
 *
 * @example
 * getDateNowNumbersOnly(); // "20250607123045"
 */
export function getDateNowNumbersOnly(): string {
  const dateString = new Date(Date.now()).toLocaleString();
  return dateString.replace(/\D/g, '');
}

/**
 * Converts a number (0–7) to its symbolic Unix permission representation.
 *
 * This function maps each digit used in Unix file permissions (e.g., 7, 5, 3)
 * to a human-readable format like "rwx", "r-x", "rw-", etc.
 *
 * @param number - A digit between 0 and 7 representing Unix file permission.
 * @returns A symbolic permission string, or "---" if the digit is out of range.
 *
 * @example
 * octalForText(7); // returns "rwx"
 * octalForText(5); // returns "r-x"
 * octalForText(0); // returns "---"
 */
export function octalForText(number: number): string {
  const permission = ["---", "--x", "-w-", "-wx", "r--", "r-x", "rw-", "rwx"];
  return permission[number] || "---" 
}

