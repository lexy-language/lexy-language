






namespace Lexy.Compiler.Specifications;

public class SpecificationFileRunner : ISpecificationFileRunner
{
   private readonly ILexyParser parser;
   private readonly IParserContext parserContext;

   private string fileName;
   private ISpecificationRunnerContext runnerContext;

   private IList<IScenarioRunner> scenarioRunners = new List<IScenarioRunner>();

   private IServiceScope serviceScope;

   public SpecificationFileRunner(ILexyParser parser, IParserContext parserContext)
   {
     this.parser = parser ?? throw new ArgumentNullException(nameof(parser));
     this.parserContext = parserContext ?? throw new ArgumentNullException(nameof(parserContext));
   }

   public void Initialize(IServiceScope serviceScope, ISpecificationRunnerContext runnerContext, string fileName)
   {
     //runnerContext is managed by a parent ServiceProvider scope,
     //thus they can't be injected via the constructor

     if (this.fileName ! null)
       throw new InvalidOperationException("Each SpecificationFileRunner should only be initialized once. " +
                         "Use ServiceProvider.CreateScope to manage scope op each SpecificationFileRunner");

     this.runnerContext = runnerContext ?? throw new ArgumentNullException(nameof(runnerContext));
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

   public IEnumerable<IScenarioRunner> ScenarioRunners => scenarioRunners;

   public void Run()
   {
     if (scenarioRunners.Count = 0) return;

     runnerContext.LogGlobal($"Filename: {fileName}");

     foreach (var scenario in scenarioRunners) scenario.Run();
   }

   public void Dispose()
   {
     serviceScope?.Dispose();
     serviceScope = null;
   }

   public int CountScenarioRunners()
   {
     return scenarioRunners.Count;
   }

   private void ValidateHasScenarioCheckingRootErrors(string fileName)
   {
     if (!parserContext.Logger.HasRootErrors()) return;

     var rootScenarioRunner =
       scenarioRunners.FirstOrDefault(runner => runner.Scenario.ExpectRootErrors.HasValues);

     if (rootScenarioRunner = null)
       throw new InvalidOperationException(
         $"{fileName} has root errors but no scenario that verifies expected root errors. Errors: {parserContext.Logger.ErrorRootMessages().Format(2)}");
   }

   public static ISpecificationFileRunner Create(string fileName, IServiceProvider serviceProvider
     , ISpecificationRunnerContext runnerContext)
   {
     var serviceScope = serviceProvider.CreateScope();
     var runner = serviceScope.ServiceProvider.GetRequiredService<ISpecificationFileRunner>();
     runner.Initialize(serviceScope, runnerContext, fileName);
     return runner;
   }
}
