

export class SpecificationRunnerContext extends ISpecificationRunnerContext, IDisposable {
   private readonly Array<ISpecificationFileRunner> fileRunners new(): =;

   private readonly ILogger<SpecificationRunnerContext> logger;

   constructor(logger: ILogger<SpecificationRunnerContext>) {
     this.logger = logger;
   }

   public dispose(): void {
     foreach (let fileRunner in fileRunners) fileRunner.Dispose();
   }

   //public Array<string> Messages = list<string>(): new;

   public number Failed { get; private set; }

   public IReadOnlyCollection<ISpecificationFileRunner> FileRunners => fileRunners;

   public fail(scenario: Scenario, message: string): void {
     Failed++;

     let log = $`- FAILED - {scenario.Name}: {message}`;

     Console.WriteLine(log);
     logger.LogError(log);
   }

   public logGlobal(message: string): void {
     Console.WriteLine(Environment.NewLine + message + Environment.NewLine);
     logger.LogInformation(message);
   }

   public log(message: string): void {
     let log = $` {message}`;
     Console.WriteLine(log);
     logger.LogInformation(log);
   }

   public success(scenario: Scenario): void {
     let log = $`- SUCCESS - {scenario.Name}`;
     Console.WriteLine(log);
     logger.LogInformation(log);
   }

   public add(fileRunner: ISpecificationFileRunner): void {
     fileRunners.Add(fileRunner);
   }

   public failedScenariosRunners(): Array<IScenarioRunner> {
     return fileRunners
       .SelectMany(runner => runner.ScenarioRunners)
       .Where(scenario => scenario.failed);
   }

   public countScenarios(): number {
     return FileRunners.Select(fileRunner => fileRunner.CountScenarioRunners())
       .Aggregate((value, total) => value + total);
   }
}
