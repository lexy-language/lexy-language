





namespace Lexy.Compiler.Specifications;

public class SpecificationRunnerContext : ISpecificationRunnerContext, IDisposable
{
   private readonly List<ISpecificationFileRunner> fileRunners = new();

   private readonly ILogger<SpecificationRunnerContext> logger;

   public SpecificationRunnerContext(ILogger<SpecificationRunnerContext> logger)
   {
     this.logger = logger;
   }

   public void Dispose()
   {
     foreach (var fileRunner in fileRunners) fileRunner.Dispose();
   }

   //public IList<string> Messages { get; } = new List<string>();

   public int Failed { get; private set; }

   public IReadOnlyCollection<ISpecificationFileRunner> FileRunners => fileRunners;

   public void Fail(Scenario scenario, string message)
   {
     Failed++;

     var log = $"- FAILED - {scenario.Name}: {message}";

     Console.WriteLine(log);
     logger.LogError(log);
   }

   public void LogGlobal(string message)
   {
     Console.WriteLine(Environment.NewLine + message + Environment.NewLine);
     logger.LogInformation(message);
   }

   public void Log(string message)
   {
     var log = $" {message}";
     Console.WriteLine(log);
     logger.LogInformation(log);
   }

   public void Success(Scenario scenario)
   {
     var log = $"- SUCCESS - {scenario.Name}";
     Console.WriteLine(log);
     logger.LogInformation(log);
   }

   public void Add(ISpecificationFileRunner fileRunner)
   {
     fileRunners.Add(fileRunner);
   }

   public IEnumerable<IScenarioRunner> FailedScenariosRunners()
   {
     return fileRunners
       .SelectMany(runner => runner.ScenarioRunners)
       .Where(scenario => scenario.Failed);
   }

   public int CountScenarios()
   {
     return FileRunners.Select(fileRunner => fileRunner.CountScenarioRunners())
       .Aggregate((value, total) => value + total);
   }
}
