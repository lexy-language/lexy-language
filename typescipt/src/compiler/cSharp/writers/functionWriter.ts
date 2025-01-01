

export class FunctionWriter extends IRootTokenWriter {
   public createCode(node: IRootNode): GeneratedClass {
     if (!(node is Function function)) throw new Error(`Root token not Function`);

     let builtInFunctionCalls = GetBuiltInFunctionCalls(function);
     let context = new CompileFunctionContext(function, builtInFunctionCalls);

     let members = new Array<MemberDeclarationSyntax> {
       VariableClassFactory.TranslateVariablesClass(LexyCodeConstants.ParametersType,
         function.Parameters.Variables),
       VariableClassFactory.TranslateVariablesClass(LexyCodeConstants.ResultsType, function.Results.Variables),
       RunMethod(function, context)
     };
     members.AddRange(CustomBuiltInFunctions(context));

     let name = context.FunctionClassName();

     let classDeclaration = ClassDeclaration(name)
       .WithModifiers(Modifiers.PublicStatic())
       .WithMembers(List(members));

     return new GeneratedClass(function, name, classDeclaration);
   }

   private customBuiltInFunctions(context: ICompileFunctionContext): Array<MemberDeclarationSyntax> {
     return context.BuiltInFunctionCalls
       .Select(functionCall => functionCall.CustomMethodSyntax(context))
       .Where(customMethodSyntax => customMethodSyntax != null);
   }

   private getBuiltInFunctionCalls(function: Function): Array<FunctionCall> {
     return NodesWalker.WalkWithResult(function.Code.Expressions,
       node => node is FunctionCallExpression expression ? FunctionCall.Create(expression) : null);
   }

   private MethodDeclarationSyntax RunMethod(Function function,
     ICompileFunctionContext compileFunctionContext) {
     let statements = new Array<StatementSyntax> {
       GuardStatements.VerifyNotNull(LexyCodeConstants.ParameterVariable),
       GuardStatements.VerifyNotNull(LexyCodeConstants.ContextVariable),
       InitializeResults()
     };
     statements.AddRange(function.Code.Expressions.SelectMany(expression =>
       ExecuteStatementSyntax(expression, compileFunctionContext)));
     statements.Add(ReturnResults());

     let functionSyntax = MethodDeclaration(
         IdentifierName(LexyCodeConstants.ResultsType),
         Identifier(LexyCodeConstants.RunMethod))
       .WithModifiers(Modifiers.PublicStatic())
       .WithParameterList(
         ParameterList(
           SeparatedArray<ParameterSyntax>(
             new SyntaxNodeOrToken[] {
               Parameter(Identifier(LexyCodeConstants.ParameterVariable))
                 .WithType(IdentifierName(LexyCodeConstants.ParametersType)),
               Token(SyntaxKind.CommaToken),
               Parameter(Identifier(LexyCodeConstants.ContextVariable))
                 .WithType(IdentifierName(nameof(IExecutionContext)))
             })))
       .WithBody(Block(statements));

     return functionSyntax;
   }

   private returnResults(): StatementSyntax {
     return ReturnStatement(IdentifierName(LexyCodeConstants.ResultsVariable));
   }

   private initializeResults(): StatementSyntax {
     return LocalDeclarationStatement(
       VariableDeclaration(
           IdentifierName(
             Identifier(TriviaList(), SyntaxKind.VarKeyword, `let`, `let`, TriviaList())))
         .WithVariables(
           SingletonSeparatedList(
             VariableDeclarator(
                 Identifier(LexyCodeConstants.ResultsVariable))
               .WithInitializer(
                 EqualsValueClause(
                   ObjectCreationExpression(
                       IdentifierName(LexyCodeConstants.ResultsType))
                     .WithArgumentList(
                       ArgumentList()))))));
   }
}
