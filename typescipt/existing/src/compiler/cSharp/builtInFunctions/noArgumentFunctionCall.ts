



namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal abstract class NoArgumentFunctionCall : FunctionCall
{
   public NoArgumentFunction Function { get; }

   protected abstract string ClassName { get; }
   protected abstract string MethodName { get; }

   protected NoArgumentFunctionCall(NoArgumentFunction function) : base(function)
   {
     Function = function;
   }

   public override MemberDeclarationSyntax CustomMethodSyntax(ICompileFunctionContext context)
   {
     return null;
   }

   public override ExpressionSyntax CallExpressionSyntax(ICompileFunctionContext context)
   {
     return SyntaxFactory.InvocationExpression(
       SyntaxFactory.MemberAccessExpression(
         SyntaxKind.SimpleMemberAccessExpression,
         SyntaxFactory.IdentifierName(ClassName),
         SyntaxFactory.IdentifierName(MethodName)));
   }
}
