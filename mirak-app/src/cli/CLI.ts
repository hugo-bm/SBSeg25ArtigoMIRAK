import { Command } from "commander";
import kleur from "kleur";
import cliProgress from "cli-progress";
import pt from "node:path";

export default class CLI {
  static #intance: CLI;
  private program: Command;
  private progressBar: cliProgress.Bar;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private options: any = {};

  private constructor() {
    this.program = new Command();
    this.progressBar = new cliProgress.SingleBar(
      {
        format: "Process: {bar} {percentage}%",
      },
      cliProgress.Presets.shades_classic
    );
    this.setupCommands();
  }

  private setupCommands(): void {
    this.program
      .name("mirak-app")
      .description(
        "########### ⚠️  ALERT! #############\nThis software is in a prototype state. Fixes will be released as issues are detected.\n##################################\nThis application evaluates whether there are vulnerabilities in the execution environment of an RPKI solution. Using the data exported by mirak-extractor."
      )
      .version("1.0.0");

    this.program
      .command("help")
      .description("Displays help information")
      .action(() => {
        this.program.outputHelp();
      });

    this.program.option(
      "-v, --verbose",
      "Displays information issued in the execution process"
    );
  }

  private parsePath(path: unknown): string {
    return pt.resolve(process.cwd(), String(path));
  }

  public static get instance(): CLI {
    if (!this.#intance) {
      this.#intance = new CLI();
    }
    return this.#intance;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  public startCommand(command: Function) {
    this.program
      .command("evaluate")
      .description("Start evaluating the environment for vulnerabilities")
      .argument(
        "<input-file>",
        'Relative path to the MIRAK file, exported via the mirak-extractor software.\n\nExample: "/home/anyfolder//output_mirak.json"'
      )
      .argument(
        "[output-directory]",
        'Relative path of the folder for the report output. Please note that the directory must exist for the file to be written.\n\nExample: "/home/anyfolder/output"',
        ""
      )
      .option(
        "--pdf",
        "This option should be used to export a report in PDF format in order to be human readable."
      )
      .action(async (input, output) => {
        await command(this.parsePath(input), this.parsePath(output));
      });
  }

  private isVerbose(): boolean {
    return this.options?.verbose || false;
  }

  public startProgressBar(total: number) {
    if (this.isVerbose()) {
      this.progressBar.start(total, 0);
    }
  }

  public updateProgressBar(upateValue: number) {
    if (this.isVerbose()) {
      this.progressBar.update(upateValue);
    }
  }

  public stopProgressBar() {
    if (this.isVerbose()) {
      this.progressBar.stop();
      console.log('\n');
    }
  }

  public writeWarning(message: string): void {
    if (this.isVerbose()) {
      console.log(kleur.yellow(`⚠️  Warning: ${message}`));
      console.log("\n");
    }
  }

  public writeError(message: string): void {
    if (this.isVerbose()) {
      console.log("");
      console.log(kleur.red(`❌  ${message}\n`));
    }
  }

  public writeSuccess(message: string): void {
    if (this.isVerbose()) {
      console.log("");
      console.log(kleur.green(`✔️  ${message}\n`));
    }
  }

  public writeMessage(message: string): void {
    if (this.isVerbose()) {
      console.log(kleur.blue(`-> ${message}`));
    }
  }

  public writeTitle(message: string): void {
    if (this.isVerbose()) {
      console.log(kleur.blue().bold().bgWhite(message));
      console.log("\n");
    }
  }

  public start() {
    this.program.parse(process.argv);
    this.options = this.program.opts();
  }
}
