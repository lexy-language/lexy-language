

export class LexyFunctionCall extends FunctionCall {
   public LexyFunction ExpressionFunction

   public LexyFunctionCall(LexyFunction expressionFunction) super(expressionFunction) {
     ExpressionFunction = expressionFunction;
   }

   public override customMethodSyntax(context: ICompileFunctionContext): MemberDeclarationSyntax {
     return null;
   }

   public override callExpressionSyntax(context: ICompileFunctionContext): ExpressionSyntax {
     return RunFunction(ExpressionFunction.functionName, ExpressionFunction.VariableName);
   }

   public static runFunction(functionName: string, variableName: string): InvocationExpressionSyntax {
     return SyntaxFactory.InvocationExpression(
         SyntaxFactory.MemberAccessExpression(
           SyntaxKind.SimpleMemberAccessExpression,
           SyntaxFactory.IdentifierName(ClassNames.FunctionClassName(functionName)),
           SyntaxFactory.IdentifierName(LexyCodeConstants.runMethod)))
       .WithArgumentList(
         SyntaxFactory.ArgumentList(
           SyntaxFactory.SeparatedArray<ArgumentSyntax>(
             new SyntaxNodeOrToken[] {
               SyntaxFactory.Argument(SyntaxFactory.IdentifierName(variableName)),
               SyntaxFactory.Token(SyntaxKind.CommaToken),
               SyntaxFactory.Argument(SyntaxFactory.IdentifierName(LexyCodeConstants.ContextVariable))
             })));
   }
}
