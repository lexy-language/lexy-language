

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

   private Scenario(string name, SourceReference reference) { {
     super(reference);
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
     let line = context.line;
     let name = line.tokens.tokenValue(0);
     let reference = line.lineStartReference();
     if (!line.tokens.isTokenType<KeywordToken>(0)) {
       context.logger.fail(reference, $`Invalid token '{name}'. Keyword expected.`);
       return this;
     }

     return name switch {
       Keywords.FunctionKeyword => ParseFunction(context, reference),
       Keywords.EnumKeyword => ParseEnum(context, reference),
       Keywords.TableKeyword => ParseTable(context, reference),

       Keywords.Function => ResetRootNode(context, ParseFunctionName(context)),
       Keywords.Parameters => ResetRootNode(context, Parameters),
       Keywords.results => ResetRootNode(context, Results),
       Keywords.ValidationTable => ResetRootNode(context, ValidationTable),
       Keywords.ExpectError => ResetRootNode(context, ExpectError.parse(context)),
       Keywords.ExpectRootErrors => ResetRootNode(context, ExpectRootErrors),

       _ => InvalidToken(context, name, reference)
     };
   }

   private resetRootNode(parserContext: IParseLineContext, node: IParsableNode): IParsableNode {
     parserContext.logger.SetCurrentNode(this);
     return node;
   }

   private parseFunctionName(context: IParseLineContext): IParsableNode {
     FunctionName.parse(context);
     return this;
   }

   private parseFunction(context: IParseLineContext, reference: SourceReference): IParsableNode {
     if (Function != null) {
       context.logger.fail(reference, $`Duplicated inline Function '{NodeName}'.`);
       return null;
     }

     let tokenName = Parser.NodeName.parse(context);
     if (tokenName.Name != null)
       context.logger.fail(context.line.TokenReference(1),
         $`Unexpected function name. Inline function should not have a name: '{tokenName.Name}'`);

     Function = Function.Create($`{Name.Value}Function`, reference);
     context.logger.SetCurrentNode(Function);
     return Function;
   }

   private parseEnum(context: IParseLineContext, reference: SourceReference): IParsableNode {
     if (Enum != null) {
       context.logger.fail(reference, $`Duplicated inline Enum '{NodeName}'.`);
       return null;
     }

     let tokenName = Parser.NodeName.parse(context);

     Enum = EnumDefinition.parse(tokenName, reference);
     context.logger.SetCurrentNode(Enum);
     return Enum;
   }

   private parseTable(context: IParseLineContext, reference: SourceReference): IParsableNode {
     if (Table != null) {
       context.logger.fail(reference, $`Duplicated inline Enum '{NodeName}'.`);
       return null;
     }

     let tokenName = Parser.NodeName.parse(context);

     Table = Table.parse(tokenName, reference);
     context.logger.SetCurrentNode(Table);
     return Table;
   }

   private invalidToken(context: IParseLineContext, name: string, reference: SourceReference): IParsableNode {
     context.logger.fail(reference, $`Invalid token '{name}'.`);
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

     addVariablesForValidation(context, function.Parameters.Variables, VariableSource.Parameters);
     addVariablesForValidation(context, function.results.Variables, VariableSource.results);
   }

   private static void addVariablesForValidation(IValidationContext context, Array<VariableDefinition> definitions,
     VariableSource source) {
     foreach (let result in definitions) {
       let variableType = result.Type.createVariableType(context);
       context.variableContext.addVariable(result.Name, variableType, source);
     }
   }

   protected override validate(context: IValidationContext): void {
     if (FunctionName.IsEmpty() && Function == null && Enum == null && Table == null && !ExpectRootErrors.HasValues)
       context.logger.fail(this.reference, `Scenario has no function, enum, table or expect errors.`);
   }
}
