import CLI from "./cli/CLI";
import EvaluationService from "./core/services/EvaluationService";
import ExportReport from "./core/services/ExportReport";


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

async function start() {
  const cliInterface = CLI.instance;
  cliInterface.startCommand(main);
  cliInterface.start()
}
start();
