import CLI from "./cli/CLI";
import EvaluationService from "./core/services/EvaluationService";
import ExportReport from "./core/services/ExportReport";


async function main(input: string, output:string) {
  const evaluation = EvaluationService.instance;
  const cliInterface = CLI.instance;
  cliInterface.writeSuccess("Application Started!\n");
  try {
    const report = await evaluation.evaluateServices(input, cliInterface);
    const reportWriter = new ExportReport();
    reportWriter.exportToCSV(report, output, cliInterface);
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
