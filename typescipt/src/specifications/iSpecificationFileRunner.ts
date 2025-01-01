

export interface ISpecificationFileRunner extends IDisposable {
   Array<IScenarioRunner> ScenarioRunners

   void Initialize(IServiceScope serviceScope, ISpecificationRunnerContext runnerContext, string fileName);

   number CountScenarioRunners();
   void Run();
}
