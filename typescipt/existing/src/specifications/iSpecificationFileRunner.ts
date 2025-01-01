



namespace Lexy.Compiler.Specifications;

public interface ISpecificationFileRunner : IDisposable
{
   IEnumerable<IScenarioRunner> ScenarioRunners { get; }

   void Initialize(IServiceScope serviceScope, ISpecificationRunnerContext runnerContext, string fileName);

   int CountScenarioRunners();
   void Run();
}
