





namespace Lexy.Compiler.Compiler.CSharp.BuiltInFunctions;

internal class PowerFunctionCall : MethodFunctionCall
{
   public PowerFunction PowerFunction { get; }

   protected override string ClassName => nameof(BuiltInNumberFunctions);
   protected override string MethodName => nameof(BuiltInNumberFunctions.Power);

   public PowerFunctionCall(PowerFunction function) : base(function)
   {
     PowerFunction = function;
   }

   protected override SeparatedSyntaxList<ArgumentSyntax> GetArguments(ICompileFunctionContext context)
   {
     return SyntaxFactory.SeparatedList<ArgumentSyntax>(
       new SyntaxNodeOrToken[]
       {
         SyntaxFactory.Argument(
           ExpressionSyntaxFactory.ExpressionSyntax(PowerFunction.NumberExpression, context)),
         SyntaxFactory.Token(SyntaxKind.CommaToken),
         SyntaxFactory.Argument(ExpressionSyntaxFactory.ExpressionSyntax(PowerFunction.PowerExpression, context))
       });
   }
}
