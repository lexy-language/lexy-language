




namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal abstract class SingleArgumentFunctionCall : MethodFunctionCall
{
   public SingleArgumentFunction SingleArgumentFunction { get; }

   protected SingleArgumentFunctionCall(SingleArgumentFunction function) : base(function)
   {
     SingleArgumentFunction = function;
   }

   public override MemberDeclarationSyntax CustomMethodSyntax(ICompileFunctionContext context)
   {
     return null;
   }

   protected override SeparatedSyntaxList<ArgumentSyntax> GetArguments(ICompileFunctionContext context)
   {
     return SyntaxFactory.SingletonSeparatedList(
       SyntaxFactory.Argument(
         ExpressionSyntaxFactory.ExpressionSyntax(SingleArgumentFunction.ValueExpression, context)));
   }
}
