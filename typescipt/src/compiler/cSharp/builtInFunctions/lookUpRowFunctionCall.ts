

export class LookUpRowFunctionCall extends FunctionCall {
   private readonly string methodName;

   public LookupRowFunction LookupFunction

   public LookUpRowFunctionCall(LookupRowFunction lookupFunction) super(lookupFunction) {
     LookupFunction = lookupFunction;
     methodName =
       $`__LookUp{lookupFunction.Table}RowBy{lookupFunction.SearchValueColumn.Member}`;
   }

   public override customMethodSyntax(context: ICompileFunctionContext): MemberDeclarationSyntax {
     return MethodDeclaration(
         Types.Syntax(LookupFunction.RowType),
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
                     IdentifierName(nameof(BuiltInTableFunctions.LookUpRow))))
                 .WithArgumentList(
                   ArgumentList(
                     SeparatedArray<ArgumentSyntax>(
                       new SyntaxNodeOrToken[] {
                         Arguments.String(LookupFunction.SearchValueColumn.Member),
                         Token(SyntaxKind.CommaToken),
                         Arguments.String(LookupFunction.Table),
                         Token(SyntaxKind.CommaToken),
                         Arguments.MemberAccess(ClassNames.TableClassName(LookupFunction.Table),
                           `Values`),
                         Token(SyntaxKind.CommaToken),
                         Argument(IdentifierName(`condition`)),
                         Token(SyntaxKind.CommaToken),
                         Arguments.MemberAccessLambda(`row`,
                           LookupFunction.SearchValueColumn.Member),
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
