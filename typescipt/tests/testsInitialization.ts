import winston from "winston";
import path from "path-browserify";
import * as fs from 'fs';
import {ILogger, LogLevel} from "../src/infrastructure/logger";


const parserLogFile = "parser.log";
const compilerLogFile = "compiler.log";
const executionLogFile = "execution.log";
const testsLogFile = "tests.log";

const digit0 = '0'.charCodeAt(0);
const digit9 = '9'.charCodeAt(0);
const point = '.'.charCodeAt(0);

function normalize(date: string): string {
  let nameBuilder: Array<string> = [];
  for (let index = 0; index < date.length; index++) {
    const value = date.charCodeAt(index);
    if (value >= digit0 && value <= digit9) {
      nameBuilder.push(String.fromCharCode(value));
    } else if (value == point) {
      break;
    }
  }
  return nameBuilder.join("");
}

beforeAll(() => {
  LoggingConfiguration.configure();

});

class WinstonLogger implements ILogger {
  private logger: winston.LoggerInstance;

  constructor(logger: winston.LoggerInstance) {
    this.logger = logger;
  }

  isEnabled(level: LogLevel) {
    if (this.logger.level == "error") return LogLevel.Error;
    if (this.logger.level == "warn") return LogLevel.Warning;
    if (this.logger.level == "info") return LogLevel.Information;
    return LogLevel.Debug;
  }

  logDebug(message: string) {
    this.logger.debug(message);
  }

  logError(message: string) {
    this.logger.error(message);
  }

  logInformation(message: string) {
    this.logger.info(message);
  }

}

export class LoggingConfiguration {
  static readonly logRun = `${normalize(new Date().toISOString())}-lexy-`;

  public static getParserLogger(): ILogger {
    return LoggingConfiguration.winstonLogger('LexyParser');
  }

  public static getCompilerLogger(): ILogger {
    return LoggingConfiguration.winstonLogger('LexyCompiler');
  }

  public static getExecutionLogger(): ILogger {
    return LoggingConfiguration.winstonLogger('ExecutionContext');
  }

  public static getMainLogger(): ILogger {
    return new WinstonLogger(winston.default);
  }

  public static mainLogger(fileName) {
    winston.configure({
      transports: [
        new winston.transports.Console({level: 'silly'}),
        new winston.transports.File({filename: LoggingConfiguration.fullLogFile(fileName)})
      ]
    });
  }

  public static addLogger(name: string, fileName: string) {
    winston.loggers.add(name, {
      transports: [
        new winston.transports.Console({level: 'silly'}),
        new winston.transports.File({
          filename: LoggingConfiguration.fullLogFile(fileName),
          level: "debug",
          json: false
        })
      ]
    });
  }

  public static logFileNames(): void {
    console.log("Log Files:");
    console.log(`  parser: ${LoggingConfiguration.fullLogFile(parserLogFile)}`);
    console.log(`  compiler: ${LoggingConfiguration.fullLogFile(compilerLogFile)}`);
    console.log(`  execution: ${LoggingConfiguration.fullLogFile(executionLogFile)}`);
    console.log(`  tests: ${LoggingConfiguration.fullLogFile(testsLogFile)}`);
  }

  private static fullLogFile(fileName: string): string {
    return path.join(LoggingConfiguration.logFilesDirectory(), LoggingConfiguration.logFile(fileName));
  }

  private static logFile(fileName: string): string {
    return LoggingConfiguration.logRun + fileName;
  }

  private findFiles(folder, pattern = /.*/) {
    const result = [];
    fs.readdirSync(folder).map(function (file) {
      const name = path.join(folder, file);
      if (pattern.test(name)) {
        result.push(name);
      }
    });
    return result;
  };

  public removeOldFiles() {
    const logFiles = this.findFiles(LoggingConfiguration.logFilesDirectory(), /.log/);
    const now = new Date();

    for (const logFile of logFiles) {
      const datePart = path.basename(logFile).split("-")[0];
      const dateValue = LoggingConfiguration.parseDate(datePart);
      if (dateValue == null) {
        continue;
      }

      const hours = Math.abs(now - dateValue) / 36e5;
      if (hours > 1) {
        fs.unlinkSync(logFile);
      }
    }
  }

  private static logFilesDirectory(): string {
    return path.join(path.dirname(__filename), "logs");
  }

  private static parseDate(datePart: string): Date | null {
    if (datePart.length != 14) return null;
    return new Date(
      parseInt(datePart.substring(0, 4)),
      parseInt(datePart.substring(4, 6)) - 1,
      parseInt(datePart.substring(6, 8)),
      parseInt(datePart.substring(8, 10)),
      parseInt(datePart.substring(10, 12)),
      parseInt(datePart.substring(12, 14)));
  }

  private static winstonLogger(name: string) {
    return new WinstonLogger(winston.loggers.get(name));
  }

  public static configure() {

    LoggingConfiguration.mainLogger(testsLogFile);
    LoggingConfiguration.addLogger("LexyParser", parserLogFile)
    LoggingConfiguration.addLogger("LexyCompiler", compilerLogFile)
    LoggingConfiguration.addLogger("ExecutionContext", compilerLogFile)

    const logFolder = LoggingConfiguration.logFilesDirectory();
    if (!fs.existsSync(logFolder)){
      fs.mkdirSync(logFolder, { recursive: true });
    }

    LoggingConfiguration.logFileNames();
  }
}



