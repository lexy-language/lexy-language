




namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal abstract class MethodFunctionCall : FunctionCall
{
   public ExpressionFunction Function { get; }

   protected abstract string ClassName { get; }
   protected abstract string MethodName { get; }

   protected MethodFunctionCall(ExpressionFunction function) : base(function)
   {
     Function = function;
   }

   public override MemberDeclarationSyntax CustomMethodSyntax(ICompileFunctionContext context)
   {
     return null;
   }

   public override ExpressionSyntax CallExpressionSyntax(ICompileFunctionContext context)
   {
     var arguments = GetArguments(context);

     return SyntaxFactory.InvocationExpression(
         SyntaxFactory.MemberAccessExpression(
           SyntaxKind.SimpleMemberAccessExpression,
           SyntaxFactory.IdentifierName(ClassName),
           SyntaxFactory.IdentifierName(MethodName)))
       .WithArgumentList(SyntaxFactory.ArgumentList(arguments));
   }

   protected abstract SeparatedSyntaxList<ArgumentSyntax> GetArguments(ICompileFunctionContext context);
}
