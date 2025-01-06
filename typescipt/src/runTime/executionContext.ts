import {ILogger} from "../infrastructure/logger";

export interface IExecutionContext {
  logDebug(message: string): void;
  logVariable<T>(name: string , value: T ): void;
}

export class ExecutionContext implements IExecutionContext {

  private readonly logger: ILogger;

   constructor(logger: ILogger) {
     this.logger = logger;
   }

   public logDebug(message: string): void {
     this.logger.logDebug(message);
   }

   public logVariable<T>(name: string, value: T): void {
     this.logger.logDebug(` ${name}: ${value}`);
   }
}
