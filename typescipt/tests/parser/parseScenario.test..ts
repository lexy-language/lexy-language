

export class ParseScenarioTests extends ScopedServicesTestFixture {
  it('XXXX', async () => {
   public testValidScenarioKeyword(): void {
     const string code = @`Scenario: TestScenario`;

     let parser = GetService<ILexyParser>();
     let scenario = parser.ParseScenario(code);

     scenario.Name.Value.ShouldBe(`TestScenario`);
   }

  it('XXXX', async () => {
   public testValidScenario(): void {
     const string code = @`Scenario: TestScenario
  Function TestScenarioFunction
  Parameters
   Value = 123
  Results
   Result = 456`;

     let parser = GetService<ILexyParser>();
     let scenario = parser.ParseScenario(code);

     scenario.Name.Value.ShouldBe(`TestScenario`);
     scenario.FunctionName.Value.ShouldBe(`TestScenarioFunction`);
     scenario.Parameters.Assignments.Count.ShouldBe(1);
     scenario.Parameters.Assignments[0].Variable.ParentIdentifier.ShouldBe(`Value`);
     scenario.Parameters.Assignments[0].ConstantValue.Value.ShouldBe(123m);
     scenario.Results.Assignments.Count.ShouldBe(1);
     scenario.Results.Assignments[0].Variable.ParentIdentifier.ShouldBe(`Result`);
     scenario.Results.Assignments[0].ConstantValue.Value.ShouldBe(456m);
   }

  it('XXXX', async () => {
   public testInvalidScenario(): void {
     const string code = @`Scenario: TestScenario
  Functtion TestScenarioFunction
  Parameters
   Value = 123
  Results
   Result = 456`;

     let parser = GetService<ILexyParser>();
     let scenario = parser.ParseScenario(code);

     let logger = GetService<IParserLogger>();
     let errors = logger.ErrorNodeMessages(scenario);

     logger.NodeHasErrors(scenario).ShouldBeTrue();

     errors.Length.ShouldBe(4, logger.ErrorMessages().Format(2));
     errors[0].ShouldBe(`tests.lexy(2, 3): ERROR - Invalid token 'Functtion'. Keyword expected.`);
     errors[1].ShouldBe(`tests.lexy(1, 1): ERROR - Scenario has no function, enum, table or expect errors.`);
     errors[2].ShouldBe(`tests.lexy(4, 5): ERROR - Unknown variable name: 'Value'.`);
     errors[3].ShouldBe(`tests.lexy(6, 5): ERROR - Unknown variable name: 'Result'.`);
   }

  it('XXXX', async () => {
   public testInvalidNumberValueScenario(): void {
     const string code = @`Scenario: TestScenario
  Function:
   Results
    number Result
  Parameters
   Value = 12d3
  Results
   Result = 456`;

     let parser = GetService<ILexyParser>();
     let scenario = parser.ParseScenario(code);

     let context = GetService<IParserContext>();
     context.Logger.NodeHasErrors(scenario).ShouldBeTrue();

     let errors = context.Logger.ErrorNodeMessages(scenario);
     errors.Length.ShouldBe(1, context.Logger.FormatMessages());
     errors[0].ShouldBe(`tests.lexy(6, 15): ERROR - Invalid number token character: 'd'`);
   }

  it('XXXX', async () => {
   public testScenarioWithInlineFunction(): void {
     const string code = @`Scenario: ValidNumberIntAsParameter
  Function:
   Parameters
    number Value1 = 123
    number Value2 = 456
   Results
    number Result1
    number Result2
   Code
    Result1 = Value1
    Result2 = Value2
  Parameters
   Value1 = 987
   Value2 = 654
  Results
   Result1 = 123
   Result2 = 456`;

     let parser = GetService<ILexyParser>();
     let scenario = parser.ParseScenario(code) ?? throw new Error(`parser.ParseScenario(code)`);

     scenario.Name.Value.ShouldBe(`ValidNumberIntAsParameter`);
     scenario.Function.ShouldNotBeNull();
     scenario.Function.Parameters.Variables.Count.ShouldBe(2);
     scenario.Function.Parameters.Variables[0].Name.ShouldBe(`Value1`);
     scenario.Function.Parameters.Variables[0].Type.ValidateOfType<PrimitiveVariableDeclarationType>(value =>
       ShouldBeStringTestExtensions.ShouldBe(value.Type, `number`));
     scenario.Function.Parameters.Variables[0].DefaultExpression.ToString().ShouldBe(`123`);
     scenario.Function.Parameters.Variables[1].Name.ShouldBe(`Value2`);
     scenario.Function.Parameters.Variables[1].Type.ValidateOfType<PrimitiveVariableDeclarationType>(value =>
       value.Type.ShouldBe(`number`));
     scenario.Function.Parameters.Variables[1].DefaultExpression.ToString().ShouldBe(`456`);
     scenario.Function.Results.Variables.Count.ShouldBe(2);
     scenario.Function.Results.Variables[0].Name.ShouldBe(`Result1`);
     scenario.Function.Results.Variables[0].Type.ValidateOfType<PrimitiveVariableDeclarationType>(value =>
       value.Type.ShouldBe(`number`));
     scenario.Function.Results.Variables[0].DefaultExpression.ShouldBeNull();
     scenario.Function.Results.Variables[1].Name.ShouldBe(`Result2`);
     scenario.Function.Results.Variables[1].Type.ValidateOfType<PrimitiveVariableDeclarationType>(value =>
       value.Type.ShouldBe(`number`));
     scenario.Function.Results.Variables[1].DefaultExpression.ShouldBeNull();
     scenario.Function.Code.Expressions.Count.ShouldBe(2);
     scenario.Function.Code.Expressions[0].ToString().ShouldBe(`Result1=Value1`);
     scenario.Function.Code.Expressions[1].ToString().ShouldBe(`Result2=Value2`);

     scenario.Parameters.Assignments.Count.ShouldBe(2);
     scenario.Parameters.Assignments[0].Variable.ParentIdentifier.ShouldBe(`Value1`);
     scenario.Parameters.Assignments[0].ConstantValue.Value.ShouldBe(987m);
     scenario.Parameters.Assignments[1].Variable.ParentIdentifier.ShouldBe(`Value2`);
     scenario.Parameters.Assignments[1].ConstantValue.Value.ShouldBe(654m);

     scenario.Results.Assignments.Count.ShouldBe(2);
     scenario.Results.Assignments[0].Variable.ParentIdentifier.ShouldBe(`Result1`);
     scenario.Results.Assignments[0].ConstantValue.Value.ShouldBe(123m);
     scenario.Results.Assignments[1].Variable.ParentIdentifier.ShouldBe(`Result2`);
     scenario.Results.Assignments[1].ConstantValue.Value.ShouldBe(456m);
   }

  it('XXXX', async () => {
   public testScenarioWithEmptyParametersAndResults(): void {
     const string code = @`Scenario: ValidateScenarioKeywords
# Validate Scenario keywords
  Function ValidateFunctionKeywords
  Parameters
  Results`;
     let parser = GetService<ILexyParser>();
     let scenario = parser.ParseScenario(code);

     scenario.FunctionName.Value.ShouldBe(`ValidateFunctionKeywords`);
     scenario.Parameters.Assignments.Count.ShouldBe(0);
     scenario.Results.Assignments.Count.ShouldBe(0);
   }

  it('XXXX', async () => {
   public testValidScenarioWithInvalidInlineFunction(): void {
     const string code = @`Scenario: InvalidNumberEndsWithLetter
  Function:
   Results
    number Result
   Code
    Result = 123A
  ExpectError ``Invalid token at 18: Invalid number token character: A```;

     let parser = GetService<ILexyParser>();
     let scenario = parser.ParseScenario(code);

     let logger = GetService<IParserLogger>();

     logger.NodeHasErrors(scenario).ShouldBeFalse();
     logger.NodeHasErrors(scenario.Function).ShouldBeTrue();

     scenario.Function.ShouldNotBeNull();
     scenario.ExpectError.ShouldNotBeNull();
   }

  it('XXXX', async () => {
   public scenarioWithInlineFunctionShouldNotHaveAFunctionNameAfterKeywords(): void {
     const string code = @`Scenario: TestScenario
  Function: ThisShouldNotBeAllowed`;

     let parser = GetService<ILexyParser>();
     let scenario = parser.ParseScenario(code);

     let logger = GetService<IParserLogger>();
     let errors = logger.ErrorNodeMessages(scenario);

     logger.NodeHasErrors(scenario).ShouldBeTrue();

     errors.Length.ShouldBe(1);
     errors[0].ShouldBe(
       `tests.lexy(2, 13): ERROR - Unexpected function name. ` +
       `Inline function should not have a name: 'ThisShouldNotBeAllowed'`);
   }
}
