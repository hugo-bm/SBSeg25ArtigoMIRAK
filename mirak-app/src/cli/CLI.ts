import { Command } from "commander";
import kleur from "kleur";
import cliProgress from "cli-progress";
import pt from "node:path";
/**
 * @singleton
 * The `CLI` class manages the command-line interface (CLI) of the application.
 * 
 * It implements a singleton pattern to ensure only one CLI instance exists. This class handles command parsing,
 * user input, progress visualization, and colored terminal messages using `commander`, `cli-progress`, and `kleur`.
 * 
 * Primary responsibilities include:
 * - Defining and configuring commands and options
 * - Parsing input and output paths
 * - Starting and managing a progress bar
 * - Displaying warnings, errors, and messages in color
 * 
 * The class is intended to facilitate a clean, user-friendly terminal experience for the app's execution.
 * 
 * @example
 * ```ts
 * CLI.instance.startCommand((input, output) => {
 *   // handle input and output logic
 * });
 * CLI.instance.start();
 * ```
 */
export default class CLI {
  static #intance: CLI;
  private program: Command;
  private progressBar: cliProgress.Bar;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private options: any = {};
/**
 * Initializes the CLI by setting up commands and configuring the progress bar.
 * 
 * This constructor is private to enforce the singleton pattern.
 */
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
/**
 * Configures the CLI's base commands and options, including the help and verbose flags.
 * 
 * This method is called internally by the constructor.
 */
  private setupCommands(): void {
    this.program
      .name("mirak-app")
      .description(
        "########### ⚠️  ALERT! #############\nThis software has been submitted to SBRC2025.\n##################################\nThis application assesses the presence of vulnerabilities in the execution environment of an RPKI Relying Party solution using data exported by mirak-extractor."
      )
      .version("1.0.0");

    this.program
      .command("help")
      .description("displays help information")
      .action(() => {
        this.program.outputHelp();
      });

    this.program.option(
      "-v, --verbose",
      "displays information issued in the execution process"
    );
  }
/**
 * Resolves and normalizes a given path based on the current working directory.
 * 
 * @param path - A value representing the file or directory path
 * @returns The resolved absolute path as a string
 */
  private parsePath(path: unknown): string {
    return pt.resolve(process.cwd(), String(path));
  }
/**
 * Returns the singleton instance of the CLI.
 * 
 * Ensures that only one instance of the CLI exists throughout the application.
 */
  public static get instance(): CLI {
    if (!this.#intance) {
      this.#intance = new CLI();
    }
    return this.#intance;
  }
/**
 * Registers the main CLI command used to trigger the application's analysis routine.
 * 
 * @param command - A function that accepts input and output paths and performs the core logic
 */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  public startCommand(command: Function) {
    this.program
      .command("evaluate")
      .description("start evaluating the environment for vulnerabilities")
      .argument(
        "<input-file>",
        'relative path to the MIRAK file, exported via the mirak-extractor software.\n\nExample: "/home/anyfolder//output_mirak.json"'
      )
      .argument(
        "[output-directory]",
        'relative path of the folder for the report output. Please note that the directory must exist for the file to be written.\n\nExample: "/home/anyfolder/output"',
        ""
      )
      .option(
        "--pdf",
        "this option should be used to export a report in PDF format in order to be human readable."
      )
      .action(async (input, output) => {
        await command(this.parsePath(input), this.parsePath(output));
      });
  }
/**
 * Checks whether the CLI is in verbose mode.
 * 
 * Verbose mode is enabled via the `--verbose` option.
 * 
 * @returns `true` if verbose mode is enabled; otherwise, `false`
 */
  private isVerbose(): boolean {
    return this.options?.verbose || false;
  }
/**
 * Starts the progress bar display.
 * 
 * Only starts if verbose mode is enabled.
 * 
 * @param total - The total number of steps for the progress bar
 */
  public startProgressBar(total: number) {
    if (this.isVerbose()) {
      this.progressBar.start(total, 0);
    }
  }
/**
 * Updates the progress bar to a new value.
 * 
 * Only applies if verbose mode is enabled.
 * 
 * @param updateValue - The current value to update the progress bar to
 */
  public updateProgressBar(upateValue: number) {
    if (this.isVerbose()) {
      this.progressBar.update(upateValue);
    }
  }
/**
 * Stops and clears the progress bar from the terminal.
 * 
 * Only applies if verbose mode is enabled.
 */
  public stopProgressBar() {
    if (this.isVerbose()) {
      this.progressBar.stop();
      console.log('\n');
    }
  }
/**
 * Displays a warning message in yellow color in the terminal.
 * 
 * Only visible in verbose mode.
 * 
 * @param message - The warning message to display
 */
  public writeWarning(message: string): void {
    if (this.isVerbose()) {
      console.log(kleur.yellow(`⚠️  Warning: ${message}`));
      console.log("\n");
    }
  }
/**
 * Displays an error message in red color in the terminal.
 * 
 * Only visible in verbose mode.
 * 
 * @param message - The error message to display
 */
  public writeError(message: string): void {
    if (this.isVerbose()) {
      console.log("");
      console.log(kleur.red(`❌  ${message}\n`));
    }
  }
/**
 * Displays a success message in green color in the terminal.
 * 
 * Only visible in verbose mode.
 * 
 * @param message - The success message to display
 */
  public writeSuccess(message: string): void {
    if (this.isVerbose()) {
      console.log("");
      console.log(kleur.green(`✔️  ${message}\n`));
    }
  }
/**
 * Displays an informational message in blue color in the terminal.
 * 
 * Only visible in verbose mode.
 * 
 * @param message - The message to display
 */
  public writeMessage(message: string): void {
    if (this.isVerbose()) {
      console.log(kleur.blue(`-> ${message}`));
    }
  }
/**
 * Displays a bold blue title on a white background in the terminal.
 * 
 * Only visible in verbose mode.
 * 
 * @param message - The title message to display
 */
  public writeTitle(message: string): void {
    if (this.isVerbose()) {
      console.log(kleur.blue().bold().bgWhite(message));
      console.log("\n");
    }
  }
/**
 * Parses CLI arguments from `process.argv` and extracts command-line options.
 * 
 * This should be called after configuring all commands and handlers.
 */
  public start() {
    this.program.parse(process.argv);
    this.options = this.program.opts();
  }
}
