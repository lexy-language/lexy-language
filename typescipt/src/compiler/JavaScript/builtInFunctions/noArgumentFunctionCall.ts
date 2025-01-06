

internal abstract class NoArgumentFunctionCall : FunctionCall {
   public NoArgumentFunction Function

   protected abstract string ClassName
   protected abstract string MethodName

   protected NoArgumentFunctionCall(NoArgumentFunction function) super(function) {
     Function = function;
   }

   public override customMethodSyntax(context: ICompileFunctionContext): MemberDeclarationSyntax {
     return null;
   }

   public override callExpressionSyntax(context: ICompileFunctionContext): ExpressionSyntax {
     return SyntaxFactory.InvocationExpression(
       SyntaxFactory.MemberAccessExpression(
         SyntaxKind.SimpleMemberAccessExpression,
         SyntaxFactory.IdentifierName(ClassName),
         SyntaxFactory.IdentifierName(MethodName)));
   }
}
