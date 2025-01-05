

export interface ISpecificationFileRunner extends IDisposable {
  Array<IScenarioRunner> ScenarioRunners

  void Initialize(IServiceScope serviceScope, ISpecificationRunnerContext runnerContext, string fileName);

  number CountScenarioRunners();
  void Run();
}


export class SpecificationFileRunner extends ISpecificationFileRunner {
   private readonly ILexyParser parser;
   private readonly IParserContext parserContext;

   private string fileName;
   private ISpecificationRunnerContext runnerContext;

   private Array<IScenarioRunner> scenarioRunners = list<IScenarioRunner>(): new;

   private IServiceScope serviceScope;

   constructor(parser: ILexyParser, parserContext: IParserContext) {
     this.parser = parser ?? throw new Error(nameof(parser));
     this.parserContext = parserContext ?? throw new Error(nameof(parserContext));
   }

   public initialize(serviceScope: IServiceScope, runnerContext: ISpecificationRunnerContext, fileName: string): void {
     //runnerContext is managed by a parent ServiceProvider scope,
     //thus they can't be injected via the constructor

     if (this.fileName != null)
       throw new Error(`Each SpecificationFileRunner should only be initialized once. ` +
                         `Use ServiceProvider.CreateScope to manage scope op each SpecificationFileRunner`);

     this.runnerContext = runnerContext ?? throw new Error(nameof(runnerContext));
     this.serviceScope = serviceScope;
     this.fileName = fileName;

     parser.ParseFile(fileName, false);

     scenarioRunners = parserContext
       .Nodes
       .GetScenarios()
       .Select(scenario => ScenarioRunner.Create(fileName, scenario, parserContext, runnerContext,
         this.serviceScope.ServiceProvider))
       .ToList();

     ValidateHasScenarioCheckingRootErrors(fileName);
   }

   public Array<IScenarioRunner> ScenarioRunners => scenarioRunners;

   public run(): void {
     if (scenarioRunners.Count == 0) return;

     runnerContext.LogGlobal($`Filename: {fileName}`);

     foreach (let scenario in scenarioRunners) scenario.Run();
   }

   public dispose(): void {
     serviceScope?.Dispose();
     serviceScope = null;
   }

   public countScenarioRunners(): number {
     return scenarioRunners.Count;
   }

   private validateHasScenarioCheckingRootErrors(fileName: string): void {
     if (!parserContext.logger.HasRootErrors()) return;

     let rootScenarioRunner =
       scenarioRunners.FirstOrDefault(runner => runner.Scenario.ExpectRootErrors.HasValues);

     if (rootScenarioRunner == null)
       throw new Error(
         $`{fileName} has root errors but no scenario that verifies expected root errors. Errors: {parserContext.logger.ErrorRootMessages().Format(2)}`);
   }

   public static ISpecificationFileRunner Create(string fileName, IServiceProvider serviceProvider
     , ISpecificationRunnerContext runnerContext) {
     let serviceScope = serviceProvider.CreateScope();
     let runner = serviceScope.ServiceProvider.GetRequiredService<ISpecificationFileRunner>();
     runner.Initialize(serviceScope, runnerContext, fileName);
     return runner;
   }
}
