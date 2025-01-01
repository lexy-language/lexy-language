













namespace Lexy.Compiler.Compiler.CSharp.Writers;

public class FunctionWriter : IRootTokenWriter
{
   public GeneratedClass CreateCode(IRootNode node)
   {
     if (!(node is Function function)) throw new InvalidOperationException("Root token not Function");

     var builtInFunctionCalls = GetBuiltInFunctionCalls(function);
     var context = new CompileFunctionContext(function, builtInFunctionCalls);

     var members = new List<MemberDeclarationSyntax>
     {
       VariableClassFactory.TranslateVariablesClass(LexyCodeConstants.ParametersType,
         function.Parameters.Variables),
       VariableClassFactory.TranslateVariablesClass(LexyCodeConstants.ResultsType, function.Results.Variables),
       RunMethod(function, context)
     };
     members.AddRange(CustomBuiltInFunctions(context));

     var name = context.FunctionClassName();

     var classDeclaration = ClassDeclaration(name)
       .WithModifiers(Modifiers.PublicStatic())
       .WithMembers(List(members));

     return new GeneratedClass(function, name, classDeclaration);
   }

   private IEnumerable<MemberDeclarationSyntax> CustomBuiltInFunctions(ICompileFunctionContext context)
   {
     return context.BuiltInFunctionCalls
       .Select(functionCall => functionCall.CustomMethodSyntax(context))
       .Where(customMethodSyntax => customMethodSyntax ! null);
   }

   private IEnumerable<FunctionCall> GetBuiltInFunctionCalls(Function function)
   {
     return NodesWalker.WalkWithResult(function.Code.Expressions,
       node => node is FunctionCallExpression expression ? FunctionCall.Create(expression) : null);
   }

   private MethodDeclarationSyntax RunMethod(Function function,
     ICompileFunctionContext compileFunctionContext)
   {
     var statements = new List<StatementSyntax>
     {
       GuardStatements.VerifyNotNull(LexyCodeConstants.ParameterVariable),
       GuardStatements.VerifyNotNull(LexyCodeConstants.ContextVariable),
       InitializeResults()
     };
     statements.AddRange(function.Code.Expressions.SelectMany(expression =>
       ExecuteStatementSyntax(expression, compileFunctionContext)));
     statements.Add(ReturnResults());

     var functionSyntax = MethodDeclaration(
         IdentifierName(LexyCodeConstants.ResultsType),
         Identifier(LexyCodeConstants.RunMethod))
       .WithModifiers(Modifiers.PublicStatic())
       .WithParameterList(
         ParameterList(
           SeparatedList<ParameterSyntax>(
             new SyntaxNodeOrToken[]
             {
               Parameter(Identifier(LexyCodeConstants.ParameterVariable))
                 .WithType(IdentifierName(LexyCodeConstants.ParametersType)),
               Token(SyntaxKind.CommaToken),
               Parameter(Identifier(LexyCodeConstants.ContextVariable))
                 .WithType(IdentifierName(nameof(IExecutionContext)))
             })))
       .WithBody(Block(statements));

     return functionSyntax;
   }

   private StatementSyntax ReturnResults()
   {
     return ReturnStatement(IdentifierName(LexyCodeConstants.ResultsVariable));
   }

   private StatementSyntax InitializeResults()
   {
     return LocalDeclarationStatement(
       VariableDeclaration(
           IdentifierName(
             Identifier(TriviaList(), SyntaxKind.VarKeyword, "var", "var", TriviaList())))
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
