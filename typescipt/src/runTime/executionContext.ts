

export class ExecutionContext extends IExecutionContext {
   private readonly ILogger<ExecutionContext> logger;

   constructor(logger: ILogger<ExecutionContext>) {
     this.logger = logger ?? throw new Error(nameof(logger));
   }

   public logDebug(message: string): void {
     logger.LogDebug(message);
   }

   public logVariable<T>(name: string, value: T): void {
     logger.LogDebug(` {Name}: {Value}`, name, value);
   }
}
