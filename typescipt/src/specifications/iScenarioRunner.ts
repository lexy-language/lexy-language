

export interface IScenarioRunner {
   boolean Failed
   Scenario Scenario

   void Initialize(string fileName, RootNodeList rootNodeList, Scenario scenario,
     ISpecificationRunnerContext context, IServiceScope serviceScope, IParserLogger parserLogger);

   void Run();
   string ParserLogging();
}
