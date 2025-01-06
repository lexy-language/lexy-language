export enum LogLevel {
  Debug,
  Information,
  Warning,
  Error
}

export interface ILogger {
  logDebug(message: string);
  logInformation(message: string);
  logError(message: string);
  isEnabled(level: LogLevel);
}

export class ConsoleLogger implements ILogger {
  isEnabled(level: LogLevel) {
    return true;
  }

  logDebug(message: string) {
    console.log(`[DBG] - ${message}`)
  }

  logError(message: string) {
    console.log(`[ERR] - ${message}`)
  }

  logInformation(message: string) {
    console.log(`[INF]  - ${message}`)
  }
}