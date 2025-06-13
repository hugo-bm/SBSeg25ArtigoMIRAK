/* List of HTTP error messages. The standard messages established to guide users 
in case of communication error with external APIs. Each message is linked to an 
HTTP error code following the RFC 9110 standard link:
https://httpwg.org/specs/rfc9110.html#overview.of.status.codes */
export const httpErrorMessages: Record<number, string> = {
  400: 'This error indicates that the NVD database cannot or will not process the request due to an application error. Check if there are any of the symbols "+,/,?,=" in any of the CPE indicator fields in the given MIRAK file. \nSorry for the inconvenience!',
  401: 'This error indicates that valid authentication credentials were requested, but the current ones are either invalid or missing. \nSorry for the inconvenience!',
  403: 'This error indicates that the NVD server has received your request but refuses to authorize it. This may be due to network problems. It is recommended that you restart your router or run a more detailed diagnostic. \nSorry for the inconvenience!',
  404: 'This error indicates that the requested resource from NVD does not exist. \nSorry for the inconvenience!',
  409: 'This error indicates that the request was not completed due to a conflict with the current state of the resource. It is recommended to check for duplication or authorization for the resource. \nSorry for the inconvenience!',
  429: 'This error indicates that the NVD server has received more requests than it can process in a short period of time. It is recommended that you wait a few moments and try again. \nSorry for the inconvenience!',
  500: 'This error indicates that the NVD server encountered an unexpected error and was unable to process the request. It is recommended that you try again in a few minutes. Or you can check for problems using "Check Availability" tools such as "https://www.site24x7.com/tools/check-website-availability.html" by passing the address "https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=10". \nSorry for the inconvenience!',
  503: 'This error indicates that the NVD server is not ready to handle a request due to overload, usage blockage or maintenance. It is recommended to check the internet connection or you can check for problems using "Check Availability" tools such as "https://www.site24x7.com/tools/check-website-availability.html" passing the address "https://services.nvd.nist.gov/rest/json/cves/2.0?resultsPerPage=10". \nSorry for the inconvenience!'
};
