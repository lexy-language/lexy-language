


namespace Lexy.Compiler.Specifications;

public interface ISpecificationRunnerContext
{
   int Failed { get; }
   IReadOnlyCollection<ISpecificationFileRunner> FileRunners { get; }

   void Fail(Scenario scenario, string message);
   void LogGlobal(string message);
   void Log(string message);
   void Success(Scenario scenario);
   void Add(ISpecificationFileRunner fileRunner);
   IEnumerable<IScenarioRunner> FailedScenariosRunners();
   int CountScenarios();
}
