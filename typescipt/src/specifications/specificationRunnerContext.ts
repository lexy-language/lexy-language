

export interface ISpecificationRunnerContext {
  number Failed
  IReadOnlyCollection<ISpecificationFileRunner> FileRunners

  void Fail(Scenario scenario, string message);
  void LogGlobal(string message);
  void Log(string message);
  void Success(Scenario scenario);
  void Add(ISpecificationFileRunner fileRunner);
  Array<IScenarioRunner> FailedScenariosRunners();
  number CountScenarios();
}


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
     logger.logInformation(message);
   }

   public log(message: string): void {
     let log = $` {message}`;
     Console.WriteLine(log);
     logger.logInformation(log);
   }

   public success(scenario: Scenario): void {
     let log = $`- SUCCESS - {scenario.Name}`;
     Console.WriteLine(log);
     logger.logInformation(log);
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
