import CLI from "./cli/CLI";
import EvaluationService from "./core/services/EvaluationService";
import ExportReport from "./core/services/ExportReport";

/**
 * Main entry point responsible for processing the input file and exporting the result.
 *
 * This function receives the input path to a file containing a Mirak File
 * and an output path where the results will be saved.
 * It coordinates the logic for reading, processing, fetching data from the NVD API,
 * and exporting results, often using other internal classes or services.
 *
 * @param input - Path to the file that contains the Mirak File.
 * @param output - Path where the processed results will be written.
 */
async function main(input: string, output:string) {
  const evaluation = EvaluationService.instance;
  const cliInterface = CLI.instance;
  cliInterface.writeSuccess("Application Started!\n");
  try {
    const report = await evaluation.evaluateServices(input, cliInterface);
    const softwareVulnerabilityQtd = report.map((software)=>software.cveAnalysis.length).reduce((pv, cv)=> pv + cv);
    if (softwareVulnerabilityQtd > 0){
      const reportWriter = new ExportReport();
      reportWriter.exportToCSV(report, output, cliInterface);
    }
    else {
      cliInterface.writeMessage("The vulnerability report was not exported because no vulnerabilities were found.")
    }
  } catch (error) {
    cliInterface.writeError(String(error));
  }
}

/**
 * Initializes and starts the application.
 *
 * This function is responsible for parsing CLI arguments (such as input and output paths),
 * setting up the CLI environment, and invoking the main logic of the application
 * by calling the `main` function. It acts as the application's bootstrapping mechanism.
 *
 * Typically called at the end of the program to ensure execution begins correctly.
 */
async function start() {
  const cliInterface = CLI.instance;
  cliInterface.startCommand(main);
  cliInterface.start()
}
start();
