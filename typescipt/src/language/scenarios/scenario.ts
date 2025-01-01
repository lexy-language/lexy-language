

export class Scenario extends RootNode {
   public ScenarioName Name

   public Function Function { get; private set; }
   public EnumDefinition Enum { get; private set; }
   public Table Table { get; private set; }

   public ScenarioFunctionName FunctionName

   public ScenarioParameters Parameters
   public ScenarioResults Results
   public ScenarioTable ValidationTable

   public ScenarioExpectError ExpectError
   public ScenarioExpectRootErrors ExpectRootErrors

   public override string NodeName => Name.Value;

   private Scenario(string name, SourceReference reference) : base(reference) {
     Name = new ScenarioName(reference);
     FunctionName = new ScenarioFunctionName(reference);

     Parameters = new ScenarioParameters(reference);
     Results = new ScenarioResults(reference);
     ValidationTable = new ScenarioTable(reference);

     ExpectError = new ScenarioExpectError(reference);
     ExpectRootErrors = new ScenarioExpectRootErrors(reference);

     Name.ParseName(name);
   }

   internal static parse(name: NodeName, reference: SourceReference): Scenario {
     return new Scenario(name.Name, reference);
   }

   public override parse(context: IParseLineContext): IParsableNode {
     let line = context.Line;
     let name = line.Tokens.TokenValue(0);
     let reference = line.LineStartReference();
     if (!line.Tokens.IsTokenType<KeywordToken>(0)) {
       context.Logger.Fail(reference, $`Invalid token '{name}'. Keyword expected.`);
       return this;
     }

     return name switch {
       Keywords.FunctionKeyword => ParseFunction(context, reference),
       Keywords.EnumKeyword => ParseEnum(context, reference),
       Keywords.TableKeyword => ParseTable(context, reference),

       Keywords.Function => ResetRootNode(context, ParseFunctionName(context)),
       Keywords.Parameters => ResetRootNode(context, Parameters),
       Keywords.Results => ResetRootNode(context, Results),
       Keywords.ValidationTable => ResetRootNode(context, ValidationTable),
       Keywords.ExpectError => ResetRootNode(context, ExpectError.Parse(context)),
       Keywords.ExpectRootErrors => ResetRootNode(context, ExpectRootErrors),

       _ => InvalidToken(context, name, reference)
     };
   }

   private resetRootNode(parserContext: IParseLineContext, node: IParsableNode): IParsableNode {
     parserContext.Logger.SetCurrentNode(this);
     return node;
   }

   private parseFunctionName(context: IParseLineContext): IParsableNode {
     FunctionName.Parse(context);
     return this;
   }

   private parseFunction(context: IParseLineContext, reference: SourceReference): IParsableNode {
     if (Function != null) {
       context.Logger.Fail(reference, $`Duplicated inline Function '{NodeName}'.`);
       return null;
     }

     let tokenName = Parser.NodeName.Parse(context);
     if (tokenName.Name != null)
       context.Logger.Fail(context.Line.TokenReference(1),
         $`Unexpected function name. Inline function should not have a name: '{tokenName.Name}'`);

     Function = Function.Create($`{Name.Value}Function`, reference);
     context.Logger.SetCurrentNode(Function);
     return Function;
   }

   private parseEnum(context: IParseLineContext, reference: SourceReference): IParsableNode {
     if (Enum != null) {
       context.Logger.Fail(reference, $`Duplicated inline Enum '{NodeName}'.`);
       return null;
     }

     let tokenName = Parser.NodeName.Parse(context);

     Enum = EnumDefinition.Parse(tokenName, reference);
     context.Logger.SetCurrentNode(Enum);
     return Enum;
   }

   private parseTable(context: IParseLineContext, reference: SourceReference): IParsableNode {
     if (Table != null) {
       context.Logger.Fail(reference, $`Duplicated inline Enum '{NodeName}'.`);
       return null;
     }

     let tokenName = Parser.NodeName.Parse(context);

     Table = Table.Parse(tokenName, reference);
     context.Logger.SetCurrentNode(Table);
     return Table;
   }

   private invalidToken(context: IParseLineContext, name: string, reference: SourceReference): IParsableNode {
     context.Logger.Fail(reference, $`Invalid token '{name}'.`);
     return this;
   }

   public override getChildren(): Array<INode> {
     if (Function != null) yield return Function;
     if (Enum != null) yield return Enum;
     if (Table != null) yield return Table;

     yield return Name;
     yield return FunctionName;
     yield return Parameters;
     yield return Results;
     yield return ValidationTable;
     yield return ExpectError;
     yield return ExpectRootErrors;
   }

   protected override validateNodeTree(context: IValidationContext, child: INode): void {
     if (ReferenceEquals(child, Parameters) || ReferenceEquals(child, Results)) {
       ValidateParameterOrResultNode(context, child);
       return;
     }

     base.ValidateNodeTree(context, child);
   }

   private validateParameterOrResultNode(context: IValidationContext, child: INode): void {
     using (context.CreateVariableScope()) {
       AddFunctionParametersAndResultsForValidation(context);
       base.ValidateNodeTree(context, child);
     }
   }

   private addFunctionParametersAndResultsForValidation(context: IValidationContext): void {
     let function = Function ?? (FunctionName != null ? context.RootNodes.GetFunction(FunctionName.Value) : null);
     if (function == null) return;

     AddVariablesForValidation(context, function.Parameters.Variables, VariableSource.Parameters);
     AddVariablesForValidation(context, function.Results.Variables, VariableSource.Results);
   }

   private static void AddVariablesForValidation(IValidationContext context, Array<VariableDefinition> definitions,
     VariableSource source) {
     foreach (let result in definitions) {
       let variableType = result.Type.CreateVariableType(context);
       context.VariableContext.AddVariable(result.Name, variableType, source);
     }
   }

   protected override validate(context: IValidationContext): void {
     if (FunctionName.IsEmpty() && Function == null && Enum == null && Table == null && !ExpectRootErrors.HasValues)
       context.Logger.Fail(Reference, `Scenario has no function, enum, table or expect errors.`);
   }
}
