/**
 * Utility class that provides static helper methods for common object checks.
 *
 * This class is not meant to be instantiated. Instead, it offers utility functions
 * that can be reused across the application to validate or inspect objects dynamically.
 * This kind of utility class helps to keep the codebase clean and maintainable
 * by centralizing commonly used logic.
 */
export class CheckTools {
  /**
   * Verifies whether a given property exists in an object.
   *
   * This method safely checks if the specified property is a direct property
   * of the given object. It first ensures that the object is not null or undefined,
   * and that it is of type `object`, before checking the property presence.
   *
   * @param obj - The object to be inspected. Can be of any type.
   * @param property - The property name to check for in the object.
   * @returns `true` if the property exists in the object; otherwise, `false`.
   */
  static checkObjProperty(obj: unknown, property: string): boolean {
    if (typeof obj === "object" && obj !== null && property in obj) {
      return true;
    }
    return false;
  }
}
