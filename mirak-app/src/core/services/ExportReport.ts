import { createObjectCsvWriter } from "csv-writer";
import { evaluatedSoftware, finalReportObject, typeOfSoftwareFull } from "./types/Report";
import CLI from "../../cli/CLI";
import { getDateNowNumbersOnly } from "../../shared/GenericTools";

/**
 * Provides services for exporting structured reports to disk.
 *
 * This class is responsible for organizing and generating final output reports
 * based on pre-evaluated and structured data. It receives data from external
 * analysis processes and formats it into an exportable report, which is then
 * written to the specified output folder.
 *
 * @remarks
 * This class assumes that the destination folder already exists.
 * It is designed to support data processing pipelines and ETL best practices.
 */
export default class ExportReport{

  /**
   * Exports the given structured evaluation data into a CSV file.
   *
   * The method processes the provided software evaluation results and transforms
   * them into a flat, structured CSV file that can be used for reporting or further
   * analysis. It saves the final file in the specified output path.
   *
   * The exported report adheres to ETL principles, ensuring that the data is normalized,
   * relevant, and consistently formatted for downstream consumers.
   *
   * @param data - An array of `evaluatedSoftware` items representing software evaluation results.
   * @param path - Absolute or relative path to the folder where the CSV report will be saved.
   * @param cli - An instance of the `CLI` class used for terminal output and logging.
   *
   * @returns A `Promise<void>` that resolves once the report has been written to disk.
   *
   * @throws Will throw an error if writing to the file system fails.
   *
   * @example
   * const exporter = new ExportReport();
   * await exporter.exportToCSV(results, "./output", cli);
   */
    public async exportToCSV(data: evaluatedSoftware[], path: string, cli: CLI)
    {
        cli.writeTitle("📝 File Export is starting!")
        cli.writeMessage("Preparing to export report to CSV file in path: " + path);
        // Structuring the report and applying ETL
        const report: finalReportObject[] = [];
        try {
          data.map((item) =>{
               item.cveAnalysis.forEach((vulnerability) =>{
                  report.push({
                    product: item.software.product,
                    vendor: item.software.vendor,
                    type: typeOfSoftwareFull[item.software.type],
                    version: item.software.version,
                    cve_id: vulnerability.cveId,
                    description: vulnerability.description.replace(/[\r\n]+/g, ' '),
                    base_score: vulnerability.baseScore ? vulnerability.baseScore : "N/A",
                    base_severity: vulnerability.baseSeverity ? vulnerability.baseSeverity : "N/A",
                    software_required: item.rpkiAnalyses.software_required,
                    related_port: item.rpkiAnalyses.related_port ? "yes": "no",
                    port_required: item.rpkiAnalyses.port_required? "yes" : "no",
                    notes: item.rpkiAnalyses.notes
                  });
               });
          });
        } catch (error) {
          cli.writeError(`Error preparing final data formatting for export! Error description: ${error}`);
        }
        const keys: string[] = Object.keys(report[0]); 
        const finalPath: string = `${path}/Report_${getDateNowNumbersOnly()}.csv`;
        const csvWriter = createObjectCsvWriter({
            path: finalPath,
            header: keys.map(key => ({ id: key, title: key })), // Mapping Object Keys to CSV Headers
            fieldDelimiter: ";"
          });
          try {
            await csvWriter.writeRecords(report); // Writing data to CSV file
            cli.writeSuccess(`File generated successfully!`);
          } catch (error) {
            cli.writeError(`Error generating file at path: ${finalPath}\n Err description: ${error}`);
          }
    }
}