import { createObjectCsvWriter } from "csv-writer";
import { evaluatedSoftware, finalReportObject, typeOfSoftwareFull } from "./types/Report";
import CLI from "../../cli/CLI";
import { getDateNowNumbersOnly } from "../../shared/GenericTools";

export default class ExportReport{


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