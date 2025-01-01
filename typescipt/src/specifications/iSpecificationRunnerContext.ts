

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
