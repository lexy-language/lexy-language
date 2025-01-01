





namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class RoundFunctionCall : MethodFunctionCall
{
   public RoundFunction RoundFunction { get; }

   protected override string ClassName => nameof(BuiltInNumberFunctions);
   protected override string MethodName => nameof(BuiltInNumberFunctions.Round);

   public RoundFunctionCall(RoundFunction function) : base(function)
   {
     RoundFunction = function;
   }

   protected override SeparatedSyntaxList<ArgumentSyntax> GetArguments(ICompileFunctionContext context)
   {
     return SyntaxFactory.SeparatedList<ArgumentSyntax>(
       new SyntaxNodeOrToken[]
       {
         SyntaxFactory.Argument(
           ExpressionSyntaxFactory.ExpressionSyntax(RoundFunction.NumberExpression, context)),
         SyntaxFactory.Token(SyntaxKind.CommaToken),
         SyntaxFactory.Argument(
           ExpressionSyntaxFactory.ExpressionSyntax(RoundFunction.DigitsExpression, context))
       });
   }
}
