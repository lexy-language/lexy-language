

export class PowerFunctionCall extends MethodFunctionCall {
   public PowerFunction PowerFunction

   protected override string ClassName =nameof(): >;
   protected override string MethodName =nameof(): >;

   public PowerFunctionCall(PowerFunction function) : base(function) {
     PowerFunction = function;
   }

   protected override getArguments(context: ICompileFunctionContext): SeparatedSyntaxArray<ArgumentSyntax> {
     return SyntaxFactory.SeparatedArray<ArgumentSyntax>(
       new SyntaxNodeOrToken[] {
         SyntaxFactory.Argument(
           ExpressionSyntaxFactory.ExpressionSyntax(PowerFunction.NumberExpression, context)),
         SyntaxFactory.Token(SyntaxKind.CommaToken),
         SyntaxFactory.Argument(ExpressionSyntaxFactory.ExpressionSyntax(PowerFunction.PowerExpression, context))
       });
   }
}
