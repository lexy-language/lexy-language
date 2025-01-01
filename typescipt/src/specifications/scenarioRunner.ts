

export class ScenarioRunner extends IScenarioRunner, IDisposable {
   private readonly ILexyCompiler lexyCompiler;
   private ISpecificationRunnerContext context;

   private string fileName;
   private Function function;
   private IParserLogger parserLogger;
   private RootNodeList rootNodeList;
   private IServiceScope serviceScope;

   constructor(lexyCompiler: ILexyCompiler) {
     this.lexyCompiler = lexyCompiler;
   }

   public dispose(): void {
     serviceScope?.Dispose();
     serviceScope = null;
   }

   public boolean Failed { get; private set; }
   public Scenario Scenario { get; private set; }

   public void Initialize(string fileName, RootNodeList rootNodeList, Scenario scenario,
     ISpecificationRunnerContext context, IServiceScope serviceScope, IParserLogger parserLogger) {
     //parserContext and runnerContext are managed by a parent ServiceProvider scope,
     //thus they can't be injected via the constructor
     if (this.fileName != null)
       throw new Error(
         `Initialize should only called once. Scope should be managed by ServiceProvider.CreateScope`);

     this.fileName = fileName ?? throw new Error(nameof(fileName));
     this.context = context;

     this.rootNodeList = rootNodeList ?? throw new Error(nameof(rootNodeList));
     this.parserLogger = parserLogger ?? throw new Error(nameof(parserLogger));
     this.serviceScope = serviceScope ?? throw new Error(nameof(serviceScope));

     Scenario = scenario ?? throw new Error(nameof(scenario));
     function = scenario.Function ?? rootNodeList.GetFunction(scenario.FunctionName.Value);
   }

   public run(): void {
     if (parserLogger.NodeHasErrors(Scenario)) {
       Fail($` Parsing scenario failed: {Scenario.FunctionName}`);
       parserLogger.ErrorNodeMessages(Scenario).ForEach(context.Log);
       return;
     }

     if (!ValidateErrors(context)) return;

     let nodes = function.GetFunctionAndDependencies(rootNodeList);
     let compilerResult = lexyCompiler.Compile(nodes);
     let executable = compilerResult.GetFunction(function);
     let values = GetValues(Scenario.Parameters, function.Parameters, compilerResult);

     let result = executable.Run(values);

     let validationResultText = GetValidationResult(result, compilerResult);
     if (validationResultText.length > 0)
       Fail(validationResultText);
     else
       context.Success(Scenario);
   }

   public parserLogging(): string {
     return $`------- Filename: {fileName}{Environment.NewLine}{parserLogger.errorMessages().Format(2)}`;
   }

   public static IScenarioRunner Create(string fileName, Scenario scenario,
     IParserContext parserContext, ISpecificationRunnerContext context,
     IServiceProvider serviceProvider) {
     if (scenario == null) throw new Error(nameof(scenario));

     let serviceScope = serviceProvider.CreateScope();
     let scenarioRunner = serviceScope.ServiceProvider.GetRequiredService<IScenarioRunner>();
     scenarioRunner.Initialize(fileName, parserContext.Nodes, scenario, context, serviceScope, parserContext.logger);

     return scenarioRunner;
   }

   private fail(message: string): void {
     Failed = true;
     context.fail(Scenario, message);
   }

   private getValidationResult(result: FunctionResult, compilerResult: CompilerResult): string {
     let validationResult = new StringWriter();
     foreach (let expected in Scenario.results.Assignments) {
       let actual = result.GetValue(expected.Variable);
       let expectedValue =
         TypeConverter.Convert(compilerResult, expected.ConstantValue.Value, expected.VariableType);

       if (actual == null || expectedValue == null
                || actual.GetType() != expectedValue.GetType()
                || Comparer.Default.Compare(actual, expectedValue) != 0)
         validationResult.WriteLine(
           $`'{expected.Variable}' should be '{expectedValue ?? `<null>`}' ({expectedValue?.GetType().Name}) but is '{actual ?? `<null>`} ({actual?.GetType().Name})'`);
     }

     return validationResult.toString();
   }

   private validateErrors(runnerContext: ISpecificationRunnerContext): boolean {
     if (Scenario.ExpectRootErrors.HasValues) return ValidateRootErrors();

     let node = function ?? Scenario.Function ?? Scenario.Enum ?? (IRootNode)Scenario.Table;
     let failedMessages = parserLogger.ErrorNodeMessages(node);

     if (failedMessages.length > 0 && !Scenario.ExpectError.HasValue) {
       Fail(`Exception occured: ` + failedMessages.Format(2));
       return false;
     }

     if (!Scenario.ExpectError.HasValue) return true;

     if (failedMessages.length == 0) {
       Fail($`No exception {Environment.NewLine}` +
         $` Expected: {Scenario.ExpectError.Message}{Environment.NewLine}`);
       return false;
     }

     if (!failedMessages.Any(message => message.contains(Scenario.ExpectError.Message))) {
       Fail($`Wrong exception {Environment.NewLine}` +
         $` Expected: {Scenario.ExpectError.Message}{Environment.NewLine}` +
         $` Actual: {failedMessages.Format(4)}`);
       return false;
     }

     runnerContext.Success(Scenario);
     return false;
   }

   private validateRootErrors(): boolean {
     let failedMessages = parserLogger.errorMessages().ToList();
     if (!failedMessages.Any()) {
       Fail($`No exceptions {Environment.NewLine}` +
         $` Expected: {Scenario.ExpectRootErrors.Messages.Format(4)}{Environment.NewLine}` +
         ` Actual: none`);
       return false;
     }

     let failed = false;
     foreach (let rootMessage in Scenario.ExpectRootErrors.Messages) {
       let failedMessage = failedMessages.Find(message => message.contains(rootMessage));
       if (failedMessage != null)
         failedMessages.Remove(failedMessage);
       else
         failed = true;
     }

     if (!failedMessages.Any() && !failed) {
       context.Success(Scenario);
       return false; // don't compile and run rest of scenario
     }

     Fail($`Wrong exception {Environment.NewLine}` +
       $` Expected: {Scenario.ExpectRootErrors.Messages.Format(4)}{Environment.NewLine}` +
       $` Actual: {parserLogger.errorMessages().Format(4)}`);
     return false;
   }

   private IDictionary<string, object> GetValues(ScenarioParameters scenarioParameters,
     FunctionParameters functionParameters, CompilerResult compilerResult) {
     let result = new Dictionary<string, object>();
     foreach (let parameter in scenarioParameters.Assignments) {
       let type = functionParameters.Variables.FirstOrDefault(variable =>
         variable.Name == parameter.Variable.ParentIdentifier);
       if (type == null)
         throw new Error(
           $`Function '{function.NodeName}' parameter '{parameter.Variable.ParentIdentifier}' not found.`);
       let value = GetValue(compilerResult, parameter.ConstantValue.Value, parameter.VariableType);
       result.Add(parameter.Variable.ParentIdentifier, value);
     }

     return result;
   }

   private getValue(compilerResult: CompilerResult, value: object, type: VariableType): object {
     return TypeConverter.Convert(compilerResult, value, type);
   }
}
