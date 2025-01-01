






namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class LookUpFunctionCall : FunctionCall
{
   private readonly string methodName;

   public LookupFunction LookupFunction { get; }

   public LookUpFunctionCall(LookupFunction lookupFunction) : base(lookupFunction)
   {
     LookupFunction = lookupFunction;
     methodName =
       $"__LookUp{lookupFunction.Table}{lookupFunction.ResultColumn.Member}By{lookupFunction.SearchValueColumn.Member}";
   }

   public override MemberDeclarationSyntax CustomMethodSyntax(ICompileFunctionContext context)
   {
     return MethodDeclaration(
         Types.Syntax(LookupFunction.ResultColumnType),
         Identifier(methodName))
       .WithModifiers(Modifiers.PrivateStatic())
       .WithParameterList(
         ParameterList(
           SeparatedList<ParameterSyntax>(
             new SyntaxNodeOrToken[]
             {
               Parameter(Identifier("condition"))
                 .WithType(Types.Syntax(LookupFunction.SearchValueColumnType)),
               Token(SyntaxKind.CommaToken),
               Parameter(Identifier(LexyCodeConstants.ContextVariable))
                 .WithType(IdentifierName("IExecutionContext"))
             })))
       .WithBody(
         Block(
           SingletonList<StatementSyntax>(
             ReturnStatement(
               InvocationExpression(
                   MemberAccessExpression(
                     SyntaxKind.SimpleMemberAccessExpression,
                     IdentifierName(nameof(BuiltInTableFunctions)),
                     IdentifierName(nameof(BuiltInTableFunctions.LookUp))))
                 .WithArgumentList(
                   ArgumentList(
                     SeparatedList<ArgumentSyntax>(
                       new SyntaxNodeOrToken[]
                       {
                         Arguments.String(LookupFunction.ResultColumn.Member),
                         Token(SyntaxKind.CommaToken),
                         Arguments.String(LookupFunction.SearchValueColumn.Member),
                         Token(SyntaxKind.CommaToken),
                         Arguments.String(LookupFunction.Table),
                         Token(SyntaxKind.CommaToken),
                         Arguments.MemberAccess(ClassNames.TableClassName(LookupFunction.Table),
                           "Values"),
                         Token(SyntaxKind.CommaToken),
                         Argument(IdentifierName("condition")),
                         Token(SyntaxKind.CommaToken),
                         Arguments.MemberAccessLambda("row",
                           LookupFunction.SearchValueColumn.Member),
                         Token(SyntaxKind.CommaToken),
                         Arguments.MemberAccessLambda("row",
                           LookupFunction.ResultColumn.Member),
                         Token(SyntaxKind.CommaToken),
                         Argument(IdentifierName(LexyCodeConstants.ContextVariable))
                       })))))));
   }

   public override ExpressionSyntax CallExpressionSyntax(ICompileFunctionContext context)
   {
     return InvocationExpression(IdentifierName(methodName))
       .WithArgumentList(
         ArgumentList(
           SeparatedList<ArgumentSyntax>(
             new SyntaxNodeOrToken[]
             {
               Argument(ExpressionSyntaxFactory.ExpressionSyntax(LookupFunction.ValueExpression,
                 context)),
               Token(SyntaxKind.CommaToken),
               Argument(IdentifierName(LexyCodeConstants.ContextVariable))
             })));
   }
}
