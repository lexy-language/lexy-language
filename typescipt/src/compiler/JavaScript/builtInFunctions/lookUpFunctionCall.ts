

export class LookUpFunctionCall extends FunctionCall {
   private readonly string methodName;

   public LookupFunction LookupFunction

   public LookUpFunctionCall(LookupFunction lookupFunction) super(lookupFunction) {
     LookupFunction = lookupFunction;
     methodName =
       $`__LookUp{lookupFunction.Table}{lookupFunction.resultColumn.Member}By{lookupFunction.searchValueColumn.Member}`;
   }

   public override customMethodSyntax(context: ICompileFunctionContext): MemberDeclarationSyntax {
     return MethodDeclaration(
         Types.Syntax(LookupFunction.resultColumnType),
         Identifier(methodName))
       .WithModifiers(Modifiers.PrivateStatic())
       .WithParameterList(
         ParameterList(
           SeparatedArray<ParameterSyntax>(
             new SyntaxNodeOrToken[] {
               Parameter(Identifier(`condition`))
                 .WithType(Types.Syntax(LookupFunction.SearchValueColumnType)),
               Token(SyntaxKind.CommaToken),
               Parameter(Identifier(LexyCodeConstants.ContextVariable))
                 .WithType(IdentifierName(`IExecutionContext`))
             })))
       .WithBody(
         Block(
           SingletonArray<StatementSyntax>(
             ReturnStatement(
               InvocationExpression(
                   MemberAccessExpression(
                     SyntaxKind.SimpleMemberAccessExpression,
                     IdentifierName(nameof(BuiltInTableFunctions)),
                     IdentifierName(nameof(BuiltInTableFunctions.LookUp))))
                 .WithArgumentList(
                   ArgumentList(
                     SeparatedArray<ArgumentSyntax>(
                       new SyntaxNodeOrToken[] {
                         Arguments.String(LookupFunction.resultColumn.Member),
                         Token(SyntaxKind.CommaToken),
                         Arguments.String(LookupFunction.searchValueColumn.Member),
                         Token(SyntaxKind.CommaToken),
                         Arguments.String(LookupFunction.Table),
                         Token(SyntaxKind.CommaToken),
                         Arguments.MemberAccess(ClassNames.TableClassName(LookupFunction.Table),
                           `Values`),
                         Token(SyntaxKind.CommaToken),
                         Argument(IdentifierName(`condition`)),
                         Token(SyntaxKind.CommaToken),
                         Arguments.MemberAccessLambda(`row`,
                           LookupFunction.searchValueColumn.Member),
                         Token(SyntaxKind.CommaToken),
                         Arguments.MemberAccessLambda(`row`,
                           LookupFunction.resultColumn.Member),
                         Token(SyntaxKind.CommaToken),
                         Argument(IdentifierName(LexyCodeConstants.ContextVariable))
                       })))))));
   }

   public override callExpressionSyntax(context: ICompileFunctionContext): ExpressionSyntax {
     return InvocationExpression(IdentifierName(methodName))
       .WithArgumentList(
         ArgumentList(
           SeparatedArray<ArgumentSyntax>(
             new SyntaxNodeOrToken[] {
               Argument(ExpressionSyntaxFactory.ExpressionSyntax(LookupFunction.valueExpression,
                 context)),
               Token(SyntaxKind.CommaToken),
               Argument(IdentifierName(LexyCodeConstants.ContextVariable))
             })));
   }
}
