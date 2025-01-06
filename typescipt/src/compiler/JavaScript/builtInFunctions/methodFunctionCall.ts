

internal abstract class MethodFunctionCall : FunctionCall {
   public ExpressionFunction Function

   protected abstract string ClassName
   protected abstract string MethodName

   protected MethodFunctionCall(ExpressionFunction function) super(function) {
     Function = function;
   }

   public override customMethodSyntax(context: ICompileFunctionContext): MemberDeclarationSyntax {
     return null;
   }

   public override callExpressionSyntax(context: ICompileFunctionContext): ExpressionSyntax {
     let arguments = GetArguments(context);

     return SyntaxFactory.InvocationExpression(
         SyntaxFactory.MemberAccessExpression(
           SyntaxKind.SimpleMemberAccessExpression,
           SyntaxFactory.IdentifierName(ClassName),
           SyntaxFactory.IdentifierName(MethodName)))
       .WithArgumentList(SyntaxFactory.ArgumentList(arguments));
   }

   protected abstract getArguments(context: ICompileFunctionContext): SeparatedSyntaxArray<ArgumentSyntax>;
}
